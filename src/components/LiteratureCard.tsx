import React from 'react';
import { Heart, MessageSquare, Bookmark } from 'lucide-react';
import { Literature } from '../types';
import { useToggleLike } from '../hooks/useLiterature';
import { useReaderStore } from '../store/useReaderStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { t } from '../utils/translations';

interface LiteratureCardProps {
  item: Literature;
  onRead: (item: Literature) => void;
  onComment: (item: Literature) => void;
  onAuthorClick?: (authorId: string) => void;
}

export const LiteratureCard: React.FC<LiteratureCardProps> = ({
  item,
  onRead,
  onComment,
  onAuthorClick,
}) => {
  const toggleLikeMutation = useToggleLike();
  const { toggleSaveOffline, isSavedOffline, hasRead } = useReaderStore();
  const { uiLang } = useLanguageStore();
  const { showToast } = useToastStore();
  const saved = isSavedOffline(item.id);
  const isRead = hasRead(item.id);

  const isBengali = item.language === 'bn';

  const categoryLabelMap = {
    poem: t('poems', uiLang),
    story: t('stories', uiLang),
    micro_poem: t('microPoetry', uiLang),
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeMutation.mutate(item.id);
    showToast(
      item.is_liked
        ? (uiLang === 'bn' ? 'লাইক সরানো হয়েছে' : 'Unliked')
        : (uiLang === 'bn' ? 'লাইক দেওয়া হয়েছে ❤️' : 'Liked ❤️')
    );
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveOffline(item);
    showToast(
      saved
        ? (uiLang === 'bn' ? 'অফলাইন থেকে সরান হয়েছে' : 'Removed from offline')
        : (uiLang === 'bn' ? 'অফলাইনে সংরক্ষিত হয়েছে 🔖' : 'Saved for offline reading 🔖')
    );
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment(item);
  };

  return (
    <article
      onClick={() => onRead(item)}
      className="p-5 rounded-2xl border border-theme-main/40 bg-theme-card shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3.5 group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Strict Visual Hierarchy: Secondary Author & Meta Info */}
      <div className="flex items-center justify-between gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onAuthorClick) onAuthorClick(item.authorId || item.author.id);
          }}
          className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-xs border border-emerald-500/20 overflow-hidden shrink-0">
            {item.author?.avatarUrl ? (
              <img src={item.author.avatarUrl} alt={item.author.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              item.author?.name?.charAt(0).toUpperCase() || 'A'
            )}
          </div>
          <div>
            <h4 className={`text-xs font-semibold text-theme-main leading-tight group-hover:text-emerald-500 transition-colors ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
              {item.author?.name || (uiLang === 'bn' ? 'অজ্ঞাত লেখক' : 'Unknown Author')}
            </h4>
            <p className="text-[10px] opacity-50 font-enUI">@{item.author?.username || 'writer'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-bnUI">
          {isRead && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold flex items-center space-x-0.5">
              <span>✓</span>
              <span>{uiLang === 'bn' ? 'পঠিত' : 'Read'}</span>
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
            {categoryLabelMap[item.category] || item.category}
          </span>
        </div>
      </div>

      {/* Primary Literature Title & Excerpt */}
      <div className="space-y-1.5">
        <h3
          className={`text-xl font-bold leading-snug group-hover:text-emerald-500 transition-colors ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-sm line-clamp-3 leading-relaxed opacity-80 ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
        >
          {item.content}
        </p>
      </div>

      {/* Rule 1 & Rule 11: Quiet Action Line: ♡ 2 · 💬 2 · 🔖 */}
      <div className="pt-2 border-t border-theme-main/30 flex items-center justify-between text-xs opacity-75">
        <div className="flex items-center space-x-4">
          {/* 44x44px Touch Target Like Button */}
          <button
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className={`min-w-[44px] min-h-[36px] px-2 py-1 rounded-xl flex items-center space-x-1.5 transition-all active:scale-90 ${
              item.is_liked
                ? 'text-rose-500 font-bold bg-rose-500/10'
                : 'hover:bg-gray-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                item.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
            <span className="font-bnUI">{item.likesCount}</span>
          </button>

          <span className="opacity-30">•</span>

          {/* 44x44px Touch Target Comment Button */}
          <button
            onClick={handleCommentClick}
            className="min-w-[44px] min-h-[36px] px-2 py-1 rounded-xl flex items-center space-x-1.5 hover:bg-gray-500/10 opacity-80 hover:opacity-100 transition-all active:scale-90 font-bnUI"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>{item.commentsCount}</span>
          </button>
        </div>

        {/* 44x44px Touch Target Bookmark Button */}
        <button
          onClick={handleSave}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            saved ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-60 hover:opacity-100 hover:bg-gray-500/10'
          }`}
          title={saved ? t('savedOffline', uiLang) : t('saveOffline', uiLang)}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-500' : ''}`} />
        </button>
      </div>
    </article>
  );
};
