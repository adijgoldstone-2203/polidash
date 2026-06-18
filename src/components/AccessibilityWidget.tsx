import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

interface A11ySettings {
  fontSize: '100' | '115' | '130' | '150';
  contrast: 'default' | 'high' | 'grayscale';
  readableFont: boolean;
  underlineLinks: boolean;
  highlightHeadings: boolean;
  enhancedFocus: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: '100',
  contrast: 'default',
  readableFont: false,
  underlineLinks: false,
  highlightHeadings: false,
  enhancedFocus: false,
};

export const AccessibilityWidget: React.FC = () => {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [settings, setSettings] = useState<A11ySettings>(() => {
    try {
      const saved = localStorage.getItem('polidash_a11y_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading accessibility settings', e);
    }
    return defaultSettings;
  });

  // Apply settings to html tag
  const applySettings = (newSettings: A11ySettings) => {
    const html = document.documentElement;

    // Font size
    html.classList.remove('a11y-font-100', 'a11y-font-115', 'a11y-font-130', 'a11y-font-150');
    html.classList.add(`a11y-font-${newSettings.fontSize}`);

    // Contrast
    html.classList.remove('a11y-high-contrast', 'a11y-grayscale');
    if (newSettings.contrast === 'high') {
      html.classList.add('a11y-high-contrast');
    } else if (newSettings.contrast === 'grayscale') {
      html.classList.add('a11y-grayscale');
    }

    // Toggles
    const toggleClass = (className: string, active: boolean) => {
      if (active) {
        html.classList.add(className);
      } else {
        html.classList.remove(className);
      }
    };

    toggleClass('a11y-readable-font', newSettings.readableFont);
    toggleClass('a11y-underline-links', newSettings.underlineLinks);
    toggleClass('a11y-highlight-headings', newSettings.highlightHeadings);
    toggleClass('a11y-enhanced-focus', newSettings.enhancedFocus);
  };

  useEffect(() => {
    applySettings(settings);
    try {
      localStorage.setItem('polidash_a11y_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving accessibility settings', e);
    }
  }, [settings]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab' && isOpen && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const updateSetting = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('a11y.widget.btn.label')}
        className={`fixed bottom-6 z-[150] p-3 bg-primary hover:bg-secondary dark:bg-[#1e293b] dark:hover:bg-[#334155] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-500 cursor-pointer flex items-center justify-center ${
          dir === 'rtl' ? 'left-6' : 'right-6'
        }`}
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">
          accessibility
        </span>
      </button>


      {/* Accessibility Panel Overlay */}
      {isOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('a11y.widget.title')}
          dir={dir}
          className={`fixed bottom-24 z-[150] w-auto max-w-none left-4 right-4 sm:w-80 sm:max-w-[calc(100vw-2rem)] bg-[#fbf9f5]/95 dark:bg-[#1e293b]/95 backdrop-blur-md border border-stone-200/50 dark:border-slate-800/50 shadow-2xl rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col text-[#162839] dark:text-[#fbf9f5] ${
            dir === 'rtl'
              ? 'sm:left-6 sm:right-auto'
              : 'sm:right-6 sm:left-auto'
          }`}
        >

          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200/50 dark:border-slate-800/50">
            <h3 className="font-headline font-bold text-base md:text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary dark:text-amber-500" aria-hidden="true">
                accessibility_new
              </span>
              {t('a11y.widget.title')}
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label={t('a11y.btn.close')}
              className="p-1 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-lg">close</span>
            </button>
          </div>

          {/* Options Content */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pl-1 no-scrollbar">
            
            {/* 1. Text Size Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                {t('a11y.toggle.fontSize')}
              </label>
              <div className="grid grid-cols-4 gap-1 bg-stone-200/50 dark:bg-slate-900/50 p-1 rounded-lg">
                {(['100', '115', '130', '150'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    aria-pressed={settings.fontSize === size}
                    className={`py-1.5 px-1 text-xs font-bold rounded transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.fontSize === size
                        ? 'bg-primary dark:bg-amber-600 text-white shadow-sm'
                        : 'hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {size === '100' ? 'A' : size === '115' ? 'A+' : size === '130' ? 'A++' : 'A+++'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Contrast Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                {t('a11y.toggle.contrast.default')}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-stone-200/50 dark:bg-slate-900/50 p-1 rounded-lg">
                {(['default', 'high', 'grayscale'] as const).map((cMode) => (
                  <button
                    key={cMode}
                    onClick={() => updateSetting('contrast', cMode)}
                    aria-pressed={settings.contrast === cMode}
                    className={`py-1.5 px-1 text-[10px] font-bold rounded transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.contrast === cMode
                        ? 'bg-primary dark:bg-amber-600 text-white shadow-sm'
                        : 'hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {cMode === 'default'
                      ? t('a11y.toggle.contrast.default').split(' ')[0]
                      : cMode === 'high'
                      ? t('a11y.toggle.contrast.high').split(' ')[0]
                      : t('a11y.toggle.contrast.grayscale').split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Toggles */}
            <div className="space-y-3 pt-2">
              
              {/* Readable Font */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {t('a11y.toggle.readableFont')}
                </span>
                <label className="a11y-switch">
                  <input
                    type="checkbox"
                    checked={settings.readableFont}
                    onChange={(e) => updateSetting('readableFont', e.target.checked)}
                  />
                  <div className="a11y-switch-track">
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              </div>

              {/* Underline Links */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {t('a11y.toggle.underlineLinks')}
                </span>
                <label className="a11y-switch">
                  <input
                    type="checkbox"
                    checked={settings.underlineLinks}
                    onChange={(e) => updateSetting('underlineLinks', e.target.checked)}
                  />
                  <div className="a11y-switch-track">
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              </div>

              {/* Highlight Headings */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {t('a11y.toggle.highlightHeadings')}
                </span>
                <label className="a11y-switch">
                  <input
                    type="checkbox"
                    checked={settings.highlightHeadings}
                    onChange={(e) => updateSetting('highlightHeadings', e.target.checked)}
                  />
                  <div className="a11y-switch-track">
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              </div>

              {/* Enhanced Keyboard Focus */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {t('a11y.toggle.enhancedFocus')}
                </span>
                <label className="a11y-switch">
                  <input
                    type="checkbox"
                    checked={settings.enhancedFocus}
                    onChange={(e) => updateSetting('enhancedFocus', e.target.checked)}
                  />
                  <div className="a11y-switch-track">
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* Panel Footer */}
          <div className="flex justify-between items-center mt-5 pt-3 border-t border-stone-200/50 dark:border-slate-800/50">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              {t('a11y.btn.reset')}
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              className="px-4 py-1.5 bg-primary dark:bg-amber-600 text-white font-bold text-xs rounded-lg hover:bg-secondary dark:hover:bg-amber-700 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {t('a11y.btn.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
