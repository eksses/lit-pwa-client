import React, { useState } from 'react';
import { BookOpen, Scroll, Feather, Sparkles, Search, User as UserIcon, Users, ArrowRight, Trash2 } from 'lucide-react';
import { Category, Literature } from '../types';
import { useLiteratureList } from '../hooks/useLiterature';
import { useAuthorsList, useDeleteUser } from '../hooks/useAuthors';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { t } from '../utils/translations';
import { LiteratureCard } from '../components/LiteratureCard';
import { ConfirmModal } from '../components/ConfirmModal';

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
  const [selectedCat, setSelectedCat] = useState<'all' | Category | 'authors'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);

  const { user } = useAuthStore();
  const { uiLang } = useLanguageStore();
  const { showToast } = useToastStore();
  const deleteUserMutation = useDeleteUser();

  const isAdmin = user?.role === 'admin';
  const isAuthorsTab = selectedCat === 'authors';

  // Fetch literature items for selected category
  const { data: litData, isLoading: isLitLoading } = useLiteratureList({
    category: selectedCat === 'all' || isAuthorsTab ? undefined : selectedCat,
  });

  // Fetch authors list for the Authors Directory tab or search query
  const { data: authorsData, isLoading: isAuthorsLoading } = useAuthorsList(searchQuery);

  const categoryPills = [
    { id: 'all', label: uiLang === 'bn' ? 'সকল সাহিত্য' : 'All Works', icon: Sparkles },
    { id: 'poem', label: t('poems', uiLang), icon: Feather },
    { id: 'story', label: t('stories', uiLang), icon: BookOpen },
    { id: 'micro_poem', label: t('microPoetry', uiLang), icon: Scroll },
    { id: 'prose_poetry', label: t('prosePoetry', uiLang), icon: Feather },
    { id: 'novel', label: t('novel', uiLang), icon: BookOpen },
    { id: 'serial_story', label: t('serialStory', uiLang), icon: Scroll },
    { id: 'long_story', label: t('longStory', uiLang), icon: BookOpen },
    { id: 'collection', label: t('collection', uiLang), icon: Sparkles },
    { id: 'uncategorized', label: t('uncategorized', uiLang), icon: BookOpen },
    { id: 'authors', label: uiLang === 'bn' ? 'লেখকবৃন্দ' : 'Authors', icon: Users },
  ];

  const filteredLitItems = (litData?.items || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.author?.name?.toLowerCase().includes(q) ||
      item.author?.username?.toLowerCase().includes(q)
    );
  });

  const handleDeleteUserConfirm = () => {
    if (!deletingUser) return;
    deleteUserMutation.mutate(deletingUser.id, {
      onSuccess: () => {
        showToast(
          uiLang === 'bn'
            ? `${deletingUser.name}-এর অ্যাকাউন্ট এবং তার সকল পোস্ট মুছে ফেলা হয়েছে`
            : `${deletingUser.name}'s account and all works deleted`
        );
        setDeletingUser(null);
      },
    });
  };

  return (
    <div className="space-y-5 pb-20 max-w-xl mx-auto pt-2">
      {/* Header & Global Search Bar */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold font-bnSerif tracking-tight">
            {uiLang === 'bn' ? 'আবিষ্কার ও অনুসন্ধান' : 'Discover & Search'}
          </h2>
          <p className="text-xs opacity-60 font-bnUI">
            {uiLang === 'bn' ? 'বিষয়ভিত্তিক সাহিত্য এবং কবি ও লেখকদের খুঁজুন' : 'Explore poetry, fiction, or discover author profiles'}
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={uiLang === 'bn' ? 'কবিতা, গল্প বা লেখকের নাম দিয়ে খুঁজুন...' : 'Search literature title, topic, or author name...'}
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

      {/* Category & Section Navigation Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar border-b border-theme-main/40 pb-2.5 text-xs font-bnUI">
        {categoryPills.map((pill) => {
          const Icon = pill.icon;
          const isActive = selectedCat === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedCat(pill.id as any)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* AUTHORS DIRECTORY VIEW */}
      {isAuthorsTab ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-bnUI opacity-80 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{uiLang === 'bn' ? 'সকল কবি ও লেখকগণ' : 'All Platform Authors'}</span>
            </h3>
            <span className="text-xs opacity-60 font-bnUI">
              {authorsData?.length || 0} {uiLang === 'bn' ? 'জন লেখক' : 'authors'}
            </span>
          </div>

          {isAuthorsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 rounded-3xl border border-theme-main bg-theme-card animate-pulse h-28" />
              ))}
            </div>
          ) : !authorsData || authorsData.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-theme-main bg-theme-card opacity-70 font-bnUI text-sm">
              <UserIcon className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>{uiLang === 'bn' ? 'কোনো লেখক পাওয়া যায়নি।' : 'No authors found.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {authorsData.map((author) => (
                <div
                  key={author.id}
                  onClick={() => onAuthorClick(author.id)}
                  className="p-4 rounded-3xl border border-theme-main/60 bg-theme-card hover:border-emerald-500/50 transition-all cursor-pointer space-y-2.5 group relative"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/15 text-emerald-500 font-bold flex items-center justify-center text-sm border border-emerald-500/20 overflow-hidden shrink-0">
                      {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        author.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold truncate group-hover:text-emerald-500 transition-colors font-bnUI">
                          {author.name}
                        </h4>
                        {isAdmin && author.id !== user?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingUser({ id: author.id, name: author.name });
                            }}
                            className="p-1 rounded-full text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title={uiLang === 'bn' ? 'অ্যাকাউন্ট মুছুন (Admin)' : 'Delete User (Admin)'}
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs opacity-60 font-enUI truncate">@{author.username}</p>
                    </div>
                  </div>

                  {author.bio && (
                    <p className="text-xs opacity-75 line-clamp-2 leading-relaxed font-bnUI">
                      {author.bio}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] opacity-75 font-bnUI border-t border-theme-main/30">
                    <span>{author.worksCount || 0} {uiLang === 'bn' ? 'টি লেখা' : 'works'}</span>
                    <span className="flex items-center space-x-1 text-emerald-500 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>{uiLang === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* LITERATURE STREAM VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-bnUI opacity-80 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>
                {selectedCat === 'all'
                  ? (uiLang === 'bn' ? 'সকল সাহিত্য উপাদান' : 'All Literature Works')
                  : selectedCat === 'poem'
                  ? t('poems', uiLang)
                  : selectedCat === 'story'
                  ? t('stories', uiLang)
                  : selectedCat === 'serial_story'
                  ? t('serialStory', uiLang)
                  : selectedCat === 'novel'
                  ? t('novel', uiLang)
                  : selectedCat === 'long_story'
                  ? t('longStory', uiLang)
                  : selectedCat === 'collection'
                  ? t('collection', uiLang)
                  : t('microPoetry', uiLang)}
              </span>
            </h3>
            <span className="text-xs opacity-60 font-bnUI">
              {filteredLitItems.length} {uiLang === 'bn' ? 'টি লেখা' : 'works'}
            </span>
          </div>

          {isLitLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="p-5 rounded-3xl border border-theme-main bg-theme-card animate-pulse h-32" />
              ))}
            </div>
          ) : filteredLitItems.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-theme-main bg-theme-card opacity-70 font-bnUI text-sm space-y-1">
              <UserIcon className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>{t('noResultsFound', uiLang)}</p>
              <p className="text-xs opacity-60">
                {uiLang === 'bn' ? 'অন্য নাম বা শব্দ দিয়ে অনুসন্ধান করুন' : 'Try searching for another keyword or topic'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLitItems.map((item) => (
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
      )}

      {/* Sleek Custom Confirm Modal for User Account Deletion */}
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title={uiLang === 'bn' ? 'অ্যাকাউন্ট মুছে ফেলা' : 'Delete User Account'}
        message={
          uiLang === 'bn'
            ? `আপনি কি নিশ্চিত যে '${deletingUser?.name}'-এর অ্যাকাউন্ট এবং তার সকল প্রকাশিত কবিতা ও গল্প চূড়ান্তভাবে মুছে ফেলতে চান?`
            : `Are you sure you want to permanently delete '${deletingUser?.name}' and all associated works?`
        }
        confirmText={uiLang === 'bn' ? 'অ্যাকাউন্ট মুছুন' : 'Delete Account'}
        onConfirm={handleDeleteUserConfirm}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
};
