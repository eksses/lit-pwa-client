import React from 'react';
import { Feather, Settings, PlusCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-main/90 border-b border-theme-main/40 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Name Aligned Left */}
        <button
          onClick={() => onNavigateTab('home')}
          className="flex items-center space-x-2 text-left focus:outline-none group min-h-[44px]"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
            <Feather className="w-3.5 h-3.5" />
          </div>
          <span className="text-lg font-bold font-bnSerif tracking-tight group-hover:text-emerald-500 transition-colors">
            {t('appName', uiLang)}
          </span>
        </button>

        {/* Actions Aligned Right (with min 44x44px touch targets) */}
        <div className="flex items-center space-x-1">
          {isWriter && (
            <button
              onClick={onOpenCreate}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-all shadow-sm active:scale-95 min-h-[36px]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('publishHeader', uiLang)}</span>
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-500 text-xs font-semibold hover:bg-emerald-500/10 transition-colors min-h-[36px]"
            >
              {t('login', uiLang)}
            </button>
          )}

          {/* 44x44px Touch Target Settings Cog */}
          <button
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-gray-500/10 transition-colors text-theme-main active:scale-95"
            title={uiLang === 'bn' ? 'সেটিংস' : 'Settings'}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
