import React, { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, Flame, BookOpen } from 'lucide-react';
import { Category, Language, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
import { useReaderStore } from '../store/useReaderStore';
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [sortAlgo, setSortAlgo] = useState<'trending' | 'latest' | 'top'>('trending');

  const { uiLang } = useLanguageStore();
  const { readHistoryItems } = useReaderStore();

  const { data, isLoading, isError, refetch } = useLiteratureList({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    language: langFilter === 'all' ? undefined : langFilter,
    sort: sortAlgo,
  });

  const categories = [
    { id: 'all', label: t('all', uiLang) },
    { id: 'poem', label: t('poems', uiLang) },
    { id: 'story', label: t('stories', uiLang) },
    { id: 'micro_poem', label: t('microPoetry', uiLang) },
  ];

  const continueReadingItem = readHistoryItems && readHistoryItems.length > 0 ? readHistoryItems[0] : null;

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-4 pt-3">
      {/* Rule #2: Horizontal Non-Wrapping Category Pills */}
      <div className="flex items-center justify-between gap-2 border-b border-theme-main/40 pb-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs font-bnUI">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quiet Algorithm Feed Sort Switcher */}
        <div className="flex items-center space-x-1 text-xs font-bnUI shrink-0">
          <button
            onClick={() => setSortAlgo('trending')}
            className={`px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1 ${
              sortAlgo === 'trending' ? 'text-emerald-500 bg-emerald-500/10 font-bold' : 'opacity-50 hover:opacity-100'
            }`}
            title={uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}</span>
          </button>
          <button
            onClick={() => setSortAlgo('latest')}
            className={`px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1 ${
              sortAlgo === 'latest' ? 'text-emerald-500 bg-emerald-500/10 font-bold' : 'opacity-50 hover:opacity-100'
            }`}
            title={uiLang === 'bn' ? 'নতুন' : 'Latest'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{uiLang === 'bn' ? 'নতুন' : 'Latest'}</span>
          </button>
          <button
            onClick={() => setSortAlgo('top')}
            className={`px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1 ${
              sortAlgo === 'top' ? 'text-amber-500 bg-amber-500/10 font-bold' : 'opacity-50 hover:opacity-100'
            }`}
            title={uiLang === 'bn' ? 'সেরা' : 'Top'}
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{uiLang === 'bn' ? 'সেরা' : 'Top'}</span>
          </button>
        </div>
      </div>

      {/* Rule #12: Section 1 — Continue Reading Card */}
      {continueReadingItem && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold opacity-60 font-bnUI tracking-wider uppercase">
            {uiLang === 'bn' ? 'পড়া চালিয়ে যান' : 'Continue Reading'}
          </h3>
          <div
            onClick={() => onRead(continueReadingItem)}
            className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-500 font-semibold font-bnUI">
                {continueReadingItem.author?.name || 'Author'}
              </span>
              <h4 className="text-sm font-bold font-bnSerif line-clamp-1">
                {continueReadingItem.title}
              </h4>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Rule #12: Section 2 — For You / Main Literature Stream */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold opacity-60 font-bnUI tracking-wider uppercase">
          {uiLang === 'bn' ? 'আপনার জন্য' : 'For You'}
        </h3>

        {/* Rule #13: Skeleton Loaders */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 rounded-2xl border border-theme-main/30 bg-theme-card space-y-3 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500/20" />
                  <div className="space-y-1 flex-1">
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
          <div className="p-8 text-center rounded-2xl border border-theme-main/40 bg-theme-card space-y-3">
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
          /* Rule #14: Designed Empty State */
          <div className="p-10 text-center rounded-2xl border border-theme-main/40 bg-theme-card space-y-3">
            <Sparkles className="w-10 h-10 text-emerald-500/40 mx-auto" />
            <h3 className="text-base font-bold font-bnUI">{t('noResultsFound', uiLang)}</h3>
            <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto">
              {uiLang === 'bn'
                ? 'আপনার নির্বাচন করা বিভাগ বা ভাষায় এখনো কোনো লেখা নেই।'
                : 'No literature found for this category or filter.'}
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
    </div>
  );
};
