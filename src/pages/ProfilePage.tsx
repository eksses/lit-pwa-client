import React, { useState } from 'react';
import { User as UserIcon, LogOut, PlusCircle, Feather, Users, BookOpen, UserPlus, UserCheck, PenTool, Sparkles } from 'lucide-react';
import { Literature } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../utils/translations';
import { useAuthorProfile, useToggleFollow } from '../hooks/useAuthors';
import { useLiteratureList } from '../hooks/useLiterature';
import { LiteratureCard } from '../components/LiteratureCard';
import api from '../utils/api';

interface ProfilePageProps {
  authorId?: string | null;
  onRead: (item: Literature) => void;
  onComment: (item: Literature) => void;
  onOpenAuth: () => void;
  onOpenCreate: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  authorId,
  onRead,
  onComment,
  onOpenAuth,
  onOpenCreate,
}) => {
  const { user: currentUser, isAuthenticated, logout, setUser } = useAuthStore();
  const { uiLang } = useLanguageStore();
  const toggleFollowMutation = useToggleFollow();

  const [isUpgrading, setIsUpgrading] = useState(false);

  const targetAuthorId = authorId || currentUser?.id;
  const isSelf = Boolean(currentUser && currentUser.id === targetAuthorId);

  const { data: authorProfile, isLoading: isProfileLoading } = useAuthorProfile(targetAuthorId || '');
  const { data: authorWorks, isLoading: isWorksLoading } = useLiteratureList({
    author_id: targetAuthorId || undefined,
  });

  const handleBecomeWriter = async () => {
    setIsUpgrading(true);
    try {
      const res = await api.put('/auth/role', { role: 'writer' });
      if (res.data?.user && currentUser) {
        setUser({ ...currentUser, role: 'writer' });
      }
    } catch (err) {
      console.error('Failed to upgrade role:', err);
    } finally {
      setIsUpgrading(false);
    }
  };

  // If unauthenticated and not viewing specific author
  if (!isAuthenticated && !authorId) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
          <UserIcon className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-bnUI">
            {uiLang === 'bn' ? 'লেখক প্রোফাইল ও সদস্য অঞ্চল' : 'Writer & Member Portal'}
          </h2>
          <p className="text-xs opacity-70 font-bnUI leading-relaxed">
            {uiLang === 'bn'
              ? 'আপনার নিজস্ব কবিতা ও সাহিত্য প্রকাশ করতে, অনুসরণকারীদের পরিচালনা করতে এবং প্রোফাইল সাজাতে লগইন করুন।'
              : 'Sign in to publish your poems & stories, manage followers, and customize your literary profile.'}
          </p>
        </div>

        <button
          onClick={onOpenAuth}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-sm shadow-md hover:bg-emerald-600 transition-all font-bnUI"
        >
          {t('login', uiLang)} / {t('register', uiLang)}
        </button>
      </div>
    );
  }

  const profile = isSelf
    ? {
        id: currentUser?.id,
        name: currentUser?.name || (uiLang === 'bn' ? 'কবি' : 'Writer'),
        username: currentUser?.username || 'writer',
        role: currentUser?.role || 'reader',
        avatarUrl: currentUser?.avatarUrl,
        bio: currentUser?.bio || (uiLang === 'bn' ? 'কাব্য ও কথার একজন সাহিত্য অনুরাগী পাঠক।' : 'Enthusiastic reader of poetry and literature.'),
        worksCount: authorProfile?.worksCount ?? (authorWorks?.items.length || 0),
        followersCount: authorProfile?.followersCount ?? 0,
        followingCount: authorProfile?.followingCount ?? 0,
        is_following: false,
      }
    : authorProfile;

  const isWriter = profile?.role === 'writer' || profile?.role === 'author' || (authorWorks && authorWorks.items.length > 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl border border-theme-main bg-theme-card shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-2xl border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-md">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile?.name?.charAt(0).toUpperCase() || 'A'
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h2 className="text-xl font-bold font-bnUI tracking-tight">{profile?.name}</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isWriter
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-gray-500/10 opacity-70'
                  }`}>
                    {isWriter ? t('roleWriter', uiLang) : t('roleReader', uiLang)}
                  </span>
                </div>
                <p className="text-xs opacity-60 font-enUI">@{profile?.username}</p>
              </div>

              {isSelf ? (
                <button
                  onClick={logout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-rose-500/30 text-rose-500 text-xs font-medium font-bnUI hover:bg-rose-500/10 transition-colors self-center sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout', uiLang)}</span>
                </button>
              ) : (
                profile && (
                  <button
                    onClick={() => profile?.id && toggleFollowMutation.mutate(profile.id)}
                    disabled={toggleFollowMutation.isPending}
                    className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold font-bnUI transition-all shadow-sm ${
                      profile.is_following
                        ? 'bg-gray-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {profile.is_following ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{t('following', uiLang)}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{t('follow', uiLang)}</span>
                      </>
                    )}
                  </button>
                )
              )}
            </div>

            <p className="text-xs opacity-80 font-bnUI leading-relaxed pt-1">
              {profile?.bio || (uiLang === 'bn' ? 'কোনো বায়ো উপলব্ধ নেই।' : 'No bio available.')}
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-theme-main/60 text-center font-bnUI">
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.worksCount ?? 0}
            </span>
            <span className="text-[11px] opacity-70">{uiLang === 'bn' ? 'প্রকাশিত রচনা' : 'Works'}</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.followersCount ?? 0}
            </span>
            <span className="text-[11px] opacity-70">{uiLang === 'bn' ? 'অনুসরণকারী' : 'Followers'}</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.followingCount ?? 0}
            </span>
            <span className="text-[11px] opacity-70">{uiLang === 'bn' ? 'অনুসরণ করছেন' : 'Following'}</span>
          </div>
        </div>

        {/* Upgrade / Write Action Card */}
        {isSelf && (
          <div className="pt-2">
            {!isWriter ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-emerald-500 flex items-center space-x-1 font-bnUI">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('becomeWriter', uiLang)}</span>
                  </h4>
                  <p className="text-[11px] opacity-80 font-bnUI">
                    {t('becomeWriterDesc', uiLang)}
                  </p>
                </div>
                <button
                  onClick={handleBecomeWriter}
                  disabled={isUpgrading}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors whitespace-nowrap"
                >
                  {isUpgrading ? '...' : (uiLang === 'bn' ? 'লেখক হন' : 'Activate')}
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenCreate}
                className="w-full py-2.5 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-all font-bnUI flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('publishHeader', uiLang)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Published Works Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-bnUI flex items-center space-x-2 border-b border-theme-main pb-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>
            {isSelf
              ? (uiLang === 'bn' ? 'আমার প্রকাশিত সাহিত্যসমূহ' : 'My Published Works')
              : (uiLang === 'bn' ? `${profile?.name}-এর সাহিত্যসমূহ` : `Works by ${profile?.name}`)}
          </span>
        </h3>

        {isWorksLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-5 rounded-2xl border border-theme-main bg-theme-card animate-pulse h-32" />
            ))}
          </div>
        ) : !authorWorks || authorWorks.items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-theme-main bg-theme-card opacity-70 font-bnUI text-xs">
            {t('noResultsFound', uiLang)}
          </div>
        ) : (
          <div className="space-y-4">
            {authorWorks.items.map((item) => (
              <LiteratureCard
                key={item.id}
                item={item}
                onRead={onRead}
                onComment={onComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
