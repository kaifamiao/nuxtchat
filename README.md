# NuxtChat

一个使用 Vue 3 + Nuxt 4 构建的轻量、快速的 AI 助手界面，完全复刻 NextChat 功能。

## 功能特性

- 🚀 **快速部署**：支持 Vercel 一键部署和 Docker 部署
- 🔒 **隐私优先**：所有数据存储在本地浏览器
- 🎨 **美观界面**：使用 Tailwind CSS v4 构建现代化 UI
- 🌙 **深色模式**：支持浅色/深色/系统主题切换
- 🌍 **多语言**：支持中文、英文、日文、法文
- 🤖 **多模型**：支持 OpenAI、Claude、Gemini、DeepSeek 等
- 📱 **响应式**：完美适配桌面和移动设备
- 📦 **PWA 支持**：可安装为桌面应用
- 🔌 **插件系统**：支持计算器、日期时间等插件
- 📝 **Markdown**：支持代码高亮、LaTeX 公式
- 🎭 **提示词模板**：内置多种角色模板

## 技术栈

- **框架**：Vue 3 + Nuxt 4
- **样式**：Tailwind CSS v4
- **图标**：Lucide Vue Next
- **状态管理**：Pinia
- **国际化**：@nuxtjs/i18n
- **Markdown**：marked + highlight.js + katex

## 快速开始

### 前置要求

- [Bun](https://bun.sh/) >= 1.0 (推荐使用 Bun 获得最佳性能)
- Node.js >= 18 (如果使用 npm/yarn/pnpm)

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. 开发模式

```bash
bun run dev
```

访问 http://localhost:3000

### 4. 构建

```bash
bun run build
```

### 5. 预览

```bash
# 使用 Node.js 运行生产构建
node .output/server/index.mjs

# 或使用 Bun 运行
bun run .output/server/index.mjs
```

## 部署

### Vercel 部署

1.  Fork 本项目到 GitHub
2.  访问 [Vercel](https://vercel.com)
3.  点击 "New Project" 导入你的仓库
4.  在环境变量设置中添加：
    - `OPENAI_API_KEY`: 你的 OpenAI API 密钥
    - `CODE`: 页面访问密码（可选）
5.  点击 "Deploy"

### Docker 部署

```bash
# 方法一：使用 docker-compose
docker-compose up -d

# 方法二：手动运行
docker build -t nuxtchat .
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key \
  -e CODE=your_access_password \
  nuxtchat
```

使用 Bun 镜像：

```bash
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key \
  oven/bun bun run dev
```

### 本地部署

```bash
# 构建
bun run build

# 启动
bun run .output/server/index.mjs
```

## 环境变量

| 变量名 | 说明 | 必填 | 默认值 |
|--------|------|------|--------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | 是 | - |
| `CODE` | 页面访问密码 | 否 | - |
| `BASE_URL` | OpenAI 代理地址 | 否 | https://api.openai.com/v1 |
| `HIDE_USER_API_KEY` | 禁止用户自行填入 API Key | 否 | 0 |
| `DISABLE_GPT4` | 禁用 GPT-4 | 否 | 0 |
| `CUSTOM_MODELS` | 自定义模型列表 | 否 | - |
| `DEFAULT_MODEL` | 默认模型 | 否 | gpt-4o |

## 支持的模型

### OpenAI
- GPT-4o
- GPT-4o Mini
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo

### Anthropic
- Claude Sonnet 4
- Claude 3.5 Sonnet
- Claude 3 Opus

### Google
- Gemini 2.0 Flash
- Gemini 1.5 Pro

### 其他
- DeepSeek Chat
- DeepSeek Coder

## 项目结构

```
nuxtchat/
├── assets/          # 静态资源
├── components/      # Vue 组件
│   ├── Button.vue       # 按钮组件
│   ├── ChatPanel.vue    # 聊天主界面
│   ├── Input.vue        # 输入框组件
│   ├── MarkdownRenderer.vue # Markdown 渲染
│   ├── MaskSelector.vue # 提示词模板选择器
│   ├── Modal.vue        # 模态框
│   ├── PluginManager.vue # 插件管理器
│   ├── SettingsPanel.vue # 设置面板
│   ├── Sidebar.vue      # 侧边栏
│   └── ThemeToggle.vue  # 主题切换
├── composables/     # 组合式函数
│   ├── useChatApi.ts    # Chat API
│   └── usePlugins.ts    # 插件系统
├── layouts/         # 布局组件
├── locales/         # 国际化文件
├── modules/         # Nuxt 模块
├── pages/           # 页面组件
├── plugins/         # 插件
├── public/          # 公共资源
├── server/          # 服务端 API
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型
├── app.vue          # 应用入口
├── nuxt.config.ts   # Nuxt 配置
└── tailwind.config.js # Tailwind 配置
```

## 内置提示词模板

- 🤖 AI 助手 - 通用 AI 助手
- 🌐 翻译助手 - 专业翻译
- 💻 编程助手 - 代码编写、调试
- ✍️ 写作助手 - 文章写作、润色
- 📚 教学助手 - 知识讲解
- 📊 数据分析师 - 数据分析
- 🎨 设计师 - 设计建议
- 💼 顾问 - 商业咨询

## 内置插件

- 🧮 计算器 - 执行数学计算
- 📅 日期时间 - 获取当前日期和时间
- 🔍 网络搜索 - 使用搜索引擎查找信息
- 💻 代码执行 - 执行简单的代码片段
- 🌐 翻译 - 翻译文本到指定语言

## 许可证

MIT License
