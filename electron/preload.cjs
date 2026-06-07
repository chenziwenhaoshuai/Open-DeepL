const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('openDeepL', {
  translate: (payload) => ipcRenderer.invoke('translate', payload),
  translateStream: (payload) => ipcRenderer.invoke('translate-stream', payload),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  writeClipboard: (text) => ipcRenderer.invoke('write-clipboard', text),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getOpenRouterModels: () => ipcRenderer.invoke('get-openrouter-models'),
  onShortcutTranslate: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('shortcut-translate', listener);
    return () => ipcRenderer.removeListener('shortcut-translate', listener);
  },
  onShortcutEmpty: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('shortcut-empty', listener);
    return () => ipcRenderer.removeListener('shortcut-empty', listener);
  },
  onAppError: (callback) => {
    const listener = (_event, message) => callback(message);
    ipcRenderer.on('app-error', listener);
    return () => ipcRenderer.removeListener('app-error', listener);
  },
  onTranslateStreamChunk: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('translate-stream-chunk', listener);
    return () => ipcRenderer.removeListener('translate-stream-chunk', listener);
  },
  onTranslateStreamDone: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('translate-stream-done', listener);
    return () => ipcRenderer.removeListener('translate-stream-done', listener);
  },
});
