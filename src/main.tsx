import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  History,
  Languages,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

type HistoryItem = {
  id: number;
  source: string;
  result: string;
  sourceLanguage: string;
  targetLanguage: string;
};

type SettingsDraft = AppSettings;
type AppLanguage = AppSettings['appLanguage'];

const languageOptions = [
  { value: 'English (US)', zh: '\u82f1\u8bed\uff08\u7f8e\u5f0f\uff09', en: 'English (US)' },
  { value: '\u4e2d\u6587', zh: '\u4e2d\u6587', en: 'Chinese' },
  { value: '\u65e5\u8bed', zh: '\u65e5\u8bed', en: 'Japanese' },
  { value: '\u97e9\u8bed', zh: '\u97e9\u8bed', en: 'Korean' },
  { value: '\u6cd5\u8bed', zh: '\u6cd5\u8bed', en: 'French' },
  { value: '\u5fb7\u8bed', zh: '\u5fb7\u8bed', en: 'German' },
  { value: '\u897f\u73ed\u7259\u8bed', zh: '\u897f\u73ed\u7259\u8bed', en: 'Spanish' },
  { value: '\u4fc4\u8bed', zh: '\u4fc4\u8bed', en: 'Russian' },
  { value: '\u610f\u5927\u5229\u8bed', zh: '\u610f\u5927\u5229\u8bed', en: 'Italian' },
  { value: '\u8461\u8404\u7259\u8bed', zh: '\u8461\u8404\u7259\u8bed', en: 'Portuguese' },
];

const i18n = {
  zh: {
    settings: '\u8bbe\u7f6e',
    detectSource: '\u68c0\u6d4b\u6e90\u8bed\u8a00',
    swapLanguages: '\u4ea4\u6362\u8bed\u8a00',
    inputPlaceholder: '\u8f93\u5165\u6216\u7c98\u8d34\u6587\u672c\u8fdb\u884c\u7ffb\u8bd1',
    quickTipPrefix: '\u9009\u4e2d\u6587\u672c\u540e\u6309',
    quickTipSuffix: '\u5feb\u901f\u7ffb\u8bd1',
    pasteFromClipboard: '\u4ece\u526a\u8d34\u677f\u7c98\u8d34',
    paste: '\u7c98\u8d34',
    clear: '\u6e05\u7a7a',
    translate: '\u7ffb\u8bd1',
    translating: '\u6b63\u5728\u7ffb\u8bd1...',
    resultPlaceholder: '\u7ffb\u8bd1\u7ed3\u679c\u4f1a\u663e\u793a\u5728\u8fd9\u91cc',
    copied: '\u5df2\u590d\u5236',
    copy: '\u590d\u5236',
    shortcut: '\u5feb\u6377\u952e',
    off: '\u5df2\u5173\u95ed',
    model: '\u6a21\u578b',
    history: '\u6700\u8fd1\u7ffb\u8bd1',
    historyAria: '\u5386\u53f2\u8bb0\u5f55',
    settingsAria: '\u8bbe\u7f6e',
    closeSettings: '\u5173\u95ed\u8bbe\u7f6e',
    appLanguage: '\u7cfb\u7edf\u8bed\u8a00',
    chinese: '\u4e2d\u6587',
    english: 'English',
    enableShortcut: '\u542f\u7528\u5feb\u6377\u952e\u7ffb\u8bd1',
    autoLaunch: '\u5f00\u673a\u81ea\u542f',
    modifier: '\u4fee\u9970\u952e',
    repeatKey: '\u8fde\u6309\u6309\u952e',
    doublePressInterval: '\u53cc\u51fb\u95f4\u9694 ms',
    modelName: '\u6a21\u578b\u540d',
    fetchModels: '\u83b7\u53d6\u6a21\u578b\u5217\u8868',
    loadingModels: '\u6b63\u5728\u83b7\u53d6...',
    freeModelsOnly: '\u4ec5\u663e\u793a Free \u6a21\u578b',
    modelListPlaceholder: '\u5148\u83b7\u53d6\u6a21\u578b\u5217\u8868',
    modelsLoaded: '\u5df2\u83b7\u53d6\u6a21\u578b\u5217\u8868\u3002',
    modelsLoadFailed: '\u83b7\u53d6\u6a21\u578b\u5217\u8868\u5931\u8d25\u3002',
    cancel: '\u53d6\u6d88',
    save: '\u4fdd\u5b58',
    translateFailed: '\u7ffb\u8bd1\u5931\u8d25\u3002',
    errorTitle: '\u51fa\u9519\u4e86',
    loadSettingsFailed: '\u8bfb\u53d6\u8bbe\u7f6e\u5931\u8d25\u3002',
    emptyClipboard: '\u526a\u8d34\u677f\u6ca1\u6709\u53ef\u7ffb\u8bd1\u7684\u6587\u672c\u3002\u8bf7\u5148\u9009\u4e2d\u6587\u672c\u5e76\u590d\u5236\uff0c\u518d\u89e6\u53d1\u5feb\u6377\u952e\u3002',
    apiKeyRequired: '\u8bf7\u5148\u5728\u8bbe\u7f6e\u91cc\u914d\u7f6e OpenRouter API Key\u3002',
  },
  en: {
    settings: 'Settings',
    detectSource: 'Detect language',
    swapLanguages: 'Swap languages',
    inputPlaceholder: 'Type or paste text to translate',
    quickTipPrefix: 'Select text, then press',
    quickTipSuffix: 'to translate quickly',
    pasteFromClipboard: 'Paste from clipboard',
    paste: 'Paste',
    clear: 'Clear',
    translate: 'Translate',
    translating: 'Translating...',
    resultPlaceholder: 'Translation results appear here',
    copied: 'Copied',
    copy: 'Copy',
    shortcut: 'Shortcut',
    off: 'Off',
    model: 'Model',
    history: 'Recent translations',
    historyAria: 'Translation history',
    settingsAria: 'Settings',
    closeSettings: 'Close settings',
    appLanguage: 'System language',
    chinese: '\u4e2d\u6587',
    english: 'English',
    enableShortcut: 'Enable shortcut translation',
    autoLaunch: 'Launch at startup',
    modifier: 'Modifier',
    repeatKey: 'Repeat key',
    doublePressInterval: 'Double-press interval ms',
    modelName: 'Model name',
    fetchModels: 'Fetch models',
    loadingModels: 'Loading...',
    freeModelsOnly: 'Free models only',
    modelListPlaceholder: 'Fetch models first',
    modelsLoaded: 'Model list loaded.',
    modelsLoadFailed: 'Failed to load model list.',
    cancel: 'Cancel',
    save: 'Save',
    translateFailed: 'Translation failed.',
    errorTitle: 'Something went wrong',
    loadSettingsFailed: 'Failed to load settings.',
    emptyClipboard: 'The clipboard has no translatable text. Select and copy text first, then trigger the shortcut.',
    apiKeyRequired: 'Configure your OpenRouter API key in Settings first.',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

const fallbackSettings: SettingsDraft = {
  shortcutEnabled: true,
  shortcutModifier: 'CTRL',
  shortcutKey: 'C',
  shortcutWindowMs: 650,
  apiKey: '',
  model: 'deepseek/deepseek-v4-flash',
  appLanguage: 'zh',
  autoLaunch: false,
};

function formatShortcut(settings: Pick<AppSettings, 'shortcutModifier' | 'shortcutKey'>) {
  return `${settings.shortcutModifier}+${settings.shortcutKey}+${settings.shortcutKey}`;
}

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('English (US)');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<SettingsDraft>(fallbackSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState('');
  const [freeModelsOnly, setFreeModelsOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = i18n[settings.appLanguage];

  const sourceLabel = useMemo(
    () => (sourceLanguage === 'auto' ? t.detectSource : sourceLanguage),
    [sourceLanguage, t.detectSource],
  );

  const runTranslate = useCallback(
    async (text = input) => {
      const trimmed = text.trim();
      setError('');
      setCopied(false);
      if (!trimmed) {
        setOutput('');
        return;
      }

      setInput(text);
      setLoading(true);
      try {
        const result = await window.openDeepL.translate({
          text: trimmed,
          sourceLanguage,
          targetLanguage,
        });
        setOutput(result);
        setHistory((items) => [
          {
            id: Date.now(),
            source: trimmed,
            result,
            sourceLanguage: sourceLabel,
            targetLanguage,
          },
          ...items.slice(0, 9),
        ]);
      } catch (translationError) {
        setError(translationError instanceof Error ? translationError.message : t.translateFailed);
      } finally {
        setLoading(false);
      }
    },
    [input, sourceLanguage, sourceLabel, targetLanguage, t.translateFailed],
  );

  useEffect(() => {
    window.openDeepL
      .getSettings()
      .then((loadedSettings) => {
        setSettings(loadedSettings);
        if (!loadedSettings.apiKey.trim()) {
          setSettingsOpen(true);
        }
      })
      .catch((settingsError) => {
        setError(settingsError instanceof Error ? settingsError.message : i18n.zh.loadSettingsFailed);
      });
  }, []);

  useEffect(() => {
    const offShortcut = window.openDeepL.onShortcutTranslate(({ text }) => {
      runTranslate(text);
    });
    const offEmpty = window.openDeepL.onShortcutEmpty(() => {
      setError(i18n[settings.appLanguage].emptyClipboard);
    });
    const offError = window.openDeepL.onAppError((message) => setError(message));

    return () => {
      offShortcut();
      offEmpty();
      offError();
    };
  }, [runTranslate, settings.appLanguage]);

  async function pasteFromClipboard() {
    const text = await window.openDeepL.readClipboard();
    setInput(text);
  }

  async function copyOutput() {
    if (!output) return;
    await window.openDeepL.writeClipboard(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function saveSettings(nextSettings: SettingsDraft) {
    const saved = await window.openDeepL.saveSettings({
      ...nextSettings,
      shortcutKey: nextSettings.shortcutKey.trim().toUpperCase().slice(0, 1) || 'C',
      shortcutWindowMs: Math.max(250, Math.min(1500, Number(nextSettings.shortcutWindowMs) || 650)),
    });
    setSettings(saved);
    if (saved.apiKey.trim()) {
      setError('');
    }
    setSettingsOpen(false);
  }

  async function fetchModels() {
    setModelsLoading(true);
    setModelsError('');
    try {
      const nextModels = await window.openDeepL.getOpenRouterModels();
      setModels(nextModels);
    } catch (modelsLoadError) {
      setModelsError(modelsLoadError instanceof Error ? modelsLoadError.message : t.modelsLoadFailed);
    } finally {
      setModelsLoading(false);
    }
  }

  function swapLanguages() {
    if (sourceLanguage === 'auto') {
      setSourceLanguage(targetLanguage);
    } else {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
    }
    setInput(output || input);
    setOutput(input);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Languages size={22} />
          <span>OpenDeepL</span>
        </div>
        <button className="settingsButton" onClick={() => setSettingsOpen(true)}>
          <Settings size={18} />
          {t.settings}
        </button>
      </header>

      <section className="languageBar">
        <select value={sourceLanguage} onChange={(event) => setSourceLanguage(event.target.value)}>
          <option value="auto">{t.detectSource}</option>
          {languageOptions.map((language) => (
            <option key={language.value} value={language.value}>
              {language[settings.appLanguage]}
            </option>
          ))}
        </select>
        <button className="iconButton" onClick={swapLanguages} aria-label={t.swapLanguages}>
          <ArrowLeftRight size={19} />
        </button>
        <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
          {languageOptions.map((language) => (
            <option key={language.value} value={language.value}>
              {language[settings.appLanguage]}
            </option>
          ))}
        </select>
      </section>

      <main className="workspace">
        <section className="pane inputPane">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                runTranslate(input);
              }
            }}
            placeholder={t.inputPlaceholder}
            spellCheck={false}
          />
          {!input && (
            <div className="emptyState">
              <p>
                {t.quickTipPrefix} <kbd>{settings.shortcutModifier}</kbd> + <kbd>{settings.shortcutKey}</kbd> +{' '}
                <kbd>{settings.shortcutKey}</kbd> {t.quickTipSuffix}
              </p>
              <button className="pasteCard" onClick={pasteFromClipboard}>
                <Clipboard size={22} />
                {t.pasteFromClipboard}
              </button>
            </div>
          )}
          <div className="paneFooter">
            <button className="secondary" onClick={pasteFromClipboard}>
              <Clipboard size={17} />
              {t.paste}
            </button>
            <button className="secondary" onClick={() => setInput('')} disabled={!input}>
              {t.clear}
            </button>
            <button className="primaryFooterButton" onClick={() => runTranslate(input)} disabled={!input.trim() || loading}>
              {loading ? t.translating : t.translate}
            </button>
          </div>
        </section>

        <section className="pane outputPane">
          {loading ? (
            <div className="status">
              <Sparkles size={24} />
              {t.translating}
            </div>
          ) : output ? (
            <div className="result">{output}</div>
          ) : (
            <div className="status">{t.resultPlaceholder}</div>
          )}
          <div className="paneFooter rightFooter">
            <button className="secondary" onClick={copyOutput} disabled={!output}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </section>
      </main>

      <aside className="bottomBar">
        <span className={settings.shortcutEnabled ? 'shortcutStatus on' : 'shortcutStatus'}>
          {t.shortcut}: {settings.shortcutEnabled ? formatShortcut(settings) : t.off}
        </span>
        <span>
          {t.model}: {settings.model}
        </span>
        {history.length > 0 && (
          <div className="historyDock" aria-label={t.historyAria}>
            <button className="historyDockButton" onClick={() => setHistoryOpen((open) => !open)}>
              <span>
                <History size={17} />
                {t.history}
              </span>
              <span className="historyCount">
                {history.length}
                {historyOpen ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
              </span>
            </button>
            {historyOpen && (
              <div className="historyPanel">
                <div className="historyList">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      className="historyItem"
                      onClick={() => {
                        setInput(item.source);
                        setOutput(item.result);
                        setHistoryOpen(false);
                      }}
                    >
                      <span>{item.source}</span>
                      <small>
                        {item.sourceLanguage} &gt; {item.targetLanguage}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      {error && (
        <div className="errorToast" role="alertdialog" aria-modal="true" aria-label={t.errorTitle}>
          <section className="errorDialog">
            <header>
              <strong>{t.errorTitle}</strong>
              <button className="iconButton" onClick={() => setError('')} aria-label={t.closeSettings}>
                <X size={18} />
              </button>
            </header>
            <p>{error}</p>
            <footer>
              <button className="primaryButton" onClick={() => setError('')}>
                OK
              </button>
            </footer>
          </section>
        </div>
      )}

      {settingsOpen && (
        <SettingsDialog
          settings={settings}
          models={models}
          modelsLoading={modelsLoading}
          modelsError={modelsError}
          freeModelsOnly={freeModelsOnly}
          t={t}
          onClose={() => setSettingsOpen(false)}
          onSave={saveSettings}
          onChange={setSettings}
          onFetchModels={fetchModels}
          onFreeModelsOnlyChange={setFreeModelsOnly}
        />
      )}
    </div>
  );
}

function SettingsDialog({
  settings,
  models,
  modelsLoading,
  modelsError,
  freeModelsOnly,
  t,
  onClose,
  onSave,
  onChange,
  onFetchModels,
  onFreeModelsOnlyChange,
}: {
  settings: SettingsDraft;
  models: OpenRouterModel[];
  modelsLoading: boolean;
  modelsError: string;
  freeModelsOnly: boolean;
  t: (typeof i18n)[AppLanguage];
  onClose: () => void;
  onSave: (settings: SettingsDraft) => void;
  onChange: (settings: SettingsDraft) => void;
  onFetchModels: () => void;
  onFreeModelsOnlyChange: (enabled: boolean) => void;
}) {
  const visibleModels = freeModelsOnly ? models.filter((model) => model.isFree) : models;

  return (
    <div className="modalBackdrop">
      <section className="settingsModal" role="dialog" aria-modal="true" aria-label={t.settingsAria}>
        <header>
          <h2>{t.settings}</h2>
          <button className="iconButton" onClick={onClose} aria-label={t.closeSettings}>
            <X size={19} />
          </button>
        </header>

        <div className="formGrid">
          <label className="wide">
            {t.appLanguage}
            <select
              value={settings.appLanguage}
              onChange={(event) => onChange({ ...settings, appLanguage: event.target.value as AppLanguage })}
            >
              <option value="zh">{t.chinese}</option>
              <option value="en">{t.english}</option>
            </select>
          </label>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={settings.autoLaunch}
              onChange={(event) => onChange({ ...settings, autoLaunch: event.target.checked })}
            />
            {t.autoLaunch}
          </label>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={settings.shortcutEnabled}
              onChange={(event) => onChange({ ...settings, shortcutEnabled: event.target.checked })}
            />
            {t.enableShortcut}
          </label>

          <label>
            {t.modifier}
            <select
              value={settings.shortcutModifier}
              onChange={(event) =>
                onChange({ ...settings, shortcutModifier: event.target.value as AppSettings['shortcutModifier'] })
              }
            >
              <option value="CTRL">Ctrl</option>
              <option value="ALT">Alt</option>
              <option value="SHIFT">Shift</option>
              <option value="META">Win</option>
            </select>
          </label>

          <label>
            {t.repeatKey}
            <input
              value={settings.shortcutKey}
              maxLength={1}
              onChange={(event) => onChange({ ...settings, shortcutKey: event.target.value.toUpperCase() })}
            />
          </label>

          <label>
            {t.doublePressInterval}
            <input
              type="number"
              min={250}
              max={1500}
              step={50}
              value={settings.shortcutWindowMs}
              onChange={(event) => onChange({ ...settings, shortcutWindowMs: Number(event.target.value) })}
            />
          </label>

          <label className="wide">
            OpenRouter API Key
            <input
              type="password"
              value={settings.apiKey}
              placeholder="sk-or-v1-..."
              onChange={(event) => onChange({ ...settings, apiKey: event.target.value })}
            />
          </label>

          <label className="wide">
            {t.modelName}
            <input
              value={settings.model}
              placeholder="deepseek/deepseek-v4-flash"
              onChange={(event) => onChange({ ...settings, model: event.target.value })}
            />
          </label>

          <div className="modelTools wide">
            <button className="secondaryButton" type="button" onClick={onFetchModels} disabled={modelsLoading}>
              {modelsLoading ? t.loadingModels : t.fetchModels}
            </button>
            <label className="inlineCheck">
              <input
                type="checkbox"
                checked={freeModelsOnly}
                onChange={(event) => onFreeModelsOnlyChange(event.target.checked)}
              />
              {t.freeModelsOnly}
            </label>
          </div>

          <label className="wide">
            {t.modelName}
            <select
              value={visibleModels.some((model) => model.id === settings.model) ? settings.model : ''}
              onChange={(event) => {
                if (event.target.value) {
                  onChange({ ...settings, model: event.target.value });
                }
              }}
            >
              <option value="">{t.modelListPlaceholder}</option>
              {visibleModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                  {model.isFree ? ' (free)' : ''}
                </option>
              ))}
            </select>
          </label>

          {modelsError && <div className="formError wide">{modelsError}</div>}
        </div>

        <footer>
          <button className="secondaryButton" onClick={onClose}>
            {t.cancel}
          </button>
          <button className="primaryButton" onClick={() => onSave(settings)}>
            {t.save}
          </button>
        </footer>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
