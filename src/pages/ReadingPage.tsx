import React, { useState } from 'react';
import { ArrowLeft, Sliders, Heart, MessageSquare, Bookmark, Share2, UserPlus, UserCheck, Eye, Clock } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { useToggleLike } from '../hooks/useLiterature';
import { useToggleFollow, useAuthorProfile } from '../hooks/useAuthors';
import { ReadingControls } from '../components/ReadingControls';

interface ReadingPageProps {
  literature: Literature;
  onBack: () => void;
  onComment: (item: Literature) => void;
  onAuthorClick?: (authorId: string) => void;
  onOpenAuth?: () => void;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({
  literature,
  onBack,
  onComment,
  onAuthorClick,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { fontSize, toggleSaveOffline, isSavedOffline } = useReaderStore();
  const { uiLang } = useLanguageStore();
  const [showControls, setShowControls] = useState(false);

  const toggleLikeMutation = useToggleLike();
  const toggleFollowMutation = useToggleFollow();

  const authorId = literature.authorId || literature.author?.id;
  const { data: authorProfile } = useAuthorProfile(authorId);

  const isBengali = literature.language === 'bn';
  const saved = isSavedOffline(literature.id);
  const isFollowing = authorProfile?.is_following ?? false;

  const handleLike = () => {
    toggleLikeMutation.mutate(literature.id);
  };

  const handleFollow = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (authorId) {
      toggleFollowMutation.mutate(authorId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: literature.title,
        text: literature.content.slice(0, 100),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(uiLang === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-theme-main text-theme-main transition-colors duration-200 pb-24">
      {/* Sticky Reader Header Navigation */}
      <header className="sticky top-0 z-30 bg-theme-main/90 backdrop-blur-md border-b border-theme-main px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 p-1.5 rounded-full hover:bg-gray-500/10 transition-colors"
          title={uiLang === 'bn' ? 'ফিরে যান' : 'Back'}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bnUI">{uiLang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Toggle Offline Save */}
          <button
            onClick={() => toggleSaveOffline(literature)}
            className={`p-2 rounded-full transition-colors ${
              saved ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-70 hover:opacity-100'
            }`}
            title={saved ? t('savedOffline', uiLang) : t('saveOffline', uiLang)}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-emerald-500' : ''}`} />
          </button>

          {/* Reading Controls Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full transition-colors ${
              showControls ? 'bg-emerald-500 text-white' : 'bg-gray-500/10 opacity-70 hover:opacity-100'
            }`}
            title={t('readerSettings', uiLang)}
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Floating Reader Controls Panel */}
      {showControls && (
        <div className="sticky top-14 z-20 px-4 py-2 bg-theme-main/95 backdrop-blur-sm border-b border-theme-main animate-in slide-in-from-top duration-200">
          <ReadingControls />
        </div>
      )}

      {/* Reader Body Container */}
      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* Author Header Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-theme-main bg-theme-card">
          <div
            onClick={() => onAuthorClick && authorId && onAuthorClick(authorId)}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-base border border-emerald-500/30 overflow-hidden">
              {literature.author?.avatarUrl ? (
                <img src={literature.author.avatarUrl} alt={literature.author.name} className="w-full h-full object-cover" />
              ) : (
                literature.author?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <div>
              <h3 className={`text-base font-semibold ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
                {literature.author?.name || 'Author'}
              </h3>
              <p className="text-xs opacity-60 font-enUI">@{literature.author?.username || 'author'}</p>
            </div>
          </div>

          <button
            onClick={handleFollow}
            disabled={toggleFollowMutation.isPending}
            className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold font-bnUI transition-all shadow-sm ${
              isFollowing
                ? 'bg-gray-500/10 text-emerald-500 border border-emerald-500/30'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('following', uiLang)}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('follow', uiLang)}</span>
              </>
            )}
          </button>
        </div>

        {/* Literature Title & Meta */}
        <div className="space-y-2 text-center pt-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-bnUI inline-block">
            {literature.category === 'poem' ? t('poems', uiLang) : literature.category === 'story' ? t('stories', uiLang) : t('microPoetry', uiLang)}
          </span>
          <h1
            className={`text-3xl sm:text-4xl font-bold leading-tight ${
              isBengali ? 'font-bnSerif' : 'font-enSerif'
            }`}
          >
            {literature.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-xs opacity-75 pt-1 font-bnUI">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{literature.readingTimeMin || 1} {t('readTime', uiLang)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{literature.viewsCount} {t('views', uiLang)}</span>
            </span>
          </div>
        </div>

        {/* Literature Main Text Content */}
        <article
          style={{ fontSize: `${fontSize}px` }}
          className={`py-8 px-2 sm:px-6 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500 selection:text-white transition-all ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
        >
          {literature.content}
        </article>
      </main>

      {/* Reader Bottom Fixed Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-theme-main/95 backdrop-blur-md border-t border-theme-main py-2.5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              literature.is_liked
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : 'bg-gray-500/10 hover:bg-gray-500/20'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                literature.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
            <span className="font-bnUI">{literature.likesCount} {t('like', uiLang)}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onComment(literature)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gray-500/10 hover:bg-gray-500/20 font-bnUI"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>{literature.commentsCount} {t('comment', uiLang)}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20 opacity-70 hover:opacity-100 transition-colors"
            title={t('share', uiLang)}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
