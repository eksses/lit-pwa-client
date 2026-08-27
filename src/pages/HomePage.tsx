import React, { useState, useMemo } from 'react';
import { Search, Sparkles, RefreshCw, TrendingUp, Flame, UserCheck } from 'lucide-react';
import { Category, Language, Literature } from '../types';
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
  onOpenCreate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [sortAlgo, setSortAlgo] = useState<'trending' | 'latest' | 'top'>('trending');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { uiLang } = useLanguageStore();

  const { data, isLoading, isError, refetch } = useLiteratureList({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    language: langFilter === 'all' ? undefined : langFilter,
    author_id: selectedAuthorId || undefined,
    sort: sortAlgo,
  });

  const categories = [
    { id: 'all', label: t('all', uiLang) },
    { id: 'poem', label: t('poems', uiLang) },
    { id: 'story', label: t('stories', uiLang) },
    { id: 'micro_poem', label: t('microPoetry', uiLang) },
  ];

  // Extract featured unique authors for Instagram/Facebook Stories reel
  const featuredAuthors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; avatarUrl?: string | null }>();
    (data?.items || []).forEach((item) => {
      if (item.author && !map.has(item.author.id)) {
        map.set(item.author.id, {
          id: item.author.id,
          name: item.author.name,
          avatarUrl: item.author.avatarUrl,
        });
      }
    });
    return Array.from(map.values()).slice(0, 10);
  }, [data?.items]);

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
    <div className="space-y-4 pb-20 max-w-xl mx-auto">
      {/* Instagram / Facebook Style Featured Authors Reel */}
      {featuredAuthors.length > 0 && (
        <div className="pt-1 border-b border-theme-main/30 pb-3">
          <div className="flex items-center space-x-3.5 overflow-x-auto no-scrollbar py-1 px-1">
            {featuredAuthors.map((author) => {
              const isSelected = selectedAuthorId === author.id;
              return (
                <button
                  key={author.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedAuthorId(null);
                    } else {
                      setSelectedAuthorId(author.id);
                    }
                  }}
                  className="flex flex-col items-center space-y-1 shrink-0 group focus:outline-none"
                >
                  <div
                    className={`p-[2px] rounded-full transition-transform duration-200 group-hover:scale-105 ${
                      isSelected
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/50'
                        : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-theme-card p-0.5 overflow-hidden">
                      {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-xs">
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bnUI opacity-85 max-w-[56px] truncate font-medium leading-none">
                    {author.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clean Feed Controls Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-theme-main/40 pb-2">
          {/* Algorithm Tabs */}
          <div className="flex items-center space-x-1 text-xs font-bnUI">
            <button
              onClick={() => setSortAlgo('trending')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                sortAlgo === 'trending'
                  ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{uiLang === 'bn' ? 'জনপ্রিয়' : 'Trending'}</span>
            </button>
            <button
              onClick={() => setSortAlgo('latest')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                sortAlgo === 'latest'
                  ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{uiLang === 'bn' ? 'নতুন' : 'Latest'}</span>
            </button>
            <button
              onClick={() => setSortAlgo('top')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                sortAlgo === 'top'
                  ? 'bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{uiLang === 'bn' ? 'সেরা' : 'Top'}</span>
            </button>
          </div>

          {/* Search Toggle Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-full transition-colors ${
              showSearch ? 'bg-emerald-500 text-white' : 'opacity-60 hover:opacity-100'
            }`}
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Search Input */}
        {showSearch && (
          <div className="relative animate-in slide-in-from-top duration-200">
            <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder={t('searchPlaceholder', uiLang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-2xl border border-theme-main bg-theme-card text-theme-main text-xs font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2 text-xs opacity-50 hover:opacity-100 font-bnUI"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Minimal Category Pills */}
        <div className="flex items-center justify-between text-xs font-bnUI pt-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {selectedAuthorId && (
            <button
              onClick={() => setSelectedAuthorId(null)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold flex items-center space-x-1 shrink-0"
            >
              <UserCheck className="w-3 h-3" />
              <span>{uiLang === 'bn' ? 'ফিল্টার সরান' : 'Clear Author'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Stream Literature Cards */}
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
