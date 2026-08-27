import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sliders, Heart, MessageSquare, Bookmark, Share2, UserPlus, UserCheck, Eye, Clock, ChevronLeft, ChevronRight, ListOrdered, BookOpen, Trash2 } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { t } from '../utils/translations';
import { useToggleLike, useLiteratureList, useDeleteLiterature } from '../hooks/useLiterature';
import { useToggleFollow, useAuthorProfile } from '../hooks/useAuthors';
import { ReadingControls } from '../components/ReadingControls';
import { ConfirmModal } from '../components/ConfirmModal';

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
  const { user, isAuthenticated } = useAuthStore();
  const { fontSize, toggleSaveOffline, isSavedOffline, autoCacheItem } = useReaderStore();
  const { uiLang } = useLanguageStore();
  const { showToast } = useToastStore();

  const [showControls, setShowControls] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleLikeMutation = useToggleLike();
  const toggleFollowMutation = useToggleFollow();
  const deleteLiteratureMutation = useDeleteLiterature();

  const authorId = literature.authorId || literature.author?.id;
  const { data: authorProfile } = useAuthorProfile(authorId);

  const canDelete = user?.role === 'admin' || (user?.id && (user.id === authorId || user.id === literature.author?.id));

  // Fetch all literature by this author to build serial episode list
  const { data: authorWorks } = useLiteratureList({
    category: literature.category === 'serial_story' || literature.category === 'novel' ? literature.category : undefined,
  });

  const isBengali = literature.language === 'bn';
  const saved = isSavedOffline(literature.id);
  const isFollowing = authorProfile?.is_following ?? false;
  const isSerial = literature.category === 'serial_story' || literature.category === 'novel';

  // Automatically save item to local offline cache when opened
  useEffect(() => {
    autoCacheItem(literature);
  }, [literature, autoCacheItem]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter episodes belonging to the same serial or author
  const serialEpisodes = (authorWorks?.items || [])
    .filter((item) => item.category === literature.category)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const currentIndex = serialEpisodes.findIndex((e) => e.id === literature.id || e.slug === literature.slug);
  const previousEpisode = currentIndex > 0 ? serialEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < serialEpisodes.length - 1 ? serialEpisodes[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: literature.title,
        text: literature.content.slice(0, 100),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(uiLang === 'bn' ? 'লিঙ্ক কপি করা হয়েছে! 🔗' : 'Link copied to clipboard! 🔗');
    }
  };

  const handleDeleteConfirm = () => {
    deleteLiteratureMutation.mutate(literature.id, {
      onSuccess: () => {
        showToast(uiLang === 'bn' ? 'লেখাটি মুছে ফেলা হয়েছে' : 'Literature deleted');
        setShowDeleteConfirm(false);
        onBack();
      },
    });
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

          {/* Admin / Author Delete Work Button */}
          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-full text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title={uiLang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scroll Reading Progress Accent Bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Floating Reader Controls Panel */}
      {showControls && (
        <div className="sticky top-14 z-20 p-4 border-b border-theme-main bg-theme-card/95 backdrop-blur-md shadow-md animate-in slide-in-from-top-2 duration-200">
          <ReadingControls />
        </div>
      )}

      {/* Serial Episode Drawer */}
      {showEpisodeDrawer && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={() => setShowEpisodeDrawer(false)}
        >
          <div
            className="w-full max-w-xs bg-theme-card border-l border-theme-main h-full p-5 space-y-4 overflow-y-auto font-bnUI animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-theme-main pb-3">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>{uiLang === 'bn' ? 'ধারাবাহিক পর্বসূচি' : 'Episode Index'}</span>
              </h3>
              <button onClick={() => setShowEpisodeDrawer(false)} className="text-xs opacity-60">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {serialEpisodes.map((ep, idx) => {
                const isCurrent = ep.id === literature.id || ep.slug === literature.slug;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setShowEpisodeDrawer(false);
                      if (onNavigateToLiterature) onNavigateToLiterature(ep);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-500'
                        : 'border-theme-main/50 hover:bg-gray-500/10 opacity-80'
                    }`}
                  >
                    <span className="truncate max-w-[80%]">
                      {idx + 1}. {ep.title}
                    </span>
                    {isCurrent && <span className="text-[10px] uppercase font-mono">Current</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reading Document Main Viewport */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 pt-8 space-y-8">
        {/* Title & Metadata */}
        <div className="space-y-4 text-center border-b border-theme-main/40 pb-6">
          {/* Episode Progress Indicator for Serials */}
          {isSerial && currentIndex >= 0 && (
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold font-bnUI border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {uiLang === 'bn'
                  ? `পর্ব ${currentIndex + 1} / ${serialEpisodes.length}`
                  : `Part ${currentIndex + 1} of ${serialEpisodes.length}`}
              </span>
            </div>
          )}

          <h1
            className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight ${
              isBengali ? 'font-bnSerif' : 'font-enSerif'
            }`}
          >
            {literature.title}
          </h1>

          {/* Author Strip */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <div
              onClick={() => authorId && onAuthorClick && onAuthorClick(authorId)}
              className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 font-bold flex items-center justify-center text-sm border border-emerald-500/30 cursor-pointer overflow-hidden"
            >
              {literature.author?.avatarUrl ? (
                <img src={literature.author.avatarUrl} alt={literature.author.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                literature.author?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>

            <div className="text-left font-bnUI">
              <div
                onClick={() => authorId && onAuthorClick && onAuthorClick(authorId)}
                className="font-bold text-sm cursor-pointer hover:text-emerald-500 transition-colors"
              >
                {literature.author?.name}
              </div>
              <div className="text-[11px] opacity-60 flex items-center space-x-2 font-enUI">
                <span>@{literature.author?.username || 'writer'}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 font-bnUI">
                  <Clock className="w-3 h-3" />
                  <span>{literature.readingTimeMin || 1} {t('readTime', uiLang)}</span>
                </span>
              </div>
            </div>

            {/* Follow Author Button */}
            {authorId && (
              <button
                onClick={() => {
                  if (!isAuthenticated && onOpenAuth) {
                    onOpenAuth();
                  } else {
                    toggleFollowMutation.mutate(authorId);
                  }
                }}
                disabled={toggleFollowMutation.isPending}
                className={`px-3 py-1 rounded-full text-xs font-semibold font-bnUI transition-all ${
                  isFollowing
                    ? 'bg-gray-500/10 text-emerald-500 border border-emerald-500/30'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {isFollowing ? (uiLang === 'bn' ? 'অনুসরণ করছেন' : 'Following') : (uiLang === 'bn' ? 'অনুসরণ করুন' : 'Follow')}
              </button>
            )}
          </div>
        </div>

        {/* Literature Poem / Story Text Content */}
        <article
          className={`leading-relaxed tracking-normal text-theme-main whitespace-pre-wrap ${
            isBengali ? 'font-bnSerif' : 'font-enSerif'
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {literature.content}
        </article>

        {/* Serial Navigation Episode Cards */}
        {isSerial && (previousEpisode || nextEpisode) && (
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 font-bnUI border-t border-theme-main/40">
            {previousEpisode ? (
              <button
                onClick={() => onNavigateToLiterature && onNavigateToLiterature(previousEpisode)}
                className="p-4 rounded-3xl border border-theme-main/60 bg-theme-card hover:border-emerald-500/50 transition-all text-left space-y-1 group"
              >
                <span className="text-[11px] opacity-60 flex items-center space-x-1">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{uiLang === 'bn' ? 'পূর্ববর্তী পর্ব' : 'Previous Part'}</span>
                </span>
                <p className="text-xs font-bold truncate group-hover:text-emerald-500 transition-colors">
                  {previousEpisode.title}
                </p>
              </button>
            ) : (
              <div />
            )}

            {nextEpisode && (
              <button
                onClick={() => onNavigateToLiterature && onNavigateToLiterature(nextEpisode)}
                className="p-4 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-right space-y-1 group sm:col-start-2"
              >
                <span className="text-[11px] text-emerald-500 font-bold flex items-center justify-end space-x-1">
                  <span>{uiLang === 'bn' ? 'পরবর্তী পর্ব' : 'Next Part'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <p className="text-xs font-bold truncate text-emerald-500">
                  {nextEpisode.title}
                </p>
              </button>
            )}
          </div>
        )}

        {/* Bottom Social Engagement Bar */}
        <div className="pt-6 border-t border-theme-main/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleLikeMutation.mutate(literature.id)}
              disabled={toggleLikeMutation.isPending}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-bold transition-all ${
                literature.is_liked
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-500/10 hover:bg-gray-500/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${literature.is_liked ? 'fill-white' : ''}`} />
              <span className="font-bnUI">{literature.likesCount}</span>
            </button>

            <button
              onClick={() => onComment(literature)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20 font-bold transition-colors font-bnUI"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>{literature.commentsCount}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors"
            title={t('share', uiLang)}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Sleek Custom Confirm Modal for Literature Deletion */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={uiLang === 'bn' ? 'লেখা মুছে ফেলা' : 'Delete Work'}
        message={
          uiLang === 'bn'
            ? `আপনি কি নিশ্চিত যে '${literature.title}' লেখাটি স্থায়ীভাবে মুছে ফেলতে চান?`
            : `Are you sure you want to permanently delete '${literature.title}'?`
        }
        confirmText={uiLang === 'bn' ? 'লেখা মুছুন' : 'Delete Work'}
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
