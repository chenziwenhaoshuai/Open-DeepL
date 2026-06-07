# OpenDeepL

OpenDeepL is a Windows desktop translator inspired by the DeepL desktop app. It uses OpenRouter-compatible large language models for translation and focuses on quick translation from selected text.

## Features

- Two-pane text translation interface.
- Global quick translation shortcut.
- Default shortcut: `Ctrl+C+C`.
- Configurable shortcut modifier, repeated key, and double-press interval.
- OpenRouter API key and model configuration in Settings.
- Chinese and English app UI.
- Collapsible recent translation history.
- Optional launch at Windows startup.

## Translation Provider

The app calls the OpenRouter chat completions API:

```text
https://openrouter.ai/api/v1/chat/completions
```

Default model:

```text
deepseek/deepseek-v4-flash
```

You can change the API key and model name in the app Settings.

## Security Notes

- Do not commit real API keys.
- `.env` is ignored by Git.
- `.env.example` only contains placeholder values.
- Packaged builds do not read the project `.env` file. Users must configure their API key in Settings after launching the app.

## Development

Install dependencies:

```powershell
npm install
```

Run the desktop app in development mode:

```powershell
npm run dev
```

Build the frontend:

```powershell
npm run build
```

Package with electron-builder:

```powershell
npm run dist
```

If electron-builder cannot download its Windows helper binaries in your network environment, you can still build and run the app in development mode.

## First Launch

On first launch, if no API key is configured, OpenDeepL opens Settings automatically and asks the user to enter an OpenRouter API key.

## Shortcut Translation

1. Select text in any application.
2. Press the configured shortcut, by default `Ctrl+C+C`.
3. OpenDeepL reads the copied text from the clipboard and translates it.

## Repository

```text
git@github.com:chenziwenhaoshuai/Open-DeepL.git
```
