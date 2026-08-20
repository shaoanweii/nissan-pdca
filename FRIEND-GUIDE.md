# 东风日产 VOC 报表 Demo 使用说明

## 包内内容

- `src/`：Vue 3 + TypeScript 前端源码
- `public/`：公共静态资源
- `dist/`：已完成生产构建的静态产物
- `qa/`、`docs/`：页面验收截图与项目补充材料
- `package.json`、`package-lock.json`：依赖及脚本定义

本交付包已排除 `node_modules`、`.git`、缓存、日志、环境文件及原 README 中的开发账号信息。

## 环境要求

- Node.js 20.x（推荐 20.11.0）
- npm 10.x 或兼容版本

## 本地启动

在当前目录打开终端并执行：

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

浏览器访问：

```text
http://localhost:4173/report/
```

规则配置页面：

```text
http://localhost:4173/report/#/risk/rules
```

课题管理页面：

```text
http://localhost:4173/report/#/risk/warning
```

项目默认启用本地 Mock 数据，不需要连接后端，也不需要登录账号。

## 检查与构建

```bash
npm run type-check
npm run build-only
```

构建产物生成在 `dist/`。如需预览构建结果：

```bash
npm run preview -- --host 0.0.0.0
```

## 注意事项

- 局域网访问地址会随电脑当前网络变化，优先使用终端启动时 Vite 输出的 `Network` 地址。
- 首次安装依赖需要联网，安装时间取决于网络速度。
- 包内已附最新构建产物；只查看页面时也可以直接将 `dist/` 部署到静态 Web 服务器，并保持 `/report/` 基础路径。
