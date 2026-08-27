import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, Feather, TrendingUp, Flame } from 'lucide-react';
import { Category, Language, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
import { useAuthStore } from '../store/useAuthStore';
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
  onOpenCreate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [sortAlgo, setSortAlgo] = useState<'trending' | 'latest' | 'top'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated } = useAuthStore();
  const { uiLang } = useLanguageStore();

  const isWriter = isAuthenticated && (user?.role === 'writer' || user?.role === 'author' || user?.role === 'admin');

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

  const filteredItems = (data?.items || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.author?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner / Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-bnUI tracking-tight">
              {uiLang === 'bn' ? 'সাহিত্য ফিড' : 'Literature Feed'}
            </h2>
            <p className="text-xs opacity-60 font-bnUI">
              {uiLang === 'bn' ? 'অনলাইন ও অফলাইনে সাহিত্য পাঠের ডিজিটাল ঘর' : 'Discover poetry, fiction & stories'}
            </p>
          </div>
          {isWriter && (
            <button
              onClick={onOpenCreate}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>{t('publishHeader', uiLang)}</span>
            </button>
          )}
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t('searchPlaceholder', uiLang)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-theme-main bg-theme-card text-theme-main text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs opacity-50 hover:opacity-100 font-bnUI"
            >
              {uiLang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
            </button>
          )}
        </div>

        {/* Feed Algorithm & Category Controls */}
        <div className="space-y-2">
          {/* Category Pill Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bnUI">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-theme-card border border-theme-main opacity-80 hover:opacity-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Algorithm Feed Sorting Bar */}
          <div className="flex items-center justify-between pt-1 font-bnUI border-b border-theme-main/40 pb-2">
            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setSortAlgo('trending')}
                className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                  sortAlgo === 'trending'
                    ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30 shadow-sm'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}</span>
              </button>
              <button
                onClick={() => setSortAlgo('latest')}
                className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                  sortAlgo === 'latest'
                    ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30 shadow-sm'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{uiLang === 'bn' ? 'সাম্প্রতিক' : 'Latest'}</span>
              </button>
              <button
                onClick={() => setSortAlgo('top')}
                className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
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
              {filteredItems.length} {uiLang === 'bn' ? 'টি লেখা' : 'works'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Literature Feed List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl border border-theme-main bg-theme-card space-y-3 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gray-500/20" />
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
        <div className="p-8 text-center rounded-2xl border border-theme-main bg-theme-card space-y-3">
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
      ) : filteredItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-theme-main bg-theme-card space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold font-bnUI">{t('noResultsFound', uiLang)}</h3>
          <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto">
            {uiLang === 'bn'
              ? 'আপনার নির্বাচন করা বিভাগ বা ভাষায় এখনো কোনো লেখা নেই।'
              : 'No literature found for this category or filter.'}
          </p>
          {isWriter && (
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm inline-block"
            >
              {t('publishHeader', uiLang)}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
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
