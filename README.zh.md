# Karsa Studio

<p align="center">
  <img src="public/favicon.svg" width="96" height="96" alt="Karsa Studio 徽标" />
</p>

<p align="center">
  <strong>现代化、极速、100% 客户端运行的文本转图表 (Text-to-Diagram) 演练场</strong>
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="README.id.md">Bahasa Indonesia</a> •
  <a href="README.zh.md">中文 (Mandarin)</a> •
  <a href="README.ja.md">日本語 (Japanese)</a> •
  <a href="README.ru.md">Русский (Russian)</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/许可证-CC%20BY--NC%204.0-blue.svg" alt="许可证: CC BY-NC 4.0" />
  <img src="https://img.shields.io/badge/架构-100%25%20客户端-brightgreen.svg" alt="100% 客户端" />
  <img src="https://img.shields.io/badge/PWA-离线优先-orange.svg" alt="PWA 离线优先" />
  <img src="https://img.shields.io/badge/Mermaid.js-v12+-blueviolet.svg" alt="Mermaid.js v12+" />
  <img src="https://img.shields.io/badge/编辑器-CodeMirror%206-informational.svg" alt="CodeMirror 6" />
</p>

---

**Karsa Studio** 是一款功能全面、专业的*文本转图表 (Text-to-Diagram)* 编辑器，作为**开源 (非商业)** 项目发布。它的渲染与解析完全在您的浏览器内进行（100% 客户端处理），这意味着没有任何图表数据会上传到外部服务器。它将基于代码的图表灵活性与类 Figma 的直观画布交互融为一体，旨在赋能软件工程师、系统架构师、产品经理和技术写作者，在数秒内将复杂思路与系统架构转化为高品质的视觉图表。

🌐 **在线体验:** [karsa-studio.rivaldigunawanyusuf.com](https://karsa-studio.rivaldigunawanyusuf.com)

---

## 🚀 核心亮点与特色功能

### 🔒 100% 客户端运行，严守隐私与离线优先 (PWA)
- **零服务端延迟:** 图表渲染与语法分析完全依托本地 Web Worker 与浏览器原生 JavaScript 执行。
- **隐私设计:** 您的私有系统架构图、数据库模式和专有业务逻辑永远不会离开您的本地设备。
- **渐进式 Web 应用 (PWA):** 可直接作为桌面或移动端独立 App 安装，初次加载后可在断网环境下完全离线使用。

### 🎨 Figma 风格交互式画布
- **Space + 拖拽平移画布:** 按住 `空格键 (Space)` 并按住鼠标左键/触控板拖动，即可在无限画布上丝滑平移，与 Figma、Miro 操作习惯完全一致。
- **直观缩放体验:** 支持 `Ctrl/Cmd + 滚轮` 平滑缩放、触控板双指捏合缩放或画布底部浮动工具栏缩放。
- **快捷视角对齐:** 支持 1:1 实际比例视角 (`Cmd/Ctrl + 1`) 与全局自适应居中 (`Cmd/Ctrl + 0` 或双击画布空白处)。
- **多样化画布背景:** 支持点状网格 (Dots)、线条网格 (Grid)、纯色平铺 (Plain) 与透明背景 (Transparent)。

### 💻 专业的 CodeMirror 6 编辑器
- **现代语法高亮与实时校验:** 实时检测 Mermaid 语法错误，提供行号错误指示器与即时提示框。
- **桌面与移动端顺畅滚动:** 严谨的视口高度与 CSS 弹性容器约束，支持滚轮、触控板惯性滚动以及移动端触摸滑动。
- **快速插入工具栏:** 一键快速插入节点、菱形判断框、子图 (Subgraph)、数据库圆柱体、圆圈、虚线链接及粗箭头。
- **专业级代码编辑能力:** 多光标编辑 (`Alt + 点击`)、代码块折叠、括号自动补全、行注释切换 (`Cmd/Ctrl + /`) 与全文查找替换 (`Cmd/Ctrl + F`)。
- **灵活自适应布局:** 分屏模式支持自由拖拽调节宽度、支持横屏/竖屏方向切换，并具备一键全屏代码编辑或全屏图表预览模式。

### 📚 内置 24 套行业级精选图表模板
开箱即用的专业模板，按 6 大场景清晰分类：
1. **流程与状态 (Flowcharts & Process):** 标准流程图、架构流程图 (LR 横向)、状态机模型。
2. **数据库与代码 (Databases & Code):** 关系型数据库 ER 图 (PK/FK)、面向对象类图、需求追踪矩阵、网络数据包字节布局。
3. **交互与系统 (Interactions & Systems):** 时序图 (认证鉴权流程)、云系统架构图、C4 系统上下文架构、自由块状系统图。
4. **规划与路线 (Planning & Roadmap):** 甘特图项目进度排期、产品历史时间线、用户旅程图、看板任务面板、Git 分支与合并图。
5. **分析与数据 (Analytics & Data):** 饼图占比分布、XY 轴折线/柱状指标图、2x2 象限优先级矩阵、桑基能源/资源流动图、雷达图属性分析、矩形树图 (Treemap)。
6. **构思与头脑风暴 (Ideation):** 树状思维导图 (Mindmap) 与空白初始画布。

### 🎭 视觉主题引擎与深度样式定制
- **深色与浅色模式:** 优雅的深色玻璃拟态 (Glassmorphism) 与高对比度浅色模式无缝切换。
- **Mermaid 原生基础主题:** 支持 Default、Neutral、Forest、Dark 与 Base 主题。
- **艺术风格预设:** 手绘草图 (Sketch)、极简 (Minimal)、现代 (Modern)、新拟物 (Neumorphic)、赛博朋克 (Cyberpunk)、复古 (Retro)、柔和马卡龙 (Pastel) 与高对比度。
- **先进图布局引擎:** 支持传统 Dagre 算法以及适用于复杂网络的 ELK (Eclipse Layout Kernel) 算法。
- **自定义色彩调色板:** 实时微调主色、次色、文本色、线条色、边框色、子图背景与注释配色。

### 📤 多格式导出与零后端加密分享
- **矢量与超清位图导出:** 支持无损矢量 SVG、超清 PNG (最高 4x 视网膜清晰度) 及标准 PDF 格式。
- **一键快捷剪贴板:** 直接将 Mermaid 源码、Markdown 嵌入块 (兼容 Notion、GitHub、Obsidian)、SVG 代码或 PNG 图像复制到剪贴板。
- **零服务端加密链接分享:** 基于 URL 锚点哈希与 `pako` zlib 算法压缩打包图表数据，无需任何数据库即可还原完整图表与样式设置。
- **工程备份与恢复:** 独立导出单个 `.krs` / `.mmd` 文件，或将整个多文档工作区打包备份为 `.karsa` / `.json`。

### 🌐 5 种语言全面本地化 (i18n)
无感即时切换，涵盖所有交互文案与 24 个模板说明：
- 🇨🇳 **中文 (Mandarin)**
- 🇬🇧 **English**
- 🇮🇩 **Bahasa Indonesia**
- 🇯🇵 **日本語 (Japanese)**
- 🇷🇺 **Русский (Russian)**

---

## ⌨️ 常用快捷键速查表

快捷键修饰符会根据您的操作系统自动适配（macOS 为 **⌘ Cmd**，Windows 与 Linux 为 **Ctrl**）：

| 分类 | 操作说明 | Mac 快捷键 | Windows / Linux 快捷键 |
| :--- | :--- | :--- | :--- |
| **画布** | **平移 / 拖拽画布** | `Space + 拖动` | `Space + 拖动` |
| **画布** | **放大 / 缩小** | `Cmd + =` / `Cmd + -` | `Ctrl + =` / `Ctrl + -` |
| **画布** | **适应当前视口** | `Cmd + 0` *(或双击画布)* | `Ctrl + 0` *(或双击画布)* |
| **画布** | **实际尺寸 (1:1)** | 点击界面 `1:1` 按钮 | 点击界面 `1:1` 按钮 |
| **编辑器** | **保存快照并渲染** | `Cmd + S` | `Ctrl + S` |
| **编辑器** | **强制立即重绘** | `Cmd + Enter` | `Ctrl + Enter` |
| **编辑器** | **查找与替换** | `Cmd + F` | `Ctrl + F` |
| **编辑器** | **切换代码注释** | `Cmd + /` | `Ctrl + /` |
| **编辑器** | **撤销 / 重做** | `Cmd + Z` / `Cmd + Shift + Z` | `Ctrl + Z` / `Ctrl + Y` |
| **编辑器** | **增加 / 减少缩进** | `Tab` / `Shift + Tab` | `Tab` / `Shift + Tab` |
| **编辑器** | **多光标同时编辑** | `Alt + 点击` | `Alt + 点击` |
| **编辑器** | **折叠 / 展开代码块** | `Cmd + Alt + [` | `Ctrl + Alt + [` |
| **编辑器** | **代码自动提示补全** | `Ctrl + Space` | `Ctrl + Space` |
| **应用** | **新建空白文档** | `Alt + N` | `Alt + N` |
| **应用** | **展开 / 折叠侧边栏** | `Cmd + B` | `Ctrl + B` |
| **应用** | **快捷导出 SVG** | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| **应用** | **打开快捷键指南** | `?` | `?` |

---

## 🛠️ 本地安装与开发指南

由于 Karsa Studio 没有任何后端或数据库依赖，在本地运行极其快捷：

### 环境准备
- [Node.js](https://nodejs.org/) (建议版本 18+)
- 包管理器 `npm`、`pnpm` 或 `yarn`

### 1. 自动化启动脚本

**macOS / Linux:**
```bash
# 赋予执行权限 (仅初次需要)
chmod +x start.sh

# 运行自动化脚本
./start.sh
```

**Windows:**
在文件资源管理器中双击 `start.bat`，或在命令行运行：
```cmd
start.bat
```

### 2. 手动启动步骤
```bash
# 克隆代码仓库
git clone https://github.com/rivaldigunawanyusuf/karsa-studio.git
cd karsa-studio

# 安装依赖
npm install

# 启动 Vite 本地开发服务器
npm run dev
```

在浏览器中打开 `http://localhost:5173/` 即可开始使用。

---

## 📂 项目结构剖析

```
mermaid-studio/
├── index.html              # 单页应用 (SPA) 主入口与结构
├── docs.html               # 交互式 Mermaid 语法速查与文档说明
├── nginx-security.conf     # Nginx 反向代理配置与生产安全响应头规范
├── package.json            # 依赖包声明与 npm 构建脚本
├── vite.config.js          # Vite 构建流水线与 PWA 离线缓存配置
├── start.sh                # macOS / Linux 自动化启动脚本
├── start.bat               # Windows 自动化启动批处理脚本
├── public/                 # 静态资源、矢量图标与 PWA manifest
└── src/
    ├── main.js             # 应用主调度器与全局事件交互中心
    ├── styles/
    │   └── index.css       # 设计系统变量规范、毛玻璃 UI 与响应式适配
    └── lib/
        ├── editor.js       # CodeMirror 6 初始化、代码校验及扩展
        ├── exporter.js     # 高清矢量 SVG、4x PNG 与 PDF 导出渲染模块
        ├── i18n.js         # 5 种语言完整词典与实时无刷新翻译引擎
        ├── mermaid-lang.js # 基于 Lezer 语法的 Mermaid 语言解析规则
        ├── renderer.js     # Mermaid.js 与 ELK 图布局计算驱动器
        ├── share.js        # 基于 pako zlib 的无状态压缩 URL 分享编码
        ├── store.js        # 基于 LocalStorage 与响应式 EventTarget 的状态中心
        ├── templates.js    # 24 款行业级精美图表模板集合
        ├── themes.js       # 视觉配色、艺术风格预设与布局选项
        └── ui.js           # 浮动提示 (Toast)、弹窗及辅助视图组件
```

---

## 🚀 生产环境部署 (Production Deployment)

Karsa Studio 最终编译输出为纯粹、高度优化的**静态单页应用 (SPA)**：

```bash
# 编译生产打包代码
npm run build
```

该命令将在 `dist/` 目录下生成打包产物。您可以将 `dist/` 部署至任意静态网站托管平台：
- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **自主搭建的 Nginx / Apache / Caddy** (可直接引入 `nginx-security.conf` 启用安全标头如 CSP、HSTS 及 MIME 防嗅探)。

---

## 📄 许可证与使用协议 (License)

本项目采用 **知识共享署名-非商业性使用 4.0 国际许可协议 (CC BY-NC 4.0)**。

- **您可以自由：** 分享、复刻并根据个人学习、非营利内部工具、学术研究或开源贡献需要修改源代码。
- **必须遵守以下条款：** 必须保留作者署名。**严禁将本项目或其衍生版本用于商业盈利目的，严禁作为付费产品转售或商业化运营。** 商业权益归原作者所有。

---

## 👤 原作者与鸣谢

由 **Rivaldi Gunawan Yusuf** 用心打造。特别致谢优秀的开源项目 [Mermaid.js](https://mermaid.js.org/) 与 [CodeMirror](https://codemirror.net/)！

如有任何改进建议或疑问，欢迎在 GitHub 上提出 Issue 或交流探讨。
