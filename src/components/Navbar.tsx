import React from 'react';
import { Feather, Settings, PlusCircle, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenCreate: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenAuth,
  onOpenCreate,
  onNavigateTab,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const { uiLang } = useLanguageStore();

  const isWriter = isAuthenticated && (user?.role === 'writer' || user?.role === 'author' || user?.role === 'admin');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-main/90 border-b border-theme-main/50 transition-colors duration-200">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Minimal Brand Logo */}
        <button
          onClick={() => onNavigateTab('home')}
          className="flex items-center space-x-2 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold font-bnSerif tracking-tight leading-none group-hover:text-emerald-500 transition-colors">
              {t('appName', uiLang)}
            </h1>
            <p className="text-[10px] opacity-50 font-enUI leading-none">Nirbak PWA</p>
          </div>
        </button>

        {/* Clean Right Actions */}
        <div className="flex items-center space-x-2">
          {isWriter && (
            <button
              onClick={onOpenCreate}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('publishHeader', uiLang)}</span>
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-500 text-xs font-semibold hover:bg-emerald-500/10 transition-colors"
            >
              {t('login', uiLang)}
            </button>
          )}

          {/* Settings Cog Drawer Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-gray-500/10 opacity-70 hover:opacity-100 transition-colors text-theme-main"
            title={uiLang === 'bn' ? 'সেটিংস' : 'Settings'}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
