import React, { useState } from 'react';
import { X, Feather, Sparkles } from 'lucide-react';
import { Category, Language } from '../types';
import { useCreateLiterature } from '../hooks/useLiterature';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';

interface CreateLiteratureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLiteratureModal: React.FC<CreateLiteratureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createLiteratureMutation = useCreateLiterature();
  const { uiLang } = useLanguageStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('poem');
  const [language, setLanguage] = useState<Language>('bn');
  const [readingTimeMin, setReadingTimeMin] = useState<number>(2);

  if (!isOpen) return null;

  // Auto estimate reading time based on word count
  const handleContentChange = (text: string) => {
    setContent(text);
    const words = text.trim().split(/\s+/).length;
    const estimated = Math.max(1, Math.ceil(words / 150));
    setReadingTimeMin(estimated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createLiteratureMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        category,
        language,
        readingTimeMin,
      },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-theme-card text-theme-main border border-theme-main rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-theme-main flex items-center justify-between bg-theme-main/50">
          <div className="flex items-center space-x-2">
            <Feather className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold font-bnUI text-theme-main">{t('publishHeader', uiLang)}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-500/20 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {createLiteratureMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bnUI">
              {uiLang === 'bn' ? 'লেখা প্রকাশ করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' : 'Failed to publish work. Please try again.'}
            </div>
          )}

          {/* Category & Language Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold opacity-75 mb-1 font-bnUI">
                {t('categoryLabel', uiLang)}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-theme-main bg-theme-main text-theme-main text-xs font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="poem" className="bg-theme-card text-theme-main">{t('poems', uiLang)}</option>
                <option value="story" className="bg-theme-card text-theme-main">{t('stories', uiLang)}</option>
                <option value="micro_poem" className="bg-theme-card text-theme-main">{t('microPoetry', uiLang)}</option>
                <option value="prose_poetry" className="bg-theme-card text-theme-main">{t('prosePoetry', uiLang)}</option>
                <option value="novel" className="bg-theme-card text-theme-main">{t('novel', uiLang)}</option>
                <option value="serial_story" className="bg-theme-card text-theme-main">{t('serialStory', uiLang)}</option>
                <option value="long_story" className="bg-theme-card text-theme-main">{t('longStory', uiLang)}</option>
                <option value="collection" className="bg-theme-card text-theme-main">{t('collection', uiLang)}</option>
                <option value="uncategorized" className="bg-theme-card text-theme-main">{t('uncategorized', uiLang)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold opacity-75 mb-1 font-bnUI">
                {t('languageLabel', uiLang)}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl border border-theme-main bg-theme-main text-theme-main text-xs font-bnUI focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="bn" className="bg-theme-card text-theme-main">বাংলা (Bangla)</option>
                <option value="en" className="bg-theme-card text-theme-main">English</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold opacity-75 mb-1 font-bnUI">
              {t('titleLabel', uiLang)}
            </label>
            <input
              type="text"
              required
              placeholder={language === 'bn' ? 'আপনার রচনার শিরোনাম লিখুন...' : 'Enter literature title...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border border-theme-main bg-theme-main text-theme-main text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                language === 'bn' ? 'font-bnSerif' : 'font-enSerif'
              }`}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold opacity-75 font-bnUI">
                {t('contentLabel', uiLang)}
              </label>
              <span className="text-[11px] opacity-60 font-bnUI">
                {readingTimeMin} {t('readTime', uiLang)}
              </span>
            </div>
            <textarea
              required
              rows={8}
              placeholder={
                language === 'bn'
                  ? 'আপনার কবিতা বা গল্পের পর্বগুলো লিখুন...'
                  : 'Write your literature lines here...'
              }
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-xl border border-theme-main bg-theme-main text-theme-main text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                language === 'bn' ? 'font-bnSerif' : 'font-enSerif'
              }`}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-theme-main flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 font-bnUI transition-opacity"
            >
              {uiLang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || createLiteratureMutation.isPending}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-md hover:bg-emerald-600 disabled:opacity-50 transition-all font-bnUI"
            >
              <Sparkles className="w-4 h-4" />
              <span>{createLiteratureMutation.isPending ? t('publishing', uiLang) : t('publishButton', uiLang)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
