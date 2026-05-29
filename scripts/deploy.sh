#!/usr/bin/env bash
set -euo pipefail

# 阿里云轻量服务器部署脚本
#
# 用法:
#   npm run deploy
#   npm run deploy -- --skip-build        # 跳过本地 build（已经 build 过）
#   npm run deploy -- --skip-server       # 只推送 dist，不动 server/
#   SSH_HOST=root@1.2.3.4 npm run deploy  # 临时覆盖目标主机
#
# 环境变量:
#   SSH_HOST     SSH 登录串，默认 root@8.134.121.12
#   REMOTE_ROOT  服务器上站点根目录，默认 /var/www/wedding
#   SSH_PORT     SSH 端口，默认 22

SSH_HOST="${SSH_HOST:-root@8.134.121.12}"
REMOTE_ROOT="${REMOTE_ROOT:-/var/www/wedding}"
SSH_PORT="${SSH_PORT:-22}"

SKIP_BUILD=0
SKIP_SERVER=0

for arg in "$@"; do
  case "$arg" in
    --skip-build)  SKIP_BUILD=1 ;;
    --skip-server) SKIP_SERVER=1 ;;
    -h|--help)
      sed -n '1,20p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not installed locally." >&2
  exit 1
fi

SSH_CMD=(ssh -p "$SSH_PORT")
RSYNC_SSH="ssh -p $SSH_PORT"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "==> Building production bundle..."
  npm run build
else
  echo "==> Skipping build (--skip-build)"
fi

if [[ ! -d dist ]]; then
  echo "dist/ not found. Run 'npm run build' first." >&2
  exit 1
fi

echo "==> Ensuring remote directories exist..."
"${SSH_CMD[@]}" "$SSH_HOST" "mkdir -p $REMOTE_ROOT/dist $REMOTE_ROOT/server/data"

echo "==> Uploading dist/ -> $SSH_HOST:$REMOTE_ROOT/dist/"
rsync -avz --delete -e "$RSYNC_SSH" dist/ "$SSH_HOST:$REMOTE_ROOT/dist/"

if [[ "$SKIP_SERVER" -eq 0 ]]; then
  echo "==> Uploading server/ -> $SSH_HOST:$REMOTE_ROOT/server/"
  # IMPORTANT: --exclude data 保护数据库文件 rsvp.db；--exclude node_modules 让服务器侧自行 npm ci
  rsync -avz --delete \
    --exclude node_modules \
    --exclude data \
    -e "$RSYNC_SSH" \
    server/ "$SSH_HOST:$REMOTE_ROOT/server/"

  echo "==> Installing server deps & restarting PM2 process..."
  "${SSH_CMD[@]}" "$SSH_HOST" bash <<EOF
set -euo pipefail
cd "$REMOTE_ROOT/server"
npm ci --omit=dev
if pm2 describe wedding-rsvp >/dev/null 2>&1; then
  pm2 restart wedding-rsvp --update-env
else
  pm2 start index.mjs --name wedding-rsvp
  pm2 save
fi
EOF
else
  echo "==> Skipping server upload (--skip-server)"
fi

echo "==> Done. Site root: $REMOTE_ROOT"
