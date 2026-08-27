import React, { useState, useRef } from 'react';
import { Heart, MessageSquare, Clock, Bookmark, Share2, Trash2, Eye, X, Sparkles } from 'lucide-react';
import { Literature } from '../types';
import { useToggleLike, useDeleteLiterature } from '../hooks/useLiterature';
import { useAuthStore } from '../store/useAuthStore';
import { useReaderStore } from '../store/useReaderStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { t } from '../utils/translations';
import { ConfirmModal } from './ConfirmModal';

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
  const { user } = useAuthStore();
  const toggleLikeMutation = useToggleLike();
  const deleteLiteratureMutation = useDeleteLiterature();
  const { toggleSaveOffline, isSavedOffline, hasRead } = useReaderStore();
  const { uiLang } = useLanguageStore();
  const { showToast } = useToastStore();

  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saved = isSavedOffline(item.id);
  const isRead = hasRead(item.id);

  const canDelete = user?.role === 'admin' || (user?.id && (user.id === item.authorId || user.id === item.author?.id));
  const isBengali = item.language === 'bn';

  const categoryLabelMap: Record<string, string> = {
    poem: t('poems', uiLang),
    story: t('stories', uiLang),
    micro_poem: t('microPoetry', uiLang),
    prose_poetry: t('prosePoetry', uiLang),
    novel: t('novel', uiLang),
    serial_story: t('serialStory', uiLang),
    long_story: t('longStory', uiLang),
    collection: t('collection', uiLang),
    uncategorized: t('uncategorized', uiLang),
    other: t('uncategorized', uiLang),
  };

  // Long-press gesture handlers for native mobile touch feedback
  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
      setShowLongPressMenu(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleLikeMutation.mutate(item.id);
    showToast(
      item.is_liked
        ? (uiLang === 'bn' ? 'লাইক সরানো হয়েছে' : 'Unliked')
        : (uiLang === 'bn' ? 'লাইক দেওয়া হয়েছে ❤️' : 'Liked ❤️')
    );
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleSaveOffline(item);
    showToast(
      saved
        ? (uiLang === 'bn' ? 'অফলাইন থেকে সরান হয়েছে' : 'Removed from offline')
        : (uiLang === 'bn' ? 'অফলাইনে সংরক্ষিত হয়েছে 🔖' : 'Saved for offline reading 🔖')
    );
  };

  const handleCommentClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onComment(item);
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleDeleteConfirm = () => {
    deleteLiteratureMutation.mutate(item.id, {
      onSuccess: () => {
        showToast(uiLang === 'bn' ? 'লেখাটি স্থায়ীভাবে মুছে ফেলা হয়েছে' : 'Literature permanently deleted');
        setShowDeleteConfirm(false);
      },
    });
  };

  return (
    <>
      <article
        onClick={() => onRead(item)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className="p-5 sm:p-6 rounded-3xl border border-theme-main/50 bg-theme-card shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer space-y-3.5 group relative overflow-hidden select-none"
      >
        {/* Author Header & Badges */}
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onAuthorClick) onAuthorClick(item.authorId || item.author.id);
            }}
            className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 font-bold flex items-center justify-center text-xs border border-emerald-500/20 overflow-hidden shrink-0">
              {item.author?.avatarUrl ? (
                <img src={item.author.avatarUrl} alt={item.author.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                item.author?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <div>
              <h4 className={`text-xs font-bold leading-tight group-hover:text-emerald-500 transition-colors ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
                {item.author?.name || (uiLang === 'bn' ? 'অজ্ঞাত লেখক' : 'Unknown Author')}
              </h4>
              <p className="text-[10px] opacity-60 font-enUI">@{item.author?.username || 'writer'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-bnUI">
            {isRead && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold flex items-center space-x-0.5">
                <span>✓</span>
                <span>{uiLang === 'bn' ? 'পঠিত' : 'Read'}</span>
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
              {categoryLabelMap[item.category] || item.category}
            </span>
          </div>
        </div>

        {/* Literature Content Preview */}
        <div className="space-y-1.5">
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

        {/* Bottom Action Row */}
        <div className="pt-2 border-t border-theme-main/30 flex items-center justify-between text-xs opacity-80">
          <div className="flex items-center space-x-3 opacity-70 text-[11px] font-bnUI">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.readingTimeMin || 1} {t('readTime', uiLang)}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={toggleLikeMutation.isPending}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                item.is_liked
                  ? 'bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30'
                  : 'hover:bg-gray-500/10 opacity-70 hover:opacity-100'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  item.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span className="font-bnUI">{item.likesCount}</span>
            </button>

            {/* Comment */}
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium opacity-70 hover:opacity-100 hover:bg-gray-500/10 transition-colors font-bnUI"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>{item.commentsCount}</span>
            </button>

            {/* Save / Bookmark */}
            <button
              onClick={handleSave}
              className={`p-1.5 rounded-full transition-colors ${
                saved ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-60 hover:opacity-100 hover:bg-gray-500/10'
              }`}
              title={saved ? t('savedOffline', uiLang) : t('saveOffline', uiLang)}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full opacity-60 hover:opacity-100 hover:bg-gray-500/10 transition-colors"
              title={t('share', uiLang)}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Work (Author or Admin samir) */}
            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 rounded-full text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title={uiLang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Native Mobile Long-Press Context Action Sheet Drawer */}
      {showLongPressMenu && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowLongPressMenu(false)}
        >
          <div
            className="w-full max-w-sm bg-theme-card text-theme-main border-t sm:border border-theme-main rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-3 font-bnUI animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-theme-main pb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h4 className="text-sm font-bold truncate max-w-[200px]">{item.title}</h4>
              </div>
              <button onClick={() => setShowLongPressMenu(false)} className="p-1 text-xs opacity-60">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setShowLongPressMenu(false);
                  onRead(item);
                }}
                className="w-full p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center space-x-2.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{uiLang === 'bn' ? 'সম্পূর্ণ লেখাটি পড়ুন' : 'Read Full Story'}</span>
              </button>

              <button
                onClick={() => {
                  setShowLongPressMenu(false);
                  handleLike();
                }}
                className="w-full p-2.5 rounded-2xl hover:bg-gray-500/10 font-medium text-xs flex items-center space-x-2.5 transition-colors"
              >
                <Heart className={`w-4 h-4 ${item.is_liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{item.is_liked ? (uiLang === 'bn' ? 'লাইক তুলুন' : 'Unlike') : (uiLang === 'bn' ? 'লাইক দিন' : 'Like')} ({item.likesCount})</span>
              </button>

              <button
                onClick={() => {
                  setShowLongPressMenu(false);
                  handleCommentClick();
                }}
                className="w-full p-2.5 rounded-2xl hover:bg-gray-500/10 font-medium text-xs flex items-center space-x-2.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>{uiLang === 'bn' ? 'মন্তব্য দেখুন ও লিখুন' : 'View Comments'} ({item.commentsCount})</span>
              </button>

              <button
                onClick={() => {
                  setShowLongPressMenu(false);
                  handleSave();
                }}
                className="w-full p-2.5 rounded-2xl hover:bg-gray-500/10 font-medium text-xs flex items-center space-x-2.5 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                <span>{saved ? (uiLang === 'bn' ? 'অফলাইন থেকে সরান' : 'Remove Offline') : (uiLang === 'bn' ? 'অফলাইনে বুকমার্ক করুন' : 'Save Offline')}</span>
              </button>

              <button
                onClick={() => {
                  setShowLongPressMenu(false);
                  handleShare();
                }}
                className="w-full p-2.5 rounded-2xl hover:bg-gray-500/10 font-medium text-xs flex items-center space-x-2.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{uiLang === 'bn' ? 'লিঙ্ক শেয়ার করুন' : 'Share Story Link'}</span>
              </button>

              {canDelete && (
                <button
                  onClick={() => {
                    setShowLongPressMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-xs flex items-center space-x-2.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{uiLang === 'bn' ? 'লেখাটি মুছে ফেলুন' : 'Delete Work'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sleek Custom Confirm Modal for Literature Deletion */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={uiLang === 'bn' ? 'লেখা মুছে ফেলা' : 'Delete Work'}
        message={
          uiLang === 'bn'
            ? `আপনি কি নিশ্চিত যে '${item.title}' লেখাটি স্থায়ীভাবে মুছে ফেলতে চান?`
            : `Are you sure you want to permanently delete '${item.title}'?`
        }
        confirmText={uiLang === 'bn' ? 'লেখা মুছুন' : 'Delete Work'}
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
