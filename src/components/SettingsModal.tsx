import React from 'react';
import { X, Sun, Coffee, Moon, Globe, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { Theme, Language } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  langFilter: 'all' | Language;
  onLangFilterChange: (lang: 'all' | Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  langFilter,
  onLangFilterChange,
}) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { uiLang, toggleUiLang } = useLanguageStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-theme-card text-theme-main border border-theme-main rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-theme-main bg-theme-main/50 flex items-center justify-between">
          <h3 className="text-base font-bold font-bnUI">
            {uiLang === 'bn' ? 'সেটিংস ও থিম' : 'Settings & Preferences'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-500/20 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Reading Theme */}
          <div className="space-y-2">
            <label className="text-xs font-semibold opacity-75 font-bnUI block">
              {uiLang === 'bn' ? 'পড়ার থিম (Theme)' : 'Reading Theme'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`p-3 rounded-2xl border text-xs font-medium font-bnUI flex flex-col items-center space-y-1.5 transition-all ${
                  theme === 'light'
                    ? 'border-emerald-500 bg-white text-gray-900 font-bold shadow-sm'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>{uiLang === 'bn' ? 'দিন (Light)' : 'Light'}</span>
              </button>

              <button
                onClick={() => onThemeChange('sepia')}
                className={`p-3 rounded-2xl border text-xs font-medium font-bnUI flex flex-col items-center space-y-1.5 transition-all ${
                  theme === 'sepia'
                    ? 'border-amber-600 bg-[#f4e7ca] text-[#2d2318] font-bold shadow-sm'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                <Coffee className="w-5 h-5 text-amber-700" />
                <span>{uiLang === 'bn' ? 'সেপিয়া (Sepia)' : 'Sepia'}</span>
              </button>

              <button
                onClick={() => onThemeChange('dark')}
                className={`p-3 rounded-2xl border text-xs font-medium font-bnUI flex flex-col items-center space-y-1.5 transition-all ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                <Moon className="w-5 h-5 text-emerald-400" />
                <span>{uiLang === 'bn' ? 'রাত (Dark)' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* Interface Language */}
          <div className="space-y-2">
            <label className="text-xs font-semibold opacity-75 font-bnUI block">
              {uiLang === 'bn' ? 'অ্যাপের ভাষা (App Language)' : 'App Language'}
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleUiLang}
                className="w-full py-2.5 px-4 rounded-2xl border border-theme-main bg-theme-main font-bnUI text-xs flex items-center justify-between hover:border-emerald-500/50 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>{uiLang === 'bn' ? 'বাংলা ভাষা' : 'English Language'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                  {uiLang === 'bn' ? 'পরিবর্তন করুন' : 'Switch'}
                </span>
              </button>
            </div>
          </div>

          {/* Content Language Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold opacity-75 font-bnUI block">
              {uiLang === 'bn' ? 'সাহিত্যের ভাষা ফিল্টার' : 'Content Language Filter'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onLangFilterChange('all')}
                className={`py-2 rounded-xl text-xs font-medium font-bnUI border transition-all ${
                  langFilter === 'all'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                {t('all', uiLang)}
              </button>
              <button
                onClick={() => onLangFilterChange('bn')}
                className={`py-2 rounded-xl text-xs font-medium font-bnUI border transition-all ${
                  langFilter === 'bn'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                বাংলা (BN)
              </button>
              <button
                onClick={() => onLangFilterChange('en')}
                className={`py-2 rounded-xl text-xs font-medium font-enUI border transition-all ${
                  langFilter === 'en'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                    : 'border-theme-main opacity-70 hover:opacity-100'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Account Status */}
          {isAuthenticated && user && (
            <div className="pt-2 border-t border-theme-main space-y-2">
              <div className="flex items-center justify-between text-xs font-bnUI">
                <span className="opacity-70">{user.name} (@{user.username})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 capitalize">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-medium font-bnUI flex items-center justify-center space-x-1.5 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{uiLang === 'bn' ? 'লগ আউট করুন' : 'Log Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
