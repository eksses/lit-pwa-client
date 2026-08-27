import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User as UserIcon, Trash2, Sparkles, Feather } from 'lucide-react';
import { Literature } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { t } from '../utils/translations';
import { useAddComment, useDeleteComment, useComments } from '../hooks/useLiterature';
import { ConfirmModal } from './ConfirmModal';
import { playCommentSound } from '../utils/audio';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  literature: Literature | null;
}

function formatRelativeTime(dateInput: string | Date, lang: 'bn' | 'en'): string {
  const now = new Date();
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return lang === 'bn' ? 'এখনই' : 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return lang === 'bn' ? `${diffMin} মিনিট আগে` : `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return lang === 'bn' ? `${diffHour} ঘণ্টা আগে` : `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 7) return lang === 'bn' ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, literature }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { uiLang } = useLanguageStore();
  const { showToast } = useToastStore();

  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState(() => {
    return localStorage.getItem('lit_pwa_guest_nickname') || '';
  });

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const targetId = literature?.id || '';
  const { data: fetchedComments, isLoading: isCommentsLoading } = useComments(isOpen ? targetId : '');

  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();

  useEffect(() => {
    if (guestName) {
      localStorage.setItem('lit_pwa_guest_nickname', guestName);
    }
  }, [guestName]);

  if (!isOpen || !literature) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    playCommentSound();

    addCommentMutation.mutate(
      {
        literatureId: literature.id,
        content: content.trim(),
        guestName: !isAuthenticated ? (guestName.trim() || (uiLang === 'bn' ? 'পাঠক (Guest)' : 'Guest Reader')) : undefined,
      },
      {
        onSuccess: () => {
          setContent('');
        },
      }
    );
  };

  const handleDeleteCommentConfirm = () => {
    if (!deletingCommentId) return;
    deleteCommentMutation.mutate(deletingCommentId, {
      onSuccess: () => {
        showToast(uiLang === 'bn' ? 'মন্তব্যটি মুছে ফেলা হয়েছে' : 'Comment deleted');
        setDeletingCommentId(null);
      },
    });
  };

  const isBengali = literature.language === 'bn';
  const commentsList = fetchedComments || literature.comments || [];
  const postAuthorId = literature.authorId || literature.author?.id;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
        <div
          className="w-full max-w-lg bg-theme-card text-theme-main border-t sm:border border-theme-main rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[75vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-theme-main/60 flex items-center justify-between bg-theme-main/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-bnUI flex items-center space-x-1.5">
                  <span>{t('commentsHeader', uiLang)}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-500 text-xs">
                    {commentsList.length}
                  </span>
                </h3>
                <p className="text-[11px] opacity-60 font-bnUI truncate max-w-[220px] sm:max-w-xs">
                  "{literature.title}"
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-500/20 opacity-70 hover:opacity-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List (Chat Stream Style) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-500/5">
            {isCommentsLoading ? (
              <div className="py-12 text-center opacity-60 space-y-2 font-bnUI">
                <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">{uiLang === 'bn' ? 'মন্তব্য লোড হচ্ছে...' : 'Loading comments...'}</p>
              </div>
            ) : commentsList.length === 0 ? (
              <div className="py-12 text-center opacity-70 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Feather className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold font-bnUI">{t('noCommentsYet', uiLang)}</p>
                <p className="text-xs opacity-60 font-bnUI">
                  {uiLang === 'bn' ? 'প্রথম মন্তব্যটি আপনিই প্রকাশ করুন!' : 'Be the first to share your thoughts!'}
                </p>
              </div>
            ) : (
              commentsList.map((comment) => {
                const commentatorName = comment.user?.name || comment.guestName || t('guestBadge', uiLang);
                const isRegisteredUser = Boolean(comment.user);
                const isPostAuthorComment = isRegisteredUser && comment.user?.id === postAuthorId;
                const canDeleteComment =
                  user?.role === 'admin' ||
                  (user?.id && (user.id === postAuthorId || (comment.user && user.id === comment.user.id)));

                return (
                  <div key={comment.id} className="flex space-x-2.5 items-start group animate-in fade-in duration-150">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 font-bold flex items-center justify-center text-xs border border-emerald-500/20 overflow-hidden shrink-0 mt-0.5">
                      {comment.user?.avatarUrl ? (
                        <img src={comment.user.avatarUrl} alt={commentatorName} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        commentatorName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-bnUI">
                          <span className="font-bold text-emerald-500">{commentatorName}</span>
                          {isPostAuthorComment && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                              {uiLang === 'bn' ? 'লেখক' : 'Author'}
                            </span>
                          )}
                          {!isRegisteredUser && (
                            <span className="px-1.5 py-0.2 rounded-full bg-gray-500/10 text-xs opacity-60 text-[10px]">
                              {uiLang === 'bn' ? 'গেস্ট' : 'Guest'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] opacity-60">
                          <span className="font-bnUI">{formatRelativeTime(comment.createdAt, uiLang)}</span>
                          {canDeleteComment && (
                            <button
                              onClick={() => setDeletingCommentId(comment.id)}
                              className="text-rose-400 hover:text-rose-500 transition-colors p-0.5 opacity-80 hover:opacity-100"
                              title={uiLang === 'bn' ? 'মন্তব্য মুছুন' : 'Delete Comment'}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-theme-main border border-theme-main/50 shadow-sm space-y-1">
                        <p className={`text-sm opacity-90 leading-relaxed ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Post Comment Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-theme-main bg-theme-card space-y-2.5">
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <span className="text-xs opacity-70 shrink-0 font-bnUI">{t('guestNameLabel', uiLang)}:</span>
                <input
                  type="text"
                  placeholder={uiLang === 'bn' ? 'আপনার নাম বা ডাকনাম...' : 'Your display name...'}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-theme-main bg-theme-main text-theme-main text-xs font-bnUI focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={t('commentPlaceholder', uiLang)}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-2xl border border-theme-main bg-theme-main text-theme-main text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner"
              />
              <button
                type="submit"
                disabled={!content.trim() || addCommentMutation.isPending}
                className="p-3 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 transition-all shadow-md shrink-0 active:scale-95"
                title={t('postComment', uiLang)}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sleek Custom Confirm Modal for Comment Deletion */}
      <ConfirmModal
        isOpen={Boolean(deletingCommentId)}
        title={uiLang === 'bn' ? 'মন্তব্য মুছে ফেলা' : 'Delete Comment'}
        message={uiLang === 'bn' ? 'আপনি কি নিশ্চিত যে এই মন্তব্যটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this comment?'}
        confirmText={uiLang === 'bn' ? 'মন্তব্য মুছুন' : 'Delete Comment'}
        onConfirm={handleDeleteCommentConfirm}
        onClose={() => setDeletingCommentId(null)}
      />
    </>
  );
};
