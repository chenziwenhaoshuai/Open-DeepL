# OpenDeepL 🚀

一个受 DeepL Windows 客户端启发的桌面翻译工具，使用 OpenRouter 兼容的大模型接口完成翻译。

> 这个项目的初衷很简单：DeepL 的会员限制、频繁更新和部分功能门槛用起来不够顺手，所以做了一个更可控的本地替代工具。你可以自己配置 API Key、模型和快捷键。

## 📦 下载

直接到 Releases 下载 Windows 单文件版：

👉 [下载 OpenDeepL-Setup.exe](https://github.com/chenziwenhaoshuai/Open-DeepL/releases/latest)

下载后运行 `OpenDeepL-Setup.exe` 安装。安装过程中可以选择是否创建桌面快捷方式和开始菜单快捷方式。首次启动会自动打开设置页，引导你配置 OpenRouter API Key。

## ✨ 功能亮点

- 🪟 类 DeepL 的双栏翻译界面
- ⚡ 全局快捷键翻译，默认 `Ctrl+C+C`
- 🔧 可自定义快捷键、双击间隔、模型名
- 🔑 在设置里配置 OpenRouter API Key
- 🌏 支持中文 / English 界面切换
- 🕘 最近翻译记录可折叠，不挡主窗口
- 🚀 可选择开机自启
- 🧠 默认模型：`deepseek/deepseek-v4-flash`

## 🧭 快速使用

1. 下载并运行 [Release 里的安装器](https://github.com/chenziwenhaoshuai/Open-DeepL/releases/latest)。
2. 安装时按需勾选桌面快捷方式和开始菜单快捷方式。
3. 在首次弹出的设置页里填入 OpenRouter API Key。
4. 需要时修改模型名，例如 `deepseek/deepseek-v4-flash`。
5. 在任意软件中选中文本。
6. 按默认快捷键 `Ctrl+C+C`，OpenDeepL 会读取剪贴板并翻译。

## ⚙️ OpenRouter 配置

OpenDeepL 使用 OpenRouter Chat Completions API：

```text
https://openrouter.ai/api/v1/chat/completions
```

默认模型：

```text
deepseek/deepseek-v4-flash
```

你可以在应用的「设置」里修改：

- API Key
- 模型名
- 快捷键
- 系统语言
- 开机自启

## 🔐 安全说明

- 请不要把真实 API Key 提交到 Git。
- `.env` 已加入 `.gitignore`。
- `.env.example` 只包含占位符。
- Release 版本不会读取项目根目录的 `.env`。
- 用户需要在应用设置里自行配置 API Key。

## 🛠️ 本地开发

安装依赖：

```powershell
npm install
```

启动开发版：

```powershell
npm run dev
```

构建前端：

```powershell
npm run build
```

使用 electron-builder 打包：

```powershell
npm run dist
```

如果你的网络环境无法下载 electron-builder 的 Windows 辅助二进制，也可以先用开发模式运行。

## 🧩 技术栈

- Electron
- React
- Vite
- TypeScript
- OpenRouter API
- `node-global-key-listener`

## 📌 说明

OpenDeepL 不是 DeepL 官方产品，也不隶属于 DeepL。它只是一个为个人使用场景构建的开源桌面翻译工具。
