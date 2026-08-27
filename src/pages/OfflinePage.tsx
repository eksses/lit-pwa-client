import React from 'react';
import { BookmarkCheck, Trash2, WifiOff, BookOpen, Clock } from 'lucide-react';
import { Literature } from '../types';
import { useReaderStore } from '../store/useReaderStore';

interface OfflinePageProps {
  onRead: (item: Literature) => void;
  onGoHome: () => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({ onRead, onGoHome }) => {
  const { savedItems, toggleSaveOffline } = useReaderStore();

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-bnUI">অফলাইন লাইব্রেরি (Saved Works)</h2>
            <p className="text-xs text-gray-500 font-bnUI">ইন্টারনেট ছাড়াই পড়ার জন্য সংরক্ষিত সাহিত্য</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold font-bnUI">
          {savedItems.length} টি
        </span>
      </div>

      {savedItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-theme-main bg-theme-card space-y-4">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="text-base font-bold font-bnUI">অফলাইন লাইব্রেরি খালি</h3>
            <p className="text-xs text-gray-500 font-bnUI max-w-xs mx-auto">
              যেকোনো সাহিত্য কার্ডের বুকমার্ক আইকনে ক্লিক করে অফলাইনে পড়ার জন্য সংরক্ষণ করুন।
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-medium font-bnUI shadow-sm"
          >
            সাহিত্য ব্রাউজ করুন
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
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium font-bnUI">
                    {item.category === 'poem' ? 'কবিতা' : item.category === 'story' ? 'গল্প' : 'অনুকবিতা'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveOffline(item);
                    }}
                    className="p-1.5 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-colors"
                    title="সরিয়ে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  className={`text-lg font-bold group-hover:text-emerald-600 transition-colors ${
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

                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 font-bnUI">
                  <span>লেখক: {item.author?.name || 'অজ্ঞাত লেখক'}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>{item.readingTimeMin || 1} মি. পাঠ</span>
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
