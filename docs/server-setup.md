# 婚礼站点 · 阿里云轻量服务器部署指南

本指南覆盖从「拿到一台空的阿里云轻量服务器」到「站点上线、能正常接收 RSVP」的全流程。
顺序执行即可，无需跳读。所有命令都默认 **Ubuntu 22.04 / 24.04**，使用 root 登录（轻量服务器默认就是 root）。

> 本项目相关信息：
>
> - 服务器公网 IP：`8.134.121.12`
> - 域名：`zjs-cxq.top`（备案审核中，备案下来前先用 IP + 非标端口访问）
> - 站点根目录：`/var/www/wedding`
> - API 进程名：`wedding-rsvp`，监听 `127.0.0.1:3001`
> - SQLite 数据库：`/var/www/wedding/server/data/rsvp.db`

---

## 0. 准备工作（本地）

确认你本地能 SSH 登录服务器：

```bash
ssh root@8.134.121.12
```

第一次会让你输密码（或者你已经在阿里云控制台传过密钥）。建议：

1. 本地生成密钥（如果还没有）：

   ```bash
   ssh-keygen -t ed25519 -C "wedding-deploy"
   ```

2. 把公钥上传到服务器：

   ```bash
   ssh-copy-id root@8.134.121.12
   ```

之后 `ssh root@8.134.121.12` 应该不再需要密码。

---

## 1. 服务器基础环境（一次性）

> 全程在服务器上执行（已经 SSH 进去）。

### 1.1 系统更新

```bash
apt update && apt upgrade -y
apt install -y curl ca-certificates gnupg lsb-release rsync sqlite3 nginx ufw
```

### 1.2 安装 Node 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # 应输出 v20.x.x
npm -v
```

### 1.3 安装 PM2（守护 Node 进程）

```bash
npm install -g pm2
pm2 -v
```

### 1.4 创建站点目录

```bash
mkdir -p /var/www/wedding/{dist,server/data}
chown -R root:root /var/www/wedding
```

> `server/data/` 用来存放 SQLite 数据库 `rsvp.db`，**不要随意 rm**。

### 1.5 防火墙（强烈建议开启）

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp        # SSH
ufw allow 8080/tcp      # 备案前临时端口（备案下来后可关闭）
# 备案下来后再放行：
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

**同时去阿里云轻量控制台**「防火墙」里把对应端口也放行一遍（控制台和系统层 ufw 是两层独立的安全组，必须都通过）：

- 22 / TCP（SSH）
- 8080 / TCP（备案前）
- 80、443 / TCP（备案下来后）

---

## 2. 首次推送代码（本地执行）

回到 **本地仓库根目录**：

```bash
cd ~/Project/wedding-zc
```

执行部署：

```bash
npm run deploy
```

脚本会自动完成：

1. 本地 `npm run build`
2. 通过 rsync 把 `dist/` 推到 `/var/www/wedding/dist/`
3. 通过 rsync 把 `server/` 推到 `/var/www/wedding/server/`（自动排除 `data/` 和 `node_modules/`）
4. 在服务器上 `npm ci --omit=dev`
5. 启动或重启 PM2 进程 `wedding-rsvp`

### 2.1 首次启动后做一次 pm2 持久化（仅一次）

部署成功后，SSH 到服务器上执行：

```bash
pm2 save
pm2 startup systemd      # 它会打印一行 sudo env ... 的命令，原样复制再跑一次
```

之后服务器重启 PM2 会自动把 `wedding-rsvp` 拉起来。

### 2.2 验证 Node API 已经在跑

```bash
pm2 status
# 应看到 wedding-rsvp 状态 online

curl -s http://127.0.0.1:3001/api/health
# 应输出 {"ok":true,"ts":"..."}
```

---

## 3. Nginx 配置（备案前 · 临时方案）

备案下来之前，国内 80/443 + 域名访问会被拦截，所以我们走 **IP + 8080**。

### 3.1 写配置文件

```bash
cat > /etc/nginx/sites-available/wedding.conf <<'NGINX'
server {
    listen 8080;
    server_name 8.134.121.12;

    root /var/www/wedding/dist;
    index index.html;

    # 客户端最大请求体（RSVP 表单很小，限制紧一点）
    client_max_body_size 64k;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源 30 天缓存（Vite 输出的文件名带 hash，安全）
    location ~* \.(?:js|css|woff2?|png|jpe?g|webp|svg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API 反代到本机 Node
    location /api/ {
        proxy_pass         http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/wedding.conf /etc/nginx/sites-enabled/wedding.conf
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
```

### 3.2 浏览器验证

打开：

```
http://8.134.121.12:8080
```

应该能看到完整的婚礼站点。提交一条 RSVP，应该立刻显示「感谢您的回执」。

> 如果打不开：
>
> 1. `ufw status` 检查 8080 是否放行
> 2. **阿里云轻量控制台 → 防火墙** 是否放行 8080 / TCP（最容易漏的一步）
> 3. `curl http://127.0.0.1:8080` 在服务器上看是否本机能通

---

## 4. Nginx 配置（备案下来后 · 正式方案）

### 4.1 域名解析

进 **阿里云控制台 → 域名 → DNS 解析**，给 `zjs-cxq.top` 加两条 A 记录：

| 主机记录 | 记录类型 | 解析线路 | 记录值          |
| -------- | -------- | -------- | --------------- |
| `@`      | A        | 默认     | `8.134.121.12`  |
| `www`    | A        | 默认     | `8.134.121.12`  |

DNS 一般几分钟生效，本地 `ping zjs-cxq.top` 看是否返回 `8.134.121.12`。

### 4.2 申请免费 SSL 证书（阿里云）

**阿里云控制台 → SSL 证书 → 免费证书**，为 `zjs-cxq.top` 和 `www.zjs-cxq.top` 各申请一张（或一张多域名证书），下载 **Nginx 格式**（zip 里有 `.pem` 和 `.key` 两个文件）。

把两个文件传到服务器：

```bash
# 本地执行
scp zjs-cxq.top.pem  root@8.134.121.12:/etc/nginx/ssl/zjs-cxq.top.pem
scp zjs-cxq.top.key  root@8.134.121.12:/etc/nginx/ssl/zjs-cxq.top.key
```

服务器上先建目录：

```bash
mkdir -p /etc/nginx/ssl
chmod 700 /etc/nginx/ssl
chmod 600 /etc/nginx/ssl/zjs-cxq.top.key
```

### 4.3 替换 Nginx 配置

```bash
cat > /etc/nginx/sites-available/wedding.conf <<'NGINX'
# 80 强制跳 443
server {
    listen 80;
    server_name zjs-cxq.top www.zjs-cxq.top;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zjs-cxq.top www.zjs-cxq.top;

    ssl_certificate     /etc/nginx/ssl/zjs-cxq.top.pem;
    ssl_certificate_key /etc/nginx/ssl/zjs-cxq.top.key;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    root /var/www/wedding/dist;
    index index.html;

    client_max_body_size 64k;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:js|css|woff2?|png|jpe?g|webp|svg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
NGINX

nginx -t
systemctl reload nginx
```

### 4.4 防火墙调整

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw delete allow 8080/tcp     # 不再需要
ufw status
```

阿里云轻量控制台 → 防火墙 里同步：放行 80 / 443，删除 8080。

打开 `https://zjs-cxq.top` 验证，浏览器应显示绿色锁。

### 4.5 证书续期（重要）

阿里云免费证书有效期只有 **3 个月**（例如本次签发是 `2026-05-29 ~ 2026-08-26`）。
到期前证书会失效，浏览器会报「不安全」。续期步骤和首次部署完全一样：

1. 阿里云控制台 → 数字证书管理服务 → 免费证书 → 重新申请一张（同样绑定 `zjs-cxq.top`，含 www）。
2. 下载 Nginx 格式，得到新的 `.pem` 和 `.key`。
3. 本地 `scp` 覆盖服务器上的两个文件（文件名保持不变，nginx 配置就不用动）：

   ```bash
   scp 新证书.pem  root@8.134.121.12:/etc/nginx/ssl/zjs-cxq.top.pem
   scp 新证书.key  root@8.134.121.12:/etc/nginx/ssl/zjs-cxq.top.key
   ```

4. 服务器上重新加载（无需重启，不影响在线访问）：

   ```bash
   chmod 600 /etc/nginx/ssl/zjs-cxq.top.key
   nginx -t && systemctl reload nginx
   ```

5. 验证新有效期：

   ```bash
   echo | openssl s_client -connect zjs-cxq.top:443 -servername zjs-cxq.top 2>/dev/null \
     | openssl x509 -noout -dates
   ```

> 查看当前证书还有多久到期，随时可以跑上面第 5 步那条 `openssl` 命令。
> 建议在 `notAfter` 日期前一周处理，避免到期当天手忙脚乱。

### 4.6 微信内打开域名验证

如果要让站点能在微信里正常打开（微信「业务域名 / 网页授权域名」校验），微信团队会要求在
**网站根目录**放一个验证 TXT 文件，并能通过 `https://zjs-cxq.top/<文件名>.txt` 访问到指定内容。

**关键：验证文件必须放到项目的 `public/` 目录，不要直接丢到服务器的 `dist/`。**
因为部署脚本用 `rsync --delete`，直接放服务器上的文件会在下次 `npm run deploy` 时被删掉。
放进 `public/` 后，Vite 构建会自动把它拷进 `dist/` 根目录，永久生效。

操作：

1. 按微信给的文件名和内容，在本地创建文件（示例）：

   ```bash
   # 文件名是微信给的那一串，内容也是微信给的那一串
   printf '微信给的内容串' > public/微信给的文件名.txt
   ```

2. 部署：

   ```bash
   npm run deploy
   ```

3. 验证（应原样返回微信给的内容串）：

   ```bash
   curl -s https://zjs-cxq.top/微信给的文件名.txt
   ```

4. 回到微信验证页面点「已部署，开始验证」。

> 这类验证文件留在 `public/` 里不用删，长期放着也没有副作用；微信偶尔会复查。

---

## 5. 日常运维

### 5.1 查看进程状态 / 日志

```bash
pm2 status
pm2 logs wedding-rsvp           # 实时日志
pm2 logs wedding-rsvp --lines 200
pm2 restart wedding-rsvp        # 重启
pm2 stop wedding-rsvp           # 停止（一般不用）
```

### 5.2 查看 Nginx 访问 / 错误日志

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 5.3 查询 RSVP 数据

```bash
# 总数
sqlite3 /var/www/wedding/server/data/rsvp.db \
  "select count(*) from wedding_rsvp;"

# 最近 20 条
sqlite3 -header -column /var/www/wedding/server/data/rsvp.db \
  "select id, name, phone, attendance, guests, created_at
   from wedding_rsvp
   order by created_at desc
   limit 20;"

# 出席人数汇总
sqlite3 -header -column /var/www/wedding/server/data/rsvp.db \
  "select attendance, guests, count(*)
   from wedding_rsvp
   group by attendance, guests;"
```

### 5.4 导出名单（CSV）

```bash
sqlite3 -header -csv /var/www/wedding/server/data/rsvp.db \
  "select id, name, phone, attendance, guests, message, created_at
   from wedding_rsvp
   order by created_at;" \
  > /tmp/rsvp-$(date +%F).csv

# 下载到本地
# 本地执行：
# scp root@8.134.121.12:/tmp/rsvp-$(date +%F).csv ~/Desktop/
```

### 5.5 想用 GUI 看数据

把 `rsvp.db` 拷回本地，用 [DB Browser for SQLite](https://sqlitebrowser.org/) 打开：

```bash
# 本地执行
scp root@8.134.121.12:/var/www/wedding/server/data/rsvp.db ~/Desktop/rsvp.db
```

---

## 6. 自动备份（每天 03:00）

服务器上执行：

```bash
mkdir -p /var/backups/wedding

cat > /etc/cron.d/wedding-rsvp-backup <<'CRON'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

0 3 * * * root /usr/bin/sqlite3 /var/www/wedding/server/data/rsvp.db ".backup '/var/backups/wedding/rsvp-$(date +\%F).db'" && find /var/backups/wedding -name 'rsvp-*.db' -mtime +30 -delete
CRON

chmod 644 /etc/cron.d/wedding-rsvp-backup
```

验证：

```bash
ls -lh /var/backups/wedding/         # 第二天早上之后应该开始有文件
```

> `.backup` 是 SQLite 内置的原子快照，即使写入并发也安全。保留最近 30 天。

---

## 7. 日常上线流程（已经搭好之后）

本地修改完代码之后：

```bash
# 普通发布
npm run deploy

# 仅前端有改动，跳过 server/ 推送（更快）
npm run deploy -- --skip-server

# 本地已经 build 过，不想再 build
npm run deploy -- --skip-build
```

部署完成后，浏览器强刷一下页面验证。

---

## 8. 故障排查清单

| 现象 | 排查步骤 |
|---|---|
| 浏览器打不开站点 | 1) 在本地 `curl -I http://8.134.121.12:8080` 看返回码<br>2) 服务器 `systemctl status nginx`、`nginx -t`<br>3) `ufw status` 和阿里云控制台防火墙是否都放行了端口 |
| 站点能开但 RSVP 提交 502 | 1) `pm2 status` 看 wedding-rsvp 是否 online<br>2) `pm2 logs wedding-rsvp --lines 100` 看报错<br>3) `curl http://127.0.0.1:3001/api/health` 看 Node 是否能直连 |
| 提交一直显示「过于频繁」 | 当前同 IP 5 秒一次限流；测试时换个网络或等 5 秒 |
| 提交返回 400 bad_xxx | 看错误码对应字段：`bad_name` / `bad_phone` / `bad_guests` 等，回去检查前端表单值 |
| 数据库被覆盖 / 文件没了 | 1) 立即 `ls /var/backups/wedding/` 找最近一个备份<br>2) `cp /var/backups/wedding/rsvp-YYYY-MM-DD.db /var/www/wedding/server/data/rsvp.db`<br>3) `pm2 restart wedding-rsvp` |
| 部署脚本报 npm ci 失败 | 服务器登上去手动跑一次 `cd /var/www/wedding/server && npm ci --omit=dev` 看具体报错；通常是 Node 版本不够（需要 ≥ 18） |
| pm2 重启后进程没起来 | `pm2 logs wedding-rsvp --err`；常见是 `data/` 目录不存在或权限不够，`mkdir -p /var/www/wedding/server/data` 再 `pm2 restart` |
| HTTPS 报证书过期 | 阿里云免费证书有效期 1 年（或 3 个月，看证书类型），提前续签并重新 `scp` 上传两个文件，然后 `systemctl reload nginx` |

---

## 9. 安全 checklist

- [ ] SSH 已经禁用密码登录、改用 key（编辑 `/etc/ssh/sshd_config`：`PasswordAuthentication no`，再 `systemctl reload ssh`）
- [ ] ufw 已经 enable，默认 deny incoming
- [ ] 阿里云轻量控制台只放行真正需要的端口
- [ ] Node 只监听 `127.0.0.1`，不要去掉 `host` 参数
- [ ] `/var/www/wedding/server/data/` 不在 rsync 同步范围之内
- [ ] 自动备份 cron 已生效，且 `/var/backups/wedding/` 有定期文件

---

## 10. 一些扩展能力（可选，按需做）

- **简单看板**：写个 `GET /api/admin/rsvp?token=xxx` 接口（加一个静态 token），管理端浏览器直接拉 JSON 看数据，避免每次 SSH。
- **微信通知**：每次新提交时调用企业微信 / 飞书 webhook 推一条消息到新人手机。
- **CDN 加速**：备案下来后接入阿里云 CDN，把 `dist/` 推到 OSS，进一步减轻服务器压力（婚礼站规模其实用不上）。
- **Let's Encrypt 自动续签**：如果不想用阿里云免费证书，可以装 `certbot` 自动续签：
  ```bash
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d zjs-cxq.top -d www.zjs-cxq.top
  ```
  会自动改 Nginx 配置并加 cron。

祝顺利上线，婚礼圆满。
