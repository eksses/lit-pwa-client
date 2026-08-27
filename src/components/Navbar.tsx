import React from 'react';
import { Feather, Sun, Coffee, Moon, PlusCircle, LogIn, User as UserIcon } from 'lucide-react';
import { Theme, Language } from '../types';
import { useAuthStore } from '../store/useAuthStore';

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
              কাব্য ও কথা
            </h1>
            <p className="text-[10px] text-gray-500 font-enUI leading-none">kavya & katha</p>
          </div>
        </button>

        {/* Center/Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Selector Pills */}
          <div className="flex items-center p-0.5 rounded-full bg-gray-500/10 text-xs font-bnUI">
            <button
              onClick={() => onLangFilterChange('all')}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                langFilter === 'all'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              সব
            </button>
            <button
              onClick={() => onLangFilterChange('bn')}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                langFilter === 'bn'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => onLangFilterChange('en')}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                langFilter === 'en'
                  ? 'bg-emerald-500 text-white shadow-sm font-enUI'
                  : 'opacity-70 hover:opacity-100 font-enUI'
              }`}
            >
              Eng
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-gray-500/10">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Light Theme"
              aria-label="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('sepia')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'sepia'
                  ? 'bg-[#f4e7ca] text-[#5c4314] shadow-sm'
                  : 'text-gray-400 hover:text-amber-700'
              }`}
              title="Sepia Theme"
              aria-label="Sepia Theme"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-gray-800 text-emerald-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Dark Theme"
              aria-label="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auth & Create Action */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onOpenCreate}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium font-bnUI hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>লিখুন</span>
              </button>
              <button
                onClick={() => onNavigateTab('profile')}
                className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-xs overflow-hidden border border-emerald-500/30"
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
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-500 text-xs font-medium font-bnUI hover:bg-emerald-500/10 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
