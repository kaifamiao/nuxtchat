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

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
```

## 部署

### Vercel 部署

1. 点击 Vercel 部署按钮
2. 使用 GitHub 账号登录
3. 配置环境变量：
   - `OPENAI_API_KEY`: 你的 OpenAI API 密钥
   - `CODE`: 页面访问密码（可选）

### Docker 部署

```bash
# 拉取镜像
docker pull yidadaa/chatgpt-next-web

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key \
  -e CODE=your_access_password \
  nuxtchat
```

### 本地部署

```bash
# 构建
npm run build

# 启动
node .output/server/index.mjs
```

## 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | 是 |
| `CODE` | 页面访问密码 | 否 |
| `BASE_URL` | OpenAI 代理地址 | 否 |
| `HIDE_USER_API_KEY` | 禁止用户自行填入 API Key | 否 |
| `CUSTOM_MODELS` | 自定义模型列表 | 否 |
| `DEFAULT_MODEL` | 默认模型 | 否 |

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
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── locales/         # 国际化文件
├── modules/         # Nuxt 模块
├── pages/           # 页面组件
├── plugins/         # 插件
├── public/          # 公共资源
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型
├── app.vue          # 应用入口
├── nuxt.config.ts   # Nuxt 配置
└── tailwind.config.js # Tailwind 配置
```

## 许可证

MIT License
