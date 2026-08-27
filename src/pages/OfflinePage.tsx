import React from 'react';
import { BookmarkCheck, Trash2, WifiOff, Clock } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface OfflinePageProps {
  onRead: (item: Literature) => void;
  onGoHome: () => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({ onRead, onGoHome }) => {
  const { savedItems, toggleSaveOffline } = useReaderStore();
  const { uiLang } = useLanguageStore();

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-bnUI">
              {uiLang === 'bn' ? 'অফলাইন লাইব্রেরি' : 'Offline Library'}
            </h2>
            <p className="text-xs opacity-70 font-bnUI">
              {t('offlineDesc', uiLang)}
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold font-bnUI whitespace-nowrap">
          {savedItems.length} {uiLang === 'bn' ? 'টি' : 'works'}
        </span>
      </div>

      {savedItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-theme-main bg-theme-card space-y-4">
          <WifiOff className="w-12 h-12 opacity-40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold font-bnUI">{t('noOfflineSaved', uiLang)}</h3>
            <p className="text-xs opacity-60 font-bnUI max-w-xs mx-auto">
              {t('offlineDesc', uiLang)}
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm"
          >
            {uiLang === 'bn' ? 'সাহিত্য ব্রাউজ করুন' : 'Browse Literature'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedItems.map((item) => {
            const isBengali = item.language === 'bn';
            return (
              <div
                key={item.id}
                onClick={() => onRead(item)}
                className="p-4 rounded-2xl border border-theme-main bg-theme-card hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium font-bnUI">
                    {item.category === 'poem' ? t('poems', uiLang) : item.category === 'story' ? t('stories', uiLang) : t('microPoetry', uiLang)}
                  </span>
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
                </div>

                <h3
                  className={`text-lg font-bold group-hover:text-emerald-500 transition-colors ${
                    isBengali ? 'font-bnSerif' : 'font-enSerif'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-xs line-clamp-2 opacity-80 ${
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
