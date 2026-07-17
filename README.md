# 来钱 · 项目记账

按项目分类的随手记账应用。数据保存在浏览器本地（`localStorage`），无需服务器、无需登录，打开即用。

## 功能

- **分项目记账**：每一笔支出都归属于某个项目（如「装修房子」「日本旅行」），项目之间互不混淆。
- **明细记录**：每个项目下可以查看所有支出记录，包含时间、用途、金额、备注。
- **导出 Excel**：任意项目都可以一键导出 `.xlsx`，包含「汇总」（总金额、笔数、按用途分类汇总）和「明细」（逐笔流水）两个工作表。
- **快速记账，支持补录**：新增一笔支出时，默认使用当前日期时间和当前项目，但日期时间和所属项目都可以手动修改，方便事后补录，同时避免记错项目。

## 本地运行

需要先安装 [Node.js](https://nodejs.org/)（建议 18 及以上版本）。

```bash
npm install
npm run dev
```

打开终端提示的地址（默认 `http://localhost:5173`）即可在浏览器中使用。

## 打包发布

```bash
npm run build
```

构建结果在 `dist/` 目录，是纯静态文件，可以直接部署到 GitHub Pages、Vercel、Netlify 或任意静态网站空间。

### 部署到 GitHub Pages（已内置 Actions 工作流）

项目里已经带了 `.github/workflows/deploy.yml`，会在每次推送到 `main` 分支时自动构建并发布，不需要你手动打包。

1. 在 GitHub 新建一个空仓库（不要勾选自动生成 README，避免冲突）。
2. 把本项目推送上去：

   ```bash
   git init
   git add .
   git commit -m "init: 来钱记账 app"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. 打开仓库 `Settings → Pages`，「Build and deployment」的 Source 选择 **GitHub Actions**（只需要设置这一次）。
4. 回到仓库的 `Actions` 标签页，会看到 `Deploy to GitHub Pages` 这个工作流已经在跑；跑完（一两分钟）后，`Settings → Pages` 顶部会显示访问地址，形如：

   ```
   https://你的用户名.github.io/你的仓库名/
   ```

5. 以后每次改代码，`git push` 到 `main` 分支就会自动重新构建发布，无需再手动操作。

> 如果 `Actions` 标签页提示 workflow 被禁用，去 `Settings → Actions → General` 把 "Allow all actions" 打开即可。

> 因为数据存储在浏览器本地，同一个 App 在不同设备/不同浏览器打开，看到的数据不会自动同步。如果需要跨设备使用，请定期用「导出 Excel」功能备份，或者后续接入云端数据库。

## 项目结构

```
laiqian-app/
├── .github/
│   └── workflows/
│       └── deploy.yml       # 推送到 main 分支自动构建并发布到 GitHub Pages
├── index.html              # 页面入口
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx             # React 挂载入口
    ├── App.jsx              # 顶层状态管理（项目列表 / 项目详情切换）
    ├── index.css             # 全局样式（账本 + 印章视觉风格）
    ├── components/
    │   ├── Header.jsx           # 顶部红色横幅（项目列表页 / 项目详情页共用）
    │   ├── SealStamp.jsx         # 印章图形（Logo & 记账成功提示）
    │   ├── ProjectList.jsx       # 项目列表（首页）
    │   ├── ProjectCard.jsx       # 单个项目卡片
    │   ├── ProjectFormModal.jsx  # 新建/编辑项目弹窗
    │   ├── ProjectDetail.jsx     # 项目详情页（账目明细 + 记一笔 + 导出）
    │   ├── ExpenseList.jsx       # 账本明细列表
    │   ├── ExpenseForm.jsx       # 记一笔 / 编辑记录 弹窗
    │   ├── ConfirmDialog.jsx     # 通用二次确认弹窗
    │   └── Modal.jsx             # 通用弹窗容器
    └── utils/
        ├── storage.js        # localStorage 读写（项目、记录的增删改查）
        ├── export.js         # 导出 Excel（xlsx，含明细 + 汇总两个工作表）
        └── id.js              # 生成本地唯一 ID
```

## 数据存储说明

所有数据都保存在浏览器的 `localStorage` 中，键名：

- `laiqian:projects` — 项目列表
- `laiqian:expenses` — 所有支出记录（每条记录带 `projectId` 指向所属项目）

清除浏览器缓存/数据会导致记账内容丢失，建议定期使用「导出 Excel」备份重要项目。

## 技术栈

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [SheetJS (xlsx)](https://docs.sheetjs.com/) 用于生成 Excel 文件
- 纯前端，无后端依赖
