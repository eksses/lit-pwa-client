import React from 'react';
import { Users, LogIn, UserPlus } from 'lucide-react';
import { Literature } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { useFeed } from '../hooks/useLiterature';
import { LiteratureCard } from '../components/LiteratureCard';

interface FollowingPageProps {
  onRead: (item: Literature) => void;
  onComment: (item: Literature) => void;
  onAuthorClick: (authorId: string) => void;
  onOpenAuth: () => void;
  onGoHome: () => void;
}

export const FollowingPage: React.FC<FollowingPageProps> = ({
  onRead,
  onComment,
  onAuthorClick,
  onOpenAuth,
  onGoHome,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { uiLang } = useLanguageStore();
  const { data, isLoading } = useFeed();

  if (!isAuthenticated) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <Users className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-bnUI">{t('guestFollowingPrompt', uiLang)}</h2>
          <p className="text-xs opacity-70 font-bnUI leading-relaxed">
            {t('guestFollowingDesc', uiLang)}
          </p>
        </div>

        <button
          onClick={onOpenAuth}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-sm shadow-md hover:bg-emerald-600 transition-all font-bnUI flex items-center justify-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{t('login', uiLang)} / {t('register', uiLang)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-bold font-bnUI tracking-tight">
          {uiLang === 'bn' ? 'অনুসৃত ফিড' : 'Following Feed'}
        </h2>
        <p className="text-xs opacity-60 font-bnUI">
          {uiLang === 'bn' ? 'আপনি যে সকল কবিদের অনুসরণ করছেন তাদের নতুন লেখা' : 'Latest posts by authors you follow'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="p-5 rounded-2xl border border-theme-main bg-theme-card animate-pulse h-36" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-theme-main bg-theme-card space-y-4">
          <UserPlus className="w-12 h-12 text-emerald-500/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold font-bnUI">
              {uiLang === 'bn' ? 'এখনো কোনো অনুসরণ করা ফিড পাওয়া যায়নি' : 'No posts in your following feed'}
            </h3>
            <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto">
              {uiLang === 'bn' ? 'নতুন লেখকদের অনুসরণ করুন যাতে তাদের সকল কাজ সরাসরি আপনার ফিডে চলে আসে।' : 'Follow poets and writers to build your personalized feed.'}
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm"
          >
            {uiLang === 'bn' ? 'লেখকদের অন্বেষণ করুন' : 'Explore Authors'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((item) => (
            <LiteratureCard
              key={item.id}
              item={item}
              onRead={onRead}
              onComment={onComment}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
