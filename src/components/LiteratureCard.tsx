import React from 'react';
import { Heart, MessageSquare, Eye, Clock, Bookmark, Share2 } from 'lucide-react';
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.content.slice(0, 100),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(uiLang === 'bn' ? 'লিঙ্ক কপি করা হয়েছে! 🔗' : 'Link copied to clipboard! 🔗');
    }
  };

  return (
    <article
      onClick={() => onRead(item)}
      className="p-5 rounded-3xl border border-theme-main/50 bg-theme-card shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Facebook/Instagram-Style Author Header & Category */}
      <div className="flex items-center justify-between gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onAuthorClick) onAuthorClick(item.authorId || item.author.id);
          }}
          className="flex items-center space-x-3 hover:opacity-85 transition-opacity cursor-pointer"
        >
          <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shrink-0">
            <div className="w-9 h-9 rounded-full bg-theme-card text-emerald-500 font-bold flex items-center justify-center text-sm border border-emerald-500/20 overflow-hidden">
              {item.author?.avatarUrl ? (
                <img src={item.author.avatarUrl} alt={item.author.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                item.author?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
          </div>
          <div>
            <h4 className={`text-sm font-bold leading-tight group-hover:text-emerald-500 transition-colors ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
              {item.author?.name || (uiLang === 'bn' ? 'অজ্ঞাত লেখক' : 'Unknown Author')}
            </h4>
            <div className="flex items-center space-x-1.5 text-[11px] opacity-60 font-enUI">
              <span>@{item.author?.username || 'writer'}</span>
              <span>•</span>
              <span className="flex items-center space-x-0.5">
                <Clock className="w-3 h-3 inline" />
                <span>{item.readingTimeMin || 1}m read</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {isRead && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-bnUI flex items-center space-x-0.5">
              <span>✓</span>
              <span>{uiLang === 'bn' ? 'পঠিত' : 'Read'}</span>
            </span>
          )}
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-bnUI">
            {categoryLabelMap[item.category] || item.category}
          </span>
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              saved ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-60 hover:opacity-100 hover:bg-gray-500/10'
            }`}
            title={saved ? t('savedOffline', uiLang) : t('saveOffline', uiLang)}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="space-y-2">
        <h3
          className={`text-xl font-bold leading-snug group-hover:text-emerald-500 transition-colors ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-sm line-clamp-3 leading-relaxed opacity-85 ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
        >
          {item.content}
        </p>
      </div>

      {/* Facebook-Style Equal 3-Column Action Bar */}
      <div className="pt-2 border-t border-theme-main/40 flex items-center justify-between text-xs">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={toggleLikeMutation.isPending}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
            item.is_liked
              ? 'bg-rose-500/15 text-rose-500 font-bold'
              : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              item.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
          <span className="font-bnUI">{item.likesCount > 0 ? item.likesCount : (uiLang === 'bn' ? 'লাইক' : 'Like')}</span>
        </button>

        {/* Comment */}
        <button
          onClick={handleCommentClick}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 hover:bg-gray-500/10 transition-all active:scale-95 font-bnUI"
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>{item.commentsCount > 0 ? item.commentsCount : (uiLang === 'bn' ? 'মন্তব্য' : 'Comment')}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 hover:bg-gray-500/10 transition-all active:scale-95 font-bnUI"
        >
          <Share2 className="w-4 h-4" />
          <span>{uiLang === 'bn' ? 'শেয়ার' : 'Share'}</span>
        </button>
      </div>
    </article>
  );
};
