import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User as UserIcon } from 'lucide-react';
import { Literature } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { useAddComment } from '../hooks/useLiterature';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  literature: Literature | null;
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, literature }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { uiLang } = useLanguageStore();
  const addCommentMutation = useAddComment();

  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState(() => {
    return localStorage.getItem('lit_pwa_guest_nickname') || '';
  });

  useEffect(() => {
    if (guestName) {
      localStorage.setItem('lit_pwa_guest_nickname', guestName);
    }
  }, [guestName]);

  if (!isOpen || !literature) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

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

  const isBengali = literature.language === 'bn';
  const commentsList = literature.comments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-theme-card border-t sm:border border-theme-main rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-theme-main flex items-center justify-between bg-theme-main/50">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold font-bnUI">
              {t('commentsHeader', uiLang)} ({commentsList.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-500/20 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Literature Context Summary */}
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-theme-main/40 flex items-center justify-between text-xs opacity-90">
          <span className="font-semibold truncate max-w-[70%] font-bnUI">
            "{literature.title}"
          </span>
          <span className="opacity-70 font-bnUI">{literature.author?.name}</span>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-theme-main/40">
          {commentsList.length === 0 ? (
            <div className="py-8 text-center opacity-60 space-y-1">
              <MessageSquare className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm font-bnUI">{t('noCommentsYet', uiLang)}</p>
            </div>
          ) : (
            commentsList.map((comment) => {
              const commentatorName = comment.user?.name || comment.guestName || t('guestBadge', uiLang);
              return (
                <div key={comment.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 font-semibold text-emerald-500">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span className="font-bnUI">{commentatorName}</span>
                      {!comment.user && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-500/10 opacity-70">
                          {uiLang === 'bn' ? 'গেস্ট' : 'Guest'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-60 font-enUI">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm opacity-90 leading-relaxed ${isBengali ? 'font-bnUI' : 'font-enUI'}`}>
                    {comment.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Post Comment Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-theme-main bg-theme-main/50 space-y-2">
          {!isAuthenticated && (
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-70 shrink-0 font-bnUI">{t('guestNameLabel', uiLang)}:</span>
              <input
                type="text"
                placeholder={uiLang === 'bn' ? 'আপনার নাম বা ডাকনাম...' : 'Your display name...'}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-main bg-theme-main text-xs font-bnUI focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={t('commentPlaceholder', uiLang)}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-theme-main bg-theme-main text-sm font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!content.trim() || addCommentMutation.isPending}
              className="p-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 transition-colors shadow-sm shrink-0"
              title={t('postComment', uiLang)}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
