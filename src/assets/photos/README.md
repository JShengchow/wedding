# 图片替换说明

当前前端实际引用的图片已经按页面用途分类编号，替换时尽量保持文件名和格式不变。

## 页面图片

- `hero-01-cover.webp`: 首屏全屏背景图。
- `story-01-open.webp`: “爱情与友情”模块右侧图片。
- `lunbo-01.webp` 至 `lunbo-05.webp`: “浪漫瞬间”顶部轮播专用图。
- `gallery-01.webp` 至 `gallery-24.webp`: “浪漫瞬间”、回忆曲线、旅行地图共用的相册图。
- `feature-01.webp`、`feature-02.webp`: 四宫格精选区第 3、4 张专用图。

四宫格精选区第 1、2 张复用 `gallery-05.webp`、`gallery-18.webp`。

## 公共图片

- `public/share-01-og.jpg`: 站点社交分享图，对应首页 HTML meta。
- `public/preview-01-theme.jpg`: `public/theme-preview.html` 主题预览页用图。
- `public/favicon.svg`: 站点图标，保留约定命名。

## 替换规则

- 直接覆盖同名文件最省事，覆盖后无需改代码。
- 相册编号从 1 开始；代码里的 `photoIndex` 从 0 开始，例如 `gallery-01.webp` 对应 `photoIndex: 0`。
- 如果放入原图后使用 `npm run optimize:images`，建议在 `photos-source/` 中也使用同样的基础文件名，例如 `story-01-open.png` 会生成 `story-01-open.webp`。
