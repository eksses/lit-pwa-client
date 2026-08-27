import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, Feather } from 'lucide-react';
import { Category, Language, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
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
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch } = useLiteratureList({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    language: langFilter === 'all' ? undefined : langFilter,
  });

  const categories = [
    { id: 'all', label: 'সকল সাহিত্য' },
    { id: 'poem', label: 'কবিতা' },
    { id: 'story', label: 'গল্প' },
    { id: 'micro_poem', label: 'অনুকবিতা' },
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
            <h2 className="text-xl font-bold font-bnUI tracking-tight">সাহিত্য ফিড</h2>
            <p className="text-xs text-gray-500 font-bnUI">বাংলা ও বিশ্ব সাহিত্যের নতুন সংযোজনসমূহ</p>
          </div>
          <button
            onClick={onOpenCreate}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium font-bnUI hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>নতুন প্রকাশনা</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="কবিতা, গল্প বা লেখক খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-theme-main bg-theme-card text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-bnUI"
            >
              মুছে ফেলুন
            </button>
          )}
        </div>

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
                    : 'bg-theme-card border border-theme-main text-gray-600 dark:text-gray-300 hover:border-emerald-500/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
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
          <p className="text-sm font-bnUI text-rose-500">ফিড লোড করতে সমস্যা হয়েছে।</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>পুনরায় চেষ্টা করুন</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-theme-main bg-theme-card space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold font-bnUI">কোনো সাহিত্য পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-500 font-bnUI max-w-xs mx-auto">
            আপনার নির্বাচন করা বিভাগ বা ভাষায় এখনো কোনো লেখা নেই। প্রথম লেখাটি আপনিই প্রকাশ করতে পারেন!
          </p>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm inline-block"
          >
            নতুন লেখা প্রকাশ করুন
          </button>
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
