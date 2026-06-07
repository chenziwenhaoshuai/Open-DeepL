/// <reference types="vite/client" />

type TranslatePayload = {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
};

type OpenDeepLBridge = {
  translate: (payload: TranslatePayload) => Promise<string>;
  readClipboard: () => Promise<string>;
  writeClipboard: (text: string) => Promise<void>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  getOpenRouterModels: () => Promise<OpenRouterModel[]>;
  onShortcutTranslate: (callback: (payload: { text: string }) => void) => () => void;
  onShortcutEmpty: (callback: () => void) => () => void;
  onAppError: (callback: (message: string) => void) => () => void;
};

type OpenRouterModel = {
  id: string;
  name: string;
  contextLength: number;
  isFree: boolean;
};

type AppSettings = {
  shortcutEnabled: boolean;
  shortcutModifier: 'CTRL' | 'ALT' | 'SHIFT' | 'META';
  shortcutKey: string;
  shortcutWindowMs: number;
  apiKey: string;
  model: string;
  appLanguage: 'zh' | 'en';
  autoLaunch: boolean;
};

interface Window {
  openDeepL: OpenDeepLBridge;
}
