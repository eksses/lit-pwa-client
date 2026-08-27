import React from 'react';
import { Type, Sun, Coffee, Moon, Minus, Plus } from 'lucide-react';
import { Theme } from '../types';
import { useReaderStore } from '../store/useReaderStore';

interface ReadingControlsProps {
  onThemeChange?: (theme: Theme) => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({ onThemeChange }) => {
  const { theme, setTheme, fontSize, setFontSize } = useReaderStore();

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
        <h4 className="text-xs font-semibold text-gray-500 font-bnUI flex items-center space-x-1">
          <Type className="w-3.5 h-3.5 text-emerald-500" />
          <span>পাঠক সেটিংস (Reader Customization)</span>
        </h4>
        <span className="text-xs font-mono font-medium text-emerald-600 font-bnUI">
          {fontSize}px
        </span>
      </div>

      {/* Font Size Adjuster */}
      <div className="flex items-center justify-between space-x-3">
        <button
          onClick={handleDecreaseFont}
          disabled={fontSize <= 13}
          className="p-2 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 disabled:opacity-30 transition-all text-xs font-bold font-bnUI flex items-center space-x-1"
          title="ফন্ট সাইজ ছোট করুন"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>ছোট</span>
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
          title="ফন্ট সাইজ বড় করুন"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>বড়</span>
        </button>
      </div>

      {/* Background Theme Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'light'
              ? 'border-emerald-500 bg-white text-gray-900 shadow-md ring-2 ring-emerald-500/20'
              : 'border-gray-200 bg-white/60 text-gray-700 hover:border-gray-300'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="font-bnUI">লাইট</span>
        </button>

        <button
          onClick={() => handleThemeChange('sepia')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'sepia'
              ? 'border-amber-700 bg-[#f4e7ca] text-[#2d2318] shadow-md ring-2 ring-amber-700/20'
              : 'border-[#e4d3ab] bg-[#fbf0d9]/80 text-[#5c4314] hover:border-amber-600'
          }`}
        >
          <Coffee className="w-4 h-4 text-amber-700" />
          <span className="font-bnUI">সেপিয়া</span>
        </button>

        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
            theme === 'dark'
              ? 'border-emerald-500 bg-[#1e1e1e] text-white shadow-md ring-2 ring-emerald-500/20'
              : 'border-gray-800 bg-[#121212]/80 text-gray-300 hover:border-gray-700'
          }`}
        >
          <Moon className="w-4 h-4 text-emerald-400" />
          <span className="font-bnUI">ডার্ক</span>
        </button>
      </div>
    </div>
  );
};
