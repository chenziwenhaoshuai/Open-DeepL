# OpenDeepL for macOS

This folder contains the macOS build of OpenDeepL. It is kept separate from the Windows application in the repository root so the Windows code can remain unchanged.

## Requirements

- macOS 12 or newer
- Node.js 20 or newer
- An OpenRouter API key

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run dist:mac
```

The packaged `.dmg` and `.zip` files are written to `release/`.

## macOS Behavior

- The default shortcut is `Command+C+C`.
- If `Command+C` conflicts with normal copy behavior on your Mac, open Settings and change the modifier to `Option`; the shortcut becomes `Option+C+C`.
- The app uses Electron's native `globalShortcut` API for macOS.
- Launch at startup uses macOS login item settings.
- Settings are stored under Electron's user data directory in development and next to the packaged app in production.

## Notes

GitHub Release builds use ad-hoc signing for local testing. If macOS still reports that the app is damaged, clear the quarantine flag:

```bash
xattr -cr /Applications/OpenDeepL.app
```

For public distribution, sign and notarize the app with an Apple Developer ID certificate. Ad-hoc signing is not a substitute for notarization.
