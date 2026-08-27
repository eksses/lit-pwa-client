import React, { useState } from 'react';
import { BookmarkCheck, Trash2, Clock, History, Bookmark, Heart } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface OfflinePageProps {
  onRead: (item: Literature) => void;
  onGoHome: () => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({ onRead, onGoHome }) => {
  const { savedItems, readHistoryItems, toggleSaveOffline, clearHistory } = useReaderStore();
  const { uiLang } = useLanguageStore();

  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'history'>('bookmarks');

  const currentList = activeSubTab === 'bookmarks' ? savedItems : readHistoryItems;

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-4 pt-3">
      {/* Editorial Header Banner */}
      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-bnUI">
              {uiLang === 'bn' ? 'অফলাইন লাইব্রেরি' : 'Offline Library'}
            </h2>
            <p className="text-xs opacity-70 font-bnUI">
              {uiLang === 'bn' ? 'ইন্টারনেট ছাড়াই কবিতা ও গল্প পাঠ করুন' : 'Read poems & stories without internet'}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Bookmarks vs Reading History */}
      <div className="flex items-center justify-between border-b border-theme-main/40 pb-3">
        <div className="flex items-center space-x-1.5 text-xs font-bnUI">
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'bookmarks'
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'বুকমার্ক' : 'Bookmarks'} ({savedItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'history'
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{uiLang === 'bn' ? 'পঠিত ইতিহাস' : 'History'} ({readHistoryItems.length})</span>
          </button>
        </div>

        {activeSubTab === 'history' && readHistoryItems.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[11px] text-rose-400 hover:text-rose-500 font-bnUI opacity-80 hover:opacity-100 transition-opacity"
          >
            {uiLang === 'bn' ? 'ইতিহাস মুছুন' : 'Clear History'}
          </button>
        )}
      </div>

      {/* Rule #14: Designed Empty State */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-theme-main/40 bg-theme-card space-y-4">
          <Heart className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold font-bnUI">
              {activeSubTab === 'bookmarks'
                ? (uiLang === 'bn' ? 'এখনো কোনো কবিতা বুকমার্ক করেননি' : 'Nothing saved yet')
                : (uiLang === 'bn' ? 'কোনো পঠিত ইতিহাস নেই' : 'No Reading History')}
            </h3>
            <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto leading-relaxed">
              {activeSubTab === 'bookmarks'
                ? (uiLang === 'bn' ? 'যখন কোনো কবিতা আপনাকে ছুঁয়ে যাবে, তখন এখানে সংরক্ষণ করুন।' : 'When a poem speaks to you, save it here.')
                : (uiLang === 'bn' ? 'আপনার পঠিত কবিতাগুলো এখানে স্বয়ংক্রিয়ভাবে থাকবে।' : 'Poems you read will automatically appear here.')}
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold font-bnUI shadow-sm hover:bg-emerald-600 transition-colors"
          >
            {uiLang === 'bn' ? 'কবিতা খুঁজুন' : 'Explore poems'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((item) => {
            const isBengali = item.language === 'bn';
            return (
              <div
                key={item.id}
                onClick={() => onRead(item)}
                className="p-5 rounded-2xl border border-theme-main/40 bg-theme-card hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold font-bnUI">
                    {item.category === 'poem' ? t('poems', uiLang) : item.category === 'story' ? t('stories', uiLang) : t('microPoetry', uiLang)}
                  </span>

                  {activeSubTab === 'bookmarks' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveOffline(item);
                      }}
                      className="p-1.5 rounded-full hover:bg-rose-500/10 opacity-60 hover:opacity-100 transition-colors"
                      title={uiLang === 'bn' ? 'সরিয়ে ফেলুন' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  )}
                </div>

                <h3
                  className={`text-lg font-bold group-hover:text-emerald-500 transition-colors ${
                    isBengali ? 'font-bnSerif' : 'font-enSerif'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-xs line-clamp-2 opacity-80 leading-relaxed ${
                    isBengali ? 'font-bnSerif' : 'font-enSerif'
                  }`}
                >
                  {item.content}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] opacity-60 font-bnUI">
                  <span>{uiLang === 'bn' ? 'লেখক:' : 'Author:'} {item.author?.name || 'Author'}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>{item.readingTimeMin || 1} {t('readTime', uiLang)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
