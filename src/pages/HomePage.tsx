import React, { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, Flame, Compass } from 'lucide-react';
import { Language, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { LiteratureCard } from '../components/LiteratureCard';

interface HomePageProps {
  langFilter: 'all' | Language;
  onRead: (item: Literature) => void;
  onComment: (item: Literature) => void;
  onAuthorClick: (authorId: string) => void;
  onOpenCreate: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  langFilter,
  onRead,
  onComment,
  onAuthorClick,
}) => {
  const [sortAlgo, setSortAlgo] = useState<'for_you' | 'trending' | 'latest' | 'top'>('for_you');

  const { uiLang } = useLanguageStore();

  const { data, isLoading, isError, refetch } = useLiteratureList({
    language: langFilter === 'all' ? undefined : langFilter,
    sort: sortAlgo,
  });

  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto pt-1">
      {/* Pure Algorithm Feed Switcher Bar */}
      <div className="flex items-center justify-between border-b border-theme-main/40 pb-2.5">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar text-xs font-bnUI">
          {/* For You Personalized Feed */}
          <button
            onClick={() => setSortAlgo('for_you')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 shrink-0 ${
              sortAlgo === 'for_you'
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'আপনার জন্য' : 'For You'}</span>
          </button>

          {/* Trending Feed */}
          <button
            onClick={() => setSortAlgo('trending')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 shrink-0 ${
              sortAlgo === 'trending'
                ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30 shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}</span>
          </button>

          {/* Latest Feed */}
          <button
            onClick={() => setSortAlgo('latest')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 shrink-0 ${
              sortAlgo === 'latest'
                ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30 shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'নতুন' : 'Latest'}</span>
          </button>

          {/* Top Rated Feed */}
          <button
            onClick={() => setSortAlgo('top')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 shrink-0 ${
              sortAlgo === 'top'
                ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30 shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{uiLang === 'bn' ? 'সেরা' : 'Top Rated'}</span>
          </button>
        </div>

        <span className="text-[11px] opacity-50 font-bnUI hidden sm:inline">
          {data?.items.length || 0} {uiLang === 'bn' ? 'টি লেখা' : 'works'}
        </span>
      </div>

      {/* Main Algorithmic Stream Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-3xl border border-theme-main bg-theme-card space-y-3 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-500/20" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-500/20 rounded w-1/3" />
                  <div className="h-2 bg-gray-500/20 rounded w-1/4" />
                </div>
              </div>
              <div className="h-5 bg-gray-500/20 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-500/20 rounded w-full" />
                <div className="h-3 bg-gray-500/20 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-3xl border border-theme-main bg-theme-card space-y-3">
          <p className="text-sm font-bnUI text-rose-500">
            {uiLang === 'bn' ? 'ফিড লোড করতে সমস্যা হয়েছে।' : 'Failed to load literature feed.'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}</span>
          </button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="p-10 text-center rounded-3xl border border-theme-main bg-theme-card space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold font-bnUI">{t('noResultsFound', uiLang)}</h3>
          <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto">
            {uiLang === 'bn'
              ? 'এখনো কোনো লেখা খুঁজে পাওয়া যায়নি।'
              : 'No literature found for this algorithm feed.'}
          </p>
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
