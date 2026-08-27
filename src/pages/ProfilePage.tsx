import React from 'react';
import { User as UserIcon, LogOut, PlusCircle, Feather, Users, BookOpen, UserPlus, UserCheck, Calendar } from 'lucide-react';
import { Literature } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useAuthorProfile, useToggleFollow } from '../hooks/useAuthors';
import { useLiteratureList } from '../hooks/useLiterature';
import { LiteratureCard } from '../components/LiteratureCard';

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
  const { user: currentUser, isAuthenticated, logout } = useAuthStore();
  const toggleFollowMutation = useToggleFollow();

  // If authorId is passed and it's not current user's id, we view that author.
  const targetAuthorId = authorId || currentUser?.id;
  const isSelf = Boolean(currentUser && currentUser.id === targetAuthorId);

  const { data: authorProfile, isLoading: isProfileLoading } = useAuthorProfile(targetAuthorId || '');
  const { data: authorWorks, isLoading: isWorksLoading } = useLiteratureList({
    author_id: targetAuthorId || undefined,
  });

  // If not logged in and not viewing specific author
  if (!isAuthenticated && !authorId) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
          <UserIcon className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-bnUI">লেখক প্রোফাইল ও সদস্য অঞ্চল</h2>
          <p className="text-xs text-gray-500 font-bnUI leading-relaxed">
            আপনার নিজস্ব কবিতা ও সাহিত্য প্রকাশ করতে, অনুসরণকারীদের পরিচালনা করতে এবং প্রোফাইল সাজাতে লগইন করুন।
          </p>
        </div>

        <button
          onClick={onOpenAuth}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-sm shadow-md hover:bg-emerald-600 transition-all font-bnUI"
        >
          লগইন / রেজিস্টার করুন
        </button>
      </div>
    );
  }

  const profile = isSelf ? {
    id: currentUser?.id,
    name: currentUser?.name || 'কবি',
    username: currentUser?.username || 'writer',
    avatarUrl: currentUser?.avatarUrl,
    bio: currentUser?.bio || 'কাব্য ও কথার একজন অনুরাগী সাহিত্যিক।',
    worksCount: authorProfile?.worksCount ?? (authorWorks?.items.length || 0),
    followersCount: authorProfile?.followersCount ?? 0,
    followingCount: authorProfile?.followingCount ?? 0,
    is_following: false,
  } : authorProfile;

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl border border-theme-main bg-theme-card shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-2xl border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-md">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile?.name?.charAt(0).toUpperCase() || 'A'
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold font-bnUI tracking-tight">{profile?.name}</h2>
                <p className="text-xs text-gray-500 font-enUI">@{profile?.username}</p>
              </div>

              {isSelf ? (
                <button
                  onClick={logout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-rose-500/30 text-rose-500 text-xs font-medium font-bnUI hover:bg-rose-500/10 transition-colors self-center sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
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
                        <span>অনুসরণ করছেন</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>অনুসরণ করুন</span>
                      </>
                    )}
                  </button>
                )
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 font-bnUI leading-relaxed pt-1">
              {profile?.bio || 'কোনো বায়ো উপলব্ধ নেই।'}
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-theme-main/60 text-center font-bnUI">
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.worksCount ?? 0}
            </span>
            <span className="text-[11px] text-gray-500">প্রকাশিত সাহিত্য</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.followersCount ?? 0}
            </span>
            <span className="text-[11px] text-gray-500">অনুসরণকারী</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-500/5">
            <span className="block text-lg font-bold text-emerald-500">
              {profile?.followingCount ?? 0}
            </span>
            <span className="text-[11px] text-gray-500">অনুসরণ করছেন</span>
          </div>
        </div>

        {isSelf && (
          <button
            onClick={onOpenCreate}
            className="w-full py-2.5 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-all font-bnUI flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সাহিত্য প্রকাশ করুন</span>
          </button>
        )}
      </div>

      {/* Published Works Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-bnUI flex items-center space-x-2 border-b border-theme-main pb-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>
            {isSelf ? 'আমার প্রকাশিত সাহিত্যসমূহ' : `${profile?.name}-এর সাহিত্যসমূহ`}
          </span>
        </h3>

        {isWorksLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-5 rounded-2xl border border-theme-main bg-theme-card animate-pulse h-32" />
            ))}
          </div>
        ) : !authorWorks || authorWorks.items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-theme-main bg-theme-card text-gray-400 font-bnUI text-xs">
            এখনো কোনো প্রকাশনা নেই।
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
