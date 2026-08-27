import React from 'react';
import { Home, LayoutGrid, Users, BookmarkCheck, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'categories', label: 'বিভাগ', icon: LayoutGrid },
    { id: 'following', label: 'অনুসৃত', icon: Users },
    { id: 'offline', label: 'অফলাইন', icon: BookmarkCheck },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-theme-main/95 backdrop-blur-md border-t border-theme-main pb-safe transition-colors duration-200 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all relative ${
                isActive
                  ? 'text-emerald-500 font-semibold scale-105'
                  : 'opacity-60 hover:opacity-100 text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-bnUI leading-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
