import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sliders, Heart, MessageSquare, Bookmark, Share2, UserPlus, UserCheck, Eye, Clock, ChevronLeft, ChevronRight, ListOrdered, BookOpen } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { useToggleLike, useLiteratureList } from '../hooks/useLiterature';
import { useToggleFollow, useAuthorProfile } from '../hooks/useAuthors';
import { ReadingControls } from '../components/ReadingControls';

interface ReadingPageProps {
  literature: Literature;
  onBack: () => void;
  onComment: (item: Literature) => void;
  onAuthorClick?: (authorId: string) => void;
  onOpenAuth?: () => void;
  onNavigateToLiterature?: (item: Literature) => void;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({
  literature,
  onBack,
  onComment,
  onAuthorClick,
  onOpenAuth,
  onNavigateToLiterature,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { fontSize, toggleSaveOffline, isSavedOffline, autoCacheItem, hasRead } = useReaderStore();
  const { uiLang } = useLanguageStore();
  const [showControls, setShowControls] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleLikeMutation = useToggleLike();
  const toggleFollowMutation = useToggleFollow();

  const authorId = literature.authorId || literature.author?.id;
  const { data: authorProfile } = useAuthorProfile(authorId);

  // Fetch all literature by this author to build serial episode list
  const { data: authorWorks } = useLiteratureList({
    category: literature.category === 'serial_story' || literature.category === 'novel' ? literature.category : undefined,
  });

  const isBengali = literature.language === 'bn';
  const saved = isSavedOffline(literature.id);
  const isFollowing = authorProfile?.is_following ?? false;
  const isSerial = literature.category === 'serial_story' || literature.category === 'novel';

  // Find all parts/episodes by same author in chronological order
  const serialEpisodes = (authorWorks?.items || [])
    .filter((item) => item.authorId === authorId || item.author?.id === authorId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const currentIndex = serialEpisodes.findIndex((item) => item.id === literature.id);
  const prevEpisode = currentIndex > 0 ? serialEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < serialEpisodes.length - 1 ? serialEpisodes[currentIndex + 1] : null;

  useEffect(() => {
    // Auto cache current item into history
    autoCacheItem(literature);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [literature]);

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
      <header className="sticky top-0 z-30 bg-theme-main/90 backdrop-blur-md border-b border-theme-main px-4 py-3 flex items-center justify-between pt-safe px-safe">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 p-1.5 rounded-full hover:bg-gray-500/10 transition-colors"
          title={uiLang === 'bn' ? 'ফিরে যান' : 'Back'}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bnUI">{uiLang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Episode List Drawer Toggle for Serialized Works */}
          {isSerial && serialEpisodes.length > 1 && (
            <button
              onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-semibold font-bnUI border border-emerald-500/30"
              title={uiLang === 'bn' ? 'পর্বসূচি' : 'Episodes'}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>{uiLang === 'bn' ? 'পর্বসমূহ' : 'Parts'}</span>
            </button>
          )}

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

        {/* Scroll Reading Progress Accent Bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Floating Reader Controls Panel */}
      {showControls && (
        <div className="sticky top-14 z-20 px-4 py-2 bg-theme-main/95 backdrop-blur-sm border-b border-theme-main animate-in slide-in-from-top duration-200">
          <ReadingControls />
        </div>
      )}

      {/* Serial Episode Index Drawer Drawer */}
      {showEpisodeDrawer && (
        <div className="sticky top-14 z-20 p-4 bg-theme-card border-b border-theme-main animate-in slide-in-from-top duration-200 max-w-2xl mx-auto rounded-b-3xl shadow-xl space-y-2 font-bnUI">
          <div className="flex items-center justify-between border-b border-theme-main pb-2">
            <h4 className="text-xs font-bold text-emerald-500 flex items-center space-x-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{uiLang === 'bn' ? 'ধারাবাহিক পর্ব সূচিপত্র' : 'Serial Episode Index'}</span>
            </h4>
            <button onClick={() => setShowEpisodeDrawer(false)} className="text-xs opacity-60">✕</button>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
            {serialEpisodes.map((ep, idx) => {
              const isCurrent = ep.id === literature.id;
              const read = hasRead(ep.id);
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setShowEpisodeDrawer(false);
                    if (onNavigateToLiterature) onNavigateToLiterature(ep);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'hover:bg-gray-500/10 opacity-80'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="opacity-70 font-enUI">#{idx + 1}</span>
                    <span className="truncate">{ep.title}</span>
                  </div>
                  {read && !isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">
                      ✓ {uiLang === 'bn' ? 'পঠিত' : 'Read'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reader Body Container */}
      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* Author Header Bar */}
        <div className="flex items-center justify-between p-4 rounded-3xl border border-theme-main bg-theme-card">
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
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-bnUI inline-block">
              {literature.category === 'poem'
                ? t('poems', uiLang)
                : literature.category === 'story'
                ? t('stories', uiLang)
                : literature.category === 'serial_story'
                ? t('serialStory', uiLang)
                : literature.category === 'novel'
                ? t('novel', uiLang)
                : literature.category === 'long_story'
                ? t('longStory', uiLang)
                : literature.category === 'collection'
                ? t('collection', uiLang)
                : t('microPoetry', uiLang)}
            </span>
            {currentIndex >= 0 && serialEpisodes.length > 1 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold font-bnUI inline-block">
                {uiLang === 'bn' ? `পর্ব ${currentIndex + 1} / ${serialEpisodes.length}` : `Part ${currentIndex + 1} of ${serialEpisodes.length}`}
              </span>
            )}
          </div>

          <h1
            className={`text-3xl sm:text-4xl font-bold leading-tight ${
              isBengali ? 'font-bnSerif' : 'font-enSerif'
            }`}
          >
            {literature.title}
          </h1>

          <div className="flex items-center justify-center space-x-4 text-xs opacity-75 pt-1 font-bnUI">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{literature.readingTimeMin || 1} {t('readTime', uiLang)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
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

        {/* Serial Story Next/Previous Episode Navigation Cards */}
        {isSerial && (prevEpisode || nextEpisode) && (
          <div className="pt-6 border-t border-theme-main/50 space-y-3 font-bnUI">
            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider text-center">
              {uiLang === 'bn' ? '— ধারাবাহিক পর্ব পরিচালনা —' : '— Serial Navigation —'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prevEpisode ? (
                <button
                  onClick={() => onNavigateToLiterature && onNavigateToLiterature(prevEpisode)}
                  className="p-3.5 rounded-2xl border border-theme-main bg-theme-card hover:border-emerald-500/50 transition-all text-left space-y-1 group"
                >
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center space-x-1">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{uiLang === 'bn' ? 'পূর্ববর্তী পর্ব' : 'Previous Part'}</span>
                  </span>
                  <p className="text-xs font-bold truncate group-hover:text-emerald-500 transition-colors">
                    {prevEpisode.title}
                  </p>
                </button>
              ) : (
                <div />
              )}

              {nextEpisode && (
                <button
                  onClick={() => onNavigateToLiterature && onNavigateToLiterature(nextEpisode)}
                  className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-right space-y-1 group"
                >
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center justify-end space-x-1">
                    <span>{uiLang === 'bn' ? 'পরবর্তী পর্ব' : 'Next Part'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs font-bold truncate group-hover:text-emerald-500 transition-colors">
                    {nextEpisode.title}
                  </p>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Reader Bottom Fixed Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-theme-main/95 backdrop-blur-md border-t border-theme-main py-2.5 px-4 shadow-lg pb-safe px-safe">
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
