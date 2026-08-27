import React from 'react';
import { Heart, MessageSquare, Eye, Clock, Bookmark, Share2 } from 'lucide-react';
import { Literature } from '../types';
import { useToggleLike } from '../hooks/useLiterature';
import { useReaderStore } from '../store/useReaderStore';

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
  const { toggleSaveOffline, isSavedOffline } = useReaderStore();
  const saved = isSavedOffline(item.id);

  const isBengali = item.language === 'bn';

  const categoryLabelMap = {
    poem: isBengali ? 'কবিতা' : 'Poem',
    story: isBengali ? 'গল্প' : 'Story',
    micro_poem: isBengali ? 'অনুকবিতা' : 'Micro-poem',
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeMutation.mutate(item.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveOffline(item);
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
      alert('লিঙ্ক কপি করা হয়েছে!');
    }
  };

  return (
    <article
      onClick={() => onRead(item)}
      className="p-5 rounded-2xl border border-theme-main bg-theme-card shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3.5 group"
    >
      {/* Author Header & Category */}
      <div className="flex items-center justify-between gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onAuthorClick) onAuthorClick(item.authorId || item.author.id);
          }}
          className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-sm border border-emerald-500/30 overflow-hidden">
            {item.author?.avatarUrl ? (
              <img src={item.author.avatarUrl} alt={item.author.name} className="w-full h-full object-cover" />
            ) : (
              item.author?.name?.charAt(0).toUpperCase() || 'A'
            )}
          </div>
          <div>
            <h4 className={`text-sm font-semibold leading-tight ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
              {item.author?.name || 'অজ্ঞাত লেখক'}
            </h4>
            <p className="text-[11px] text-gray-500 font-enUI">@{item.author?.username || 'writer'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium font-bnUI">
            {categoryLabelMap[item.category] || item.category}
          </span>
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-full transition-colors ${
              saved ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-600'
            }`}
            title={saved ? 'অফলাইন থেকে সরান' : 'অফলাইনে সংরক্ষণ করুন'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="space-y-1.5">
        <h3
          className={`text-xl font-bold leading-snug group-hover:text-emerald-600 transition-colors ${
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

      {/* Footer Stats & Actions */}
      <div className="pt-2 border-t border-theme-main/60 flex items-center justify-between text-xs opacity-80">
        <div className="flex items-center space-x-3 text-gray-500">
          <span className="flex items-center space-x-1 font-bnUI">
            <Clock className="w-3.5 h-3.5" />
            <span>{isBengali ? `${item.readingTimeMin || 1} মিনিট` : `${item.readingTimeMin || 1} min`}</span>
          </span>
          <span className="flex items-center space-x-1 font-bnUI">
            <Eye className="w-3.5 h-3.5" />
            <span>{item.viewsCount}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              item.is_liked
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                item.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
            <span className="font-bnUI">{item.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentClick}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-300 font-bnUI"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{item.commentsCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-gray-600 transition-colors"
            title="শেয়ার করুন"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
