import React from 'react';
import { Type, Sun, Coffee, Moon, Minus, Plus } from 'lucide-react';
import { Theme } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface ReadingControlsProps {
  onThemeChange?: (theme: Theme) => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({ onThemeChange }) => {
  const { theme, setTheme, fontSize, setFontSize } = useReaderStore();
  const { uiLang } = useLanguageStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const handleDecreaseFont = () => {
    if (fontSize > 13) {
      setFontSize(fontSize - 1);
    }
  };

  const handleIncreaseFont = () => {
    if (fontSize < 28) {
      setFontSize(fontSize + 1);
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-theme-main bg-theme-card shadow-lg space-y-4 max-w-sm mx-auto transition-colors">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold opacity-75 font-bnUI flex items-center space-x-1">
          <Type className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('readerSettings', uiLang)}</span>
        </h4>
        <span className="text-xs font-mono font-medium text-emerald-500 font-bnUI">
          {fontSize}px
        </span>
      </div>

      {/* Font Size Adjuster */}
      <div className="flex items-center justify-between space-x-3">
        <button
          onClick={handleDecreaseFont}
          disabled={fontSize <= 13}
          className="p-2 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 disabled:opacity-30 transition-all text-xs font-bold font-bnUI flex items-center space-x-1"
          title={uiLang === 'bn' ? 'ফন্ট সাইজ ছোট করুন' : 'Decrease font size'}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>A-</span>
        </button>

        <input
          type="range"
          min={13}
          max={28}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-gray-500/20 rounded-lg appearance-none"
        />

        <button
          onClick={handleIncreaseFont}
          disabled={fontSize >= 28}
          className="p-2 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 disabled:opacity-30 transition-all text-xs font-bold font-bnUI flex items-center space-x-1"
          title={uiLang === 'bn' ? 'ফন্ট সাইজ বড় করুন' : 'Increase font size'}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>A+</span>
        </button>
      </div>

      {/* Background Theme Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'light'
              ? 'border-emerald-500 bg-white text-gray-900 shadow-md ring-2 ring-emerald-500/20'
              : 'border-theme-main bg-theme-main/50 opacity-70 hover:opacity-100'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="font-bnUI">{t('themeLight', uiLang)}</span>
        </button>

        <button
          onClick={() => handleThemeChange('sepia')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'sepia'
              ? 'border-amber-700 bg-[#f4e7ca] text-[#2d2318] shadow-md ring-2 ring-amber-700/20'
              : 'border-theme-main bg-theme-main/50 opacity-70 hover:opacity-100'
          }`}
        >
          <Coffee className="w-4 h-4 text-amber-700" />
          <span className="font-bnUI">{t('themeSepia', uiLang)}</span>
        </button>

        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'dark'
              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-md ring-2 ring-emerald-500/20'
              : 'border-theme-main bg-theme-main/50 opacity-70 hover:opacity-100'
          }`}
        >
          <Moon className="w-4 h-4 text-emerald-400" />
          <span className="font-bnUI">{t('themeDark', uiLang)}</span>
        </button>
      </div>
    </div>
  );
};
