import React from 'react';
import { Feather, Sun, Coffee, Moon, PlusCircle, LogIn, Globe } from 'lucide-react';
import { Theme, Language } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  langFilter: 'all' | Language;
  onLangFilterChange: (lang: 'all' | Language) => void;
  onOpenAuth: () => void;
  onOpenCreate: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  langFilter,
  onLangFilterChange,
  onOpenAuth,
  onOpenCreate,
  onNavigateTab,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const { uiLang, toggleUiLang } = useLanguageStore();

  const isWriter = isAuthenticated && (user?.role === 'writer' || user?.role === 'author' || user?.role === 'admin');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-main/90 border-b border-theme-main transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigateTab('home')}
          className="flex items-center space-x-2 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold font-bnUI tracking-tight leading-tight group-hover:text-emerald-500 transition-colors">
              {t('appName', uiLang)}
            </h1>
            <p className="text-[10px] opacity-60 font-enUI leading-none">kavya & katha</p>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* UI Language Toggle (BN / EN) */}
          <button
            onClick={toggleUiLang}
            className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
            title="Switch Interface Language (বাংলা / English)"
          >
            <Globe className="w-3 h-3" />
            <span>{uiLang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Content Language Selector Pills */}
          <div className="hidden sm:flex items-center p-0.5 rounded-full bg-gray-500/10 text-xs font-bnUI">
            <button
              onClick={() => onLangFilterChange('all')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                langFilter === 'all'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {t('all', uiLang)}
            </button>
            <button
              onClick={() => onLangFilterChange('bn')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                langFilter === 'bn'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              BN
            </button>
            <button
              onClick={() => onLangFilterChange('en')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                langFilter === 'en'
                  ? 'bg-emerald-500 text-white shadow-sm font-enUI'
                  : 'opacity-70 hover:opacity-100 font-enUI'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-gray-500/10">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('sepia')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'sepia'
                  ? 'bg-[#f4e7ca] text-[#5c4314] shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Sepia Theme"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auth & Writer Actions */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-1.5">
              {isWriter && (
                <button
                  onClick={onOpenCreate}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('publishButton', uiLang)}</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('profile')}
                className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-xs border border-emerald-500/30 overflow-hidden"
                title={user.name}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-500 text-xs font-medium hover:bg-emerald-500/10 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('login', uiLang)}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
