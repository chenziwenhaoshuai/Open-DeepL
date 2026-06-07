import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
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
    help: '\u5e2e\u52a9',
    helpAria: '\u5e2e\u52a9',
    closeHelp: '\u5173\u95ed\u5e2e\u52a9',
    helpTitle: '\u5982\u4f55\u83b7\u53d6 OpenRouter API Key',
    helpIntro: 'OpenDeepL \u4f7f\u7528 OpenRouter API \u8fdb\u884c\u5927\u6a21\u578b\u7ffb\u8bd1\u3002\u4f60\u9700\u8981\u5148\u5728 OpenRouter \u521b\u5efa API Key\uff0c\u7136\u540e\u586b\u5165\u8bbe\u7f6e\u91cc\u3002',
    helpStep1: '\u6253\u5f00 openrouter.ai \u5e76\u767b\u5f55\u6216\u6ce8\u518c\u8d26\u6237\u3002',
    helpStep2: '\u8fdb\u5165 Keys \u9875\u9762\uff0c\u70b9\u51fb Create Key \u521b\u5efa\u65b0\u7684 API Key\u3002',
    helpStep3: '\u590d\u5236\u4ee5 sk-or-v1- \u5f00\u5934\u7684 key\uff0c\u56de\u5230 OpenDeepL \u7684\u8bbe\u7f6e\u7a97\u53e3\u7c98\u8d34\u4fdd\u5b58\u3002',
    helpStep4: '\u5728\u8bbe\u7f6e\u91cc\u83b7\u53d6\u6a21\u578b\u5217\u8868\uff0c\u53ef\u4ee5\u52fe\u9009\u4ec5\u663e\u793a Free \u6a21\u578b\u540e\u9009\u62e9\u514d\u8d39\u6a21\u578b\u3002',
    helpQuotaTitle: 'Free \u6a21\u578b\u989d\u5ea6\u8bf4\u660e',
    helpQuota: '\u6839\u636e OpenRouter \u5b98\u65b9\u8bf4\u660e\uff0c\u666e\u901a\u514d\u8d39\u8d26\u6237\u901a\u5e38\u662f\u6bcf\u5929 50 \u6b21 free \u6a21\u578b\u8c03\u7528\uff1b\u5f53\u8d26\u6237\u5df2\u8d2d\u4e70\u81f3\u5c11 10 credits\uff08\u7ea6 10 \u7f8e\u5143\uff09\u65f6\uff0cfree \u6a21\u578b\u7684\u65e5\u8c03\u7528\u4e0a\u9650\u4f1a\u63d0\u5347\u5230\u6bcf\u5929 1000 \u6b21\u3002',
    helpNote: '\u5177\u4f53\u9650\u989d\u548c\u53ef\u7528\u6027\u4f1a\u53d7 OpenRouter \u548c\u6a21\u578b\u63d0\u4f9b\u65b9\u7684\u5f53\u524d\u7b56\u7565\u5f71\u54cd\uff0c\u4ee5 OpenRouter \u5b98\u7f51\u4e3a\u51c6\u3002',
    openRouterLinks: '\u5e38\u7528\u94fe\u63a5',
    openOpenRouter: '\u6253\u5f00 OpenRouter',
    openRouterKeys: 'OpenRouter Keys',
    openRouterPricing: 'OpenRouter Pricing',
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
    sentenceHighlight: '\u542f\u7528\u53e5\u5b50\u5bf9\u5e94\u9ad8\u4eae',
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
    help: 'Help',
    helpAria: 'Help',
    closeHelp: 'Close help',
    helpTitle: 'How to get an OpenRouter API key',
    helpIntro: 'OpenDeepL uses the OpenRouter API for LLM translation. Create an API key on OpenRouter, then paste it into Settings.',
    helpStep1: 'Open openrouter.ai and sign in or create an account.',
    helpStep2: 'Go to the Keys page and click Create Key.',
    helpStep3: 'Copy the key that starts with sk-or-v1-, then paste and save it in OpenDeepL Settings.',
    helpStep4: 'Fetch the model list in Settings. You can enable Free models only and choose a free model.',
    helpQuotaTitle: 'Free model quota',
    helpQuota: 'According to OpenRouter, free accounts usually get 50 free-model requests per day. Accounts that have purchased at least 10 credits, about 10 USD, can get 1000 free-model requests per day.',
    helpNote: 'Limits and availability can change based on OpenRouter and model-provider policy. Check OpenRouter for the current rules.',
    openRouterLinks: 'Useful links',
    openOpenRouter: 'Open OpenRouter',
    openRouterKeys: 'OpenRouter Keys',
    openRouterPricing: 'OpenRouter Pricing',
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
    sentenceHighlight: 'Highlight aligned sentences',
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
  sentenceHighlightEnabled: false,
};

function formatShortcut(settings: Pick<AppSettings, 'shortcutModifier' | 'shortcutKey'>) {
  return `${settings.shortcutModifier}+${settings.shortcutKey}+${settings.shortcutKey}`;
}

function splitSentences(text: string) {
  const normalized = text.replace(/\r\n/g, '\n');
  const segments: string[] = [];
  const boundaryMarks = new Set(['.', '!', '?', '\u3002', '\uff01', '\uff1f', '\uff1b', ';', '\n']);
  let start = 0;
  let index = 0;

  while (index < normalized.length) {
    if (!boundaryMarks.has(normalized[index])) {
      index += 1;
      continue;
    }

    index += 1;
    while (index < normalized.length && /\s/.test(normalized[index])) {
      index += 1;
    }

    const segment = normalized.slice(start, index);
    if (segment.trim()) {
      segments.push(segment);
    }
    start = index;
  }

  const rest = normalized.slice(start);
  if (rest.trim()) {
    segments.push(rest);
  }

  return segments.length ? segments : normalized.trim() ? [normalized] : [];
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
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState('');
  const [freeModelsOnly, setFreeModelsOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredSentence, setHoveredSentence] = useState<number | null>(null);
  const [sourceScrollTop, setSourceScrollTop] = useState(0);
  const activeRequestIdRef = useRef('');
  const streamTextRef = useRef('');
  const streamSourceRef = useRef('');
  const sourceTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const t = i18n[settings.appLanguage];

  const sourceLabel = useMemo(
    () => (sourceLanguage === 'auto' ? t.detectSource : sourceLanguage),
    [sourceLanguage, t.detectSource],
  );
  const alignmentEnabled = settings.sentenceHighlightEnabled && Boolean(output.trim());
  const sourceSegments = useMemo(() => splitSentences(input), [input]);
  const outputSegments = useMemo(() => splitSentences(output), [output]);

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
      setOutput('');
      setHoveredSentence(null);
      setLoading(true);
      const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      activeRequestIdRef.current = requestId;
      streamTextRef.current = '';
      streamSourceRef.current = trimmed;
      try {
        await window.openDeepL.translateStream({
          requestId,
          text: trimmed,
          sourceLanguage,
          targetLanguage,
        });
      } catch (translationError) {
        if (activeRequestIdRef.current === requestId) {
          activeRequestIdRef.current = '';
        }
        setError(translationError instanceof Error ? translationError.message : t.translateFailed);
        setLoading(false);
      } finally {
        if (activeRequestIdRef.current === requestId && !streamTextRef.current) {
          setLoading(false);
        }
      }
    },
    [input, sourceLanguage, sourceLabel, targetLanguage, t.translateFailed],
  );

  useEffect(() => {
    const offChunk = window.openDeepL.onTranslateStreamChunk(({ requestId, delta }) => {
      if (requestId !== activeRequestIdRef.current) return;
      streamTextRef.current += delta;
      setOutput(streamTextRef.current);
    });
    const offDone = window.openDeepL.onTranslateStreamDone(({ requestId, text }) => {
      if (requestId !== activeRequestIdRef.current) return;

      const result = text || streamTextRef.current;
      activeRequestIdRef.current = '';
      streamTextRef.current = result;
      setOutput(result);
      setLoading(false);

      if (result.trim()) {
        setHistory((items) => [
          {
            id: Date.now(),
            source: streamSourceRef.current,
            result,
            sourceLanguage: sourceLabel,
            targetLanguage,
          },
          ...items.slice(0, 9),
        ]);
      }
    });

    return () => {
      offChunk();
      offDone();
    };
  }, [sourceLabel, targetLanguage]);

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
    setOutput('');
    setHoveredSentence(null);
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

  function editSourceText(nextInput: string) {
    setInput(nextInput);
    setOutput('');
    setHoveredSentence(null);
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
        <div className="topActions">
          <button className="settingsButton" onClick={() => setHelpOpen(true)}>
            <CircleHelp size={18} />
            {t.help}
          </button>
          <button className="settingsButton" onClick={() => setSettingsOpen(true)}>
            <Settings size={18} />
            {t.settings}
          </button>
        </div>
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
          <div className="sourceEditor">
            <textarea
              ref={sourceTextareaRef}
              className={alignmentEnabled ? 'sourceTextarea withSentenceOverlay' : 'sourceTextarea'}
              value={input}
              onChange={(event) => editSourceText(event.target.value)}
              onScroll={(event) => setSourceScrollTop(event.currentTarget.scrollTop)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  runTranslate(input);
                }
              }}
              placeholder={t.inputPlaceholder}
              spellCheck={false}
            />
            {alignmentEnabled && (
              <SentenceView
                text={input}
                segments={sourceSegments}
                activeIndex={hoveredSentence}
                className="sourceSentenceView sourceSentenceOverlay"
                scrollActiveIntoView
                scrollTop={sourceScrollTop}
                onScrollPositionChange={(nextScrollTop) => {
                  setSourceScrollTop(nextScrollTop);
                  if (sourceTextareaRef.current) {
                    sourceTextareaRef.current.scrollTop = nextScrollTop;
                  }
                }}
              />
            )}
          </div>
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
            <button
              className="secondary"
              onClick={() => {
                setInput('');
                setOutput('');
                setHoveredSentence(null);
              }}
              disabled={!input}
            >
              {t.clear}
            </button>
            <button className="primaryFooterButton" onClick={() => runTranslate(input)} disabled={!input.trim() || loading}>
              {loading ? t.translating : t.translate}
            </button>
          </div>
        </section>

        <section className="pane outputPane">
          {loading && !output ? (
            <div className="status">
              <Sparkles size={24} />
              {t.translating}
            </div>
          ) : output ? (
            alignmentEnabled ? (
              <SentenceView
                text={output}
                segments={outputSegments}
                activeIndex={hoveredSentence}
                className="outputSentenceView"
                onHover={setHoveredSentence}
              />
            ) : (
              <div className="result">{output}</div>
            )
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
                        setHoveredSentence(null);
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

      {helpOpen && <HelpDialog t={t} onClose={() => setHelpOpen(false)} />}

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

function HelpDialog({ t, onClose }: { t: (typeof i18n)[AppLanguage]; onClose: () => void }) {
  const steps = [t.helpStep1, t.helpStep2, t.helpStep3, t.helpStep4];

  return (
    <div className="modalBackdrop">
      <section className="helpModal" role="dialog" aria-modal="true" aria-label={t.helpAria}>
        <header>
          <h2>{t.helpTitle}</h2>
          <button className="iconButton" onClick={onClose} aria-label={t.closeHelp}>
            <X size={19} />
          </button>
        </header>

        <div className="helpContent">
          <p>{t.helpIntro}</p>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <section className="helpCallout">
            <h3>{t.helpQuotaTitle}</h3>
            <p>{t.helpQuota}</p>
            <small>{t.helpNote}</small>
          </section>

          <section>
            <h3>{t.openRouterLinks}</h3>
            <div className="helpLinks">
              <a href="https://openrouter.ai/" target="_blank" rel="noreferrer">
                {t.openOpenRouter}
              </a>
              <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noreferrer">
                {t.openRouterKeys}
              </a>
              <a href="https://openrouter.ai/pricing" target="_blank" rel="noreferrer">
                {t.openRouterPricing}
              </a>
            </div>
          </section>
        </div>

        <footer>
          <button className="primaryButton" onClick={onClose}>
            OK
          </button>
        </footer>
      </section>
    </div>
  );
}

function SentenceView({
  text,
  segments,
  activeIndex,
  className,
  onHover,
  onClick,
  scrollActiveIntoView = false,
  scrollTop,
  onScrollPositionChange,
}: {
  text: string;
  segments: string[];
  activeIndex: number | null;
  className?: string;
  onHover?: (index: number | null) => void;
  onClick?: () => void;
  scrollActiveIntoView?: boolean;
  scrollTop?: number;
  onScrollPositionChange?: (scrollTop: number) => void;
}) {
  const segmentRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollActiveIntoView || activeIndex === null) return;

    segmentRefs.current[activeIndex]?.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth',
    });
    window.setTimeout(() => {
      if (containerRef.current) {
        onScrollPositionChange?.(containerRef.current.scrollTop);
      }
    }, 160);
  }, [activeIndex, scrollActiveIntoView]);

  useEffect(() => {
    if (scrollTop === undefined || !containerRef.current) return;
    if (Math.abs(containerRef.current.scrollTop - scrollTop) > 1) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  if (!segments.length) {
    return (
      <div ref={containerRef} className={`sentenceView ${className || ''}`} onClick={onClick}>
        {text}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`sentenceView ${className || ''}`}
      onClick={onClick}
      onMouseLeave={() => onHover?.(null)}
    >
      {segments.map((segment, index) => (
        <React.Fragment key={`${index}-${segment.slice(0, 12)}`}>
          <span
            ref={(element) => {
              segmentRefs.current[index] = element;
            }}
            className={activeIndex === index ? 'sentenceSegment hovered' : 'sentenceSegment'}
            onMouseEnter={() => onHover?.(index)}
          >
            {segment}
          </span>
        </React.Fragment>
      ))}
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
              checked={settings.sentenceHighlightEnabled}
              onChange={(event) => onChange({ ...settings, sentenceHighlightEnabled: event.target.checked })}
            />
            {t.sentenceHighlight}
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
