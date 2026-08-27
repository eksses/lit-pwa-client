import React, { useState } from 'react';
import { BookOpen, Scroll, Feather, Sparkles } from 'lucide-react';
import { Category, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
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

  const { data, isLoading } = useLiteratureList({ category: selectedCat });

  const categories = [
    {
      id: 'poem' as Category,
      title: 'কবিতা',
      subtitle: 'Poems & Verses',
      desc: 'আবেগ ও ছন্দের ছন্দে গাঁথা নতুন ভাবনাসমূহ',
      icon: Feather,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600',
    },
    {
      id: 'story' as Category,
      title: 'গল্প',
      subtitle: 'Short Stories',
      desc: 'গল্প ও আখ্যানের এক মায়াবী অনাবিষ্কৃত জগত',
      icon: BookOpen,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600',
    },
    {
      id: 'micro_poem' as Category,
      title: 'অনুকবিতা',
      subtitle: 'Micro Poems & Haikus',
      desc: 'স্বল্প কথায় অনুভূতির গভীরতম প্রকাশ',
      icon: Scroll,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold font-bnUI tracking-tight">বিষয়ভিত্তিক সাহিত্য (Categories)</h2>
        <p className="text-xs text-gray-500 font-bnUI">আপনার পছন্দের বিভাগে সাহিত্য অনুসন্ধান করুন</p>
      </div>

      {/* Category Visual Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCat === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-4 rounded-2xl border bg-gradient-to-br cursor-pointer transition-all ${
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
                    নির্বাচিত
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
              {selectedCat === 'poem' ? 'কবিতাসমূহ' : selectedCat === 'story' ? 'গল্পসমূহ' : 'অনুকবিতাসমূহ'}
            </span>
          </h3>
          <span className="text-xs text-gray-500 font-bnUI">
            {data?.items.length || 0} টি সাহিত্য পাওয়া গেছে
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-5 rounded-2xl border border-theme-main bg-theme-card animate-pulse h-32" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-theme-main bg-theme-card text-gray-400 font-bnUI text-sm">
            এই বিভাগে এখনো কোনো সাহিত্য প্রকাশ করা হয়নি।
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
