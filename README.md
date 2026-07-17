# 来钱 · 项目记账

按项目分类的随手记账安卓 App。数据保存在手机本地，**装好之后完全离线可用**，不需要网络、不需要登录、不需要服务器。

## 功能

- **分项目记账**：每一笔支出都归属于某个项目（如「装修房子」「日本旅行」），项目之间互不混淆。
- **明细记录**：每个项目下可以查看所有支出记录，包含时间、用途、金额、备注。
- **导出 Excel**：任意项目都可以一键导出 `.xlsx`，包含「汇总」（总金额、笔数、按用途分类汇总）和「明细」（逐笔流水）两个工作表，导出后会弹出安卓自带的分享面板，可以选择保存到手机、发到微信/邮箱等。
- **快速记账，支持补录**：新增一笔支出时，默认使用当前日期时间和当前项目，但日期时间和所属项目都可以手动修改，方便事后补录，同时避免记错项目。

## 获取安卓安装包（推荐，全程不用装开发工具）

项目里已经带好了 GitHub Actions 工作流（`.github/workflows/build-apk.yml`），推送到 GitHub 后会**自动在云端编译出 `.apk` 安装包**，你不需要在自己电脑上装 Android Studio。

1. 新建 GitHub 仓库，把本项目推上去（见下面「推送到 GitHub」）。
2. 打开仓库的 `Actions` 标签页，等 `Build Android APK` 这个工作流跑完（第一次大概 3-5 分钟，因为要下载安卓 SDK）。
3. 跑完之后，去仓库的 `Releases` 页面（地址是 `https://github.com/你的用户名/你的仓库名/releases`），能看到一个叫 **来钱 最新安装包** 的发布，下面挂着 `laiqian-debug.apk`，点击下载。
4. 用手机浏览器打开这个下载链接（或者把 apk 传到手机上），点开安装。手机可能会提示"未知来源"的安全提示，允许安装即可（这是正常的，因为这个 apk 没有走应用商店签名，是免费编译出来的调试版安装包，不影响正常使用）。
5. 装好之后桌面上会出现"来钱"图标（红底金字的印章样式），点开就能用，全程不需要联网。

> 以后你每次改代码、`git push` 到 `main` 分支，这个 Release 里的 apk 都会自动重新生成、覆盖更新，手机上重新下载安装最新的 apk 覆盖安装即可（数据不会丢，因为是同一个 applicationId）。

### 推送到 GitHub

```bash
git init
git add .
git commit -m "init: 来钱记账 app"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

private 仓库也完全没问题——APK 构建和 Release 发布跟仓库公开/私有没有关系（只有 GitHub Pages 网页托管才要求免费账号必须是 public 仓库）。

## 本地开发 / 网页版预览

如果你想在电脑上直接跑网页版调试界面：

需要先安装 [Node.js](https://nodejs.org/)（建议 18 及以上版本）。

```bash
npm install
npm run dev
```

打开终端提示的地址（默认 `http://localhost:5173`）即可在浏览器中预览。**注意**：网页版和安卓 App 版的数据是分开存储的，互不影响；正式使用请以安装的安卓 App 为准。

## 本地打包安卓 APK（可选，需要装 Android Studio / SDK）

如果你不想用 GitHub Actions 云端编译，也可以在自己电脑上打包：

```bash
npm install
npm run build          # 构建网页资源到 dist/
npx cap sync android   # 把最新代码同步进安卓工程
cd android
./gradlew assembleDebug   # Windows 用 gradlew.bat assembleDebug
```

生成的 apk 在 `android/app/build/outputs/apk/debug/app-debug.apk`。

## 项目结构

```
laiqian-app/
├── .github/
│   └── workflows/
│       ├── build-apk.yml    # 推送到 main 分支自动编译 apk 并发布到 Release
│       └── deploy.yml       # （可选）推送到 main 分支自动发布网页版到 GitHub Pages
├── android/                 # Capacitor 生成的安卓原生工程（图标、启动画面已按品牌视觉定制）
├── index.html                # 网页入口
├── capacitor.config.ts        # App 名称、包名（com.laiqian.app）等原生配置
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
        ├── export.js         # 导出 Excel（网页端直接下载；安卓 App 内走系统分享面板）
        └── id.js              # 生成本地唯一 ID
```

## 数据存储说明

App 内所有数据都保存在手机本地（WebView 的 `localStorage`），键名：

- `laiqian:projects` — 项目列表
- `laiqian:expenses` — 所有支出记录（每条记录带 `projectId` 指向所属项目）

**卸载 App 或清除 App 数据会导致记账内容丢失**，请定期用「导出 Excel」功能备份重要项目。数据只存在这一台手机上，换手机或重装不会自动同步，如果需要多设备同步，后续可以考虑接入云端数据库（可以再找我加）。

## 技术栈

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) 构建界面
- [Capacitor](https://capacitorjs.com/) 把网页应用打包成原生安卓 App（`android/` 目录）
- [SheetJS (xlsx)](https://docs.sheetjs.com/) 生成 Excel 文件；在 App 内通过 `@capacitor/filesystem` + `@capacitor/share` 写入文件并调起系统分享面板
- GitHub Actions 云端自动编译 apk，无需本地安装 Android Studio
