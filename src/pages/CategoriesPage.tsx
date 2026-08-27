import React, { useState } from 'react';
import { BookOpen, Scroll, Feather, Sparkles, Search, User as UserIcon } from 'lucide-react';
import { Category, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { LiteratureCard } from '../components/LiteratureCard';

interface CategoriesPageProps {
  onRead: (item: Literature) => void;
  onComment: (item: Literature) => void;
  onAuthorClick: (authorId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onRead,
  onComment,
  onAuthorClick,
}) => {
  const [selectedCat, setSelectedCat] = useState<Category>('poem');
  const [searchQuery, setSearchQuery] = useState('');
  const { uiLang } = useLanguageStore();

  const { data, isLoading } = useLiteratureList({ category: selectedCat });

  const categories = [
    {
      id: 'poem' as Category,
      title: t('poems', uiLang),
      subtitle: 'Poems & Verses',
      desc: t('categoryPoemsDesc', uiLang),
      icon: Feather,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500',
    },
    {
      id: 'story' as Category,
      title: t('stories', uiLang),
      subtitle: 'Short Stories',
      desc: t('categoryStoriesDesc', uiLang),
      icon: BookOpen,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500',
    },
    {
      id: 'micro_poem' as Category,
      title: t('microPoetry', uiLang),
      subtitle: 'Micro Poems & Haikus',
      desc: t('categoryMicroDesc', uiLang),
      icon: Scroll,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-500',
    },
  ];

  const filteredItems = (data?.items || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.author?.name?.toLowerCase().includes(q) ||
      item.author?.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-20 max-w-xl mx-auto pt-2">
      {/* Header & Search */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold font-bnSerif tracking-tight">
            {uiLang === 'bn' ? 'আবিষ্কার ও অনুসন্ধান' : 'Discover & Search'}
          </h2>
          <p className="text-xs opacity-60 font-bnUI">
            {uiLang === 'bn' ? 'কবিতা, গল্প ও প্রিয় লেখকদের খুঁজুন' : 'Find poems, stories, or authors by name'}
          </p>
        </div>

        {/* Global Search Bar (Poem, Story, Author) */}
        <div className="relative">
          <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={uiLang === 'bn' ? 'কবিতা, গল্প বা লেখকের নাম খুঁজুন...' : 'Search poems, stories, or authors...'}
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
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCat === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-4 rounded-3xl border bg-gradient-to-br cursor-pointer transition-all ${
                cat.color
              } ${
                isSelected
                  ? 'ring-2 ring-emerald-500 scale-[1.02] shadow-md'
                  : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-6 h-6" />
                {isSelected && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bnUI font-semibold">
                    {uiLang === 'bn' ? 'নির্বাচিত' : 'Selected'}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold font-bnUI">{cat.title}</h3>
              <p className="text-[11px] font-enUI opacity-75">{cat.subtitle}</p>
              <p className="text-xs font-bnUI opacity-90 mt-1">{cat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Category Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-theme-main pb-2">
          <h3 className="text-base font-bold font-bnUI flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>
              {selectedCat === 'poem' ? t('poems', uiLang) : selectedCat === 'story' ? t('stories', uiLang) : t('microPoetry', uiLang)}
            </span>
          </h3>
          <span className="text-xs opacity-60 font-bnUI">
            {filteredItems.length} {uiLang === 'bn' ? 'টি উপাদান' : 'works'}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-5 rounded-3xl border border-theme-main bg-theme-card animate-pulse h-32" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-theme-main bg-theme-card opacity-70 font-bnUI text-sm space-y-1">
            <UserIcon className="w-8 h-8 mx-auto opacity-40 mb-2" />
            <p>{t('noResultsFound', uiLang)}</p>
            <p className="text-xs opacity-60">{uiLang === 'bn' ? 'অন্য নাম বা শব্দ দিয়ে আবার চেষ্টা করুন' : 'Try searching for another keyword or author name'}</p>
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
    </div>
  );
};
