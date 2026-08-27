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
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Clean Header & Search */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-bnSerif tracking-tight">
              {uiLang === 'bn' ? 'নির্বাক সাহিত্য' : 'Nirbak Literature'}
            </h2>
            <p className="text-xs opacity-60 font-bnUI">
              {uiLang === 'bn' ? 'কবিতা, গল্প ও সাহিত্য ভাবনার স্থান' : 'Sanctuary for poetry and short fiction'}
            </p>
          </div>
          {isWriter && (
            <button
              onClick={onOpenCreate}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-all shadow-sm"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>{t('publishHeader', uiLang)}</span>
            </button>
          )}
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t('searchPlaceholder', uiLang)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-theme-main bg-theme-card text-theme-main text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs opacity-50 hover:opacity-100 font-bnUI"
            >
              ✕
            </button>
          )}
        </div>

        {/* Clean Category & Filter Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 border-b border-theme-main/40 pb-2.5">
          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs font-bnUI">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                      : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Feed Algorithm Sort Selector */}
          <div className="flex items-center space-x-1 text-xs font-bnUI shrink-0">
            <button
              onClick={() => setSortAlgo('trending')}
              className={`p-1.5 rounded-lg transition-colors ${
                sortAlgo === 'trending' ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-50 hover:opacity-100'
              }`}
              title={uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSortAlgo('latest')}
              className={`p-1.5 rounded-lg transition-colors ${
                sortAlgo === 'latest' ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-50 hover:opacity-100'
              }`}
              title={uiLang === 'bn' ? 'সাম্প্রতিক' : 'Latest'}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSortAlgo('top')}
              className={`p-1.5 rounded-lg transition-colors ${
                sortAlgo === 'top' ? 'text-amber-500 bg-amber-500/10' : 'opacity-50 hover:opacity-100'
              }`}
              title={uiLang === 'bn' ? 'সেরা' : 'Top Rated'}
            >
              <Flame className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Literature Feed List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-3xl border border-theme-main bg-theme-card space-y-3 animate-pulse"
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
      ) : filteredItems.length === 0 ? (
        <div className="p-10 text-center rounded-3xl border border-theme-main bg-theme-card space-y-3">
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
