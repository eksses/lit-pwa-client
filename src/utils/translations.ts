import { Language } from '../types';

export const translations = {
  // App Branding
  appName: { bn: 'নির্বাক', en: 'Nirbak' },
  tagline: { bn: 'বাংলা ও ইংরেজি সাহিত্য নিকেতন', en: 'Sanctuary for Bangla & English Literature' },

  // Navigation
  navHome: { bn: 'হোম', en: 'Home' },
  navCategories: { bn: 'আবিষ্কার', en: 'Discover' },
  navFollowing: { bn: 'অনুসরণ', en: 'Following' },
  navOffline: { bn: 'সংরক্ষিত', en: 'Saved' },
  navProfile: { bn: 'প্রোফাইল', en: 'Profile' },

  // Categories & Filters
  all: { bn: 'সব', en: 'All' },
  poems: { bn: 'কবিতা', en: 'Poems' },
  stories: { bn: 'গল্প', en: 'Stories' },
  microPoetry: { bn: 'অনুকবিতা', en: 'Micro-poetry' },
  categoryPoemsDesc: { bn: 'আবেগ, ছন্দ এবং অনুভূতির কবিতাংশ', en: 'Verses of passion, rhythm and deep emotion' },
  categoryStoriesDesc: { bn: 'জীবনপ্রবাহ, গল্প এবং কল্পলোকের সাহিত্যকথা', en: 'Short fiction and narrative storytelling' },
  categoryMicroDesc: { bn: 'অল্প কথায় বিশাল অনুভূতির অনু-কবিতা', en: 'Brevity and deep thought in micro-poetry' },
  langFilterAll: { bn: 'সকল ভাষা', en: 'All Languages' },
  langFilterBn: { bn: 'বাংলা', en: 'Bangla' },
  langFilterEn: { bn: 'English', en: 'English' },

  // Literature Card & Detail
  readMore: { bn: 'পড়ুন', en: 'Read Story' },
  readTime: { bn: 'মিঃ পাঠ', en: 'min read' },
  views: { bn: 'বার পঠিত', en: 'views' },
  like: { bn: 'লাইক', en: 'Like' },
  comment: { bn: 'মন্তব্য', en: 'Comment' },
  saveOffline: { bn: 'সংরক্ষণ', en: 'Save' },
  savedOffline: { bn: 'সংরক্ষিত', en: 'Saved' },
  share: { bn: 'শেয়ার', en: 'Share' },
  follow: { bn: 'অনুসরণ করুন', en: 'Follow' },
  following: { bn: 'অনুসরণ করছেন', en: 'Following' },
  unfollow: { bn: 'আনফলো', en: 'Unfollow' },
  guestBadge: { bn: 'পাঠক গেস্ট', en: 'Guest Reader' },

  // Roles & Badges
  roleReader: { bn: 'পাঠক', en: 'Reader' },
  roleWriter: { bn: 'কবি ও লেখক', en: 'Poet & Writer' },
  roleAdmin: { bn: 'অ্যাডমিন', en: 'Admin' },
  becomeWriter: { bn: 'লেখক প্রোফাইল সক্রিয় করুন', en: 'Become a Writer' },
  becomeWriterDesc: { bn: 'আপনার কবিতা ও গল্প সবার সাথে শেয়ার করুন', en: 'Publish your poems and short stories' },

  // Reading Controls
  readerSettings: { bn: 'পাঠক কাস্টমাইজার', en: 'Reader Settings' },
  fontSize: { bn: 'ফন্ট সাইজ', en: 'Font Size' },
  theme: { bn: 'পটভূমির থিম', en: 'Background Theme' },
  themeLight: { bn: 'লাইট (Light)', en: 'Light' },
  themeSepia: { bn: 'সেপিয়া (Sepia)', en: 'Sepia' },
  themeDark: { bn: 'ডার্ক (Dark)', en: 'Dark' },

  // Modals & Forms
  login: { bn: 'লগইন করুন', en: 'Sign In' },
  register: { bn: 'নতুন অ্যাকাউন্ট তৈরি করুন', en: 'Create Account' },
  logout: { bn: 'লগআউট', en: 'Sign Out' },
  name: { bn: 'আপনার নাম', en: 'Full Name' },
  username: { bn: 'ইউজারনেম', en: 'Username' },
  email: { bn: 'ইমেইল ঠিকানা', en: 'Email Address' },
  password: { bn: 'পাসওয়ার্ড', en: 'Password' },
  bio: { bn: 'বায়ো / আত্মপরিচয়', en: 'Short Bio' },
  selectAccountType: { bn: 'অ্যাকাউন্টের ধরণ নির্বাচন করুন', en: 'Select Account Type' },

  // Comments Sheet
  commentsHeader: { bn: 'পাঠকের প্রতিক্রিয়া ও মন্তব্যসমূহ', en: 'Reader Comments' },
  guestNameLabel: { bn: 'আপনার নাম (অতিথি হিসেবে)', en: 'Your Name (as Guest)' },
  commentPlaceholder: { bn: 'আপনার ভালো লাগা বা মন্তব্য লিখুন...', en: 'Write your thoughts or appreciation...' },
  postComment: { bn: 'মন্তব্য প্রকাশ করুন', en: 'Post Comment' },
  noCommentsYet: { bn: 'এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি লিখুন!', en: 'No comments yet. Be the first to share your thoughts!' },

  // Publish Form
  publishHeader: { bn: 'নতুন রচনার সৃষ্টি ও প্রকাশ', en: 'Publish New Work' },
  titleLabel: { bn: 'রচনার শিরোনাম', en: 'Title of your work' },
  contentLabel: { bn: 'রচনার মূল পাঠ', en: 'Content' },
  categoryLabel: { bn: 'বিভাগ নির্বাচন', en: 'Category' },
  languageLabel: { bn: 'লেখা প্রকাশের ভাষা', en: 'Language' },
  publishButton: { bn: 'পাবলিশ করুন', en: 'Publish Now' },
  publishing: { bn: 'প্রকাশিত হচ্ছে...', en: 'Publishing...' },

  // Search & Empty States
  searchPlaceholder: { bn: 'লেখা বা লেখকের নাম খুঁজুন...', en: 'Search stories, poems or authors...' },
  noResultsFound: { bn: 'কোনো ফলাফল পাওয়া যায়নি', en: 'No literature found' },
  noOfflineSaved: { bn: 'অফলাইনে কোনো রচনা সংরক্ষিত নেই', en: 'No works saved offline' },
  offlineDesc: { bn: 'যে কোনো লেখা পড়ার সময় বুকমার্ক বোতাম চাপলে তা অফলাইনে সম্পূর্ণ পড়া যাবে।', en: 'Bookmark works while reading to access them 100% offline anytime.' },
  guestFollowingPrompt: { bn: 'প্রিয় কবিদের অনুসরণ করতে লগইন করুন', en: 'Sign in to follow your favorite poets' },
  guestFollowingDesc: { bn: 'লগইন করলে আপনার অনুসরণ করা লেখকগণের নতুন প্রকাশনা এক নজরে দেখতে পাবেন।', en: 'Stay updated with new posts published by poets you follow.' },

  // Success / Status Messages
  roleUpgradeSuccess: { bn: 'অভিনন্দন! আপনি এখন একজন নিবন্ধিত লেখক।', en: 'Congratulations! You are now an active Writer.' },
  workPublishedSuccess: { bn: 'আপনার রচনাটি সফলভাবে প্রকাশিত হয়েছে!', en: 'Your work has been published successfully!' }
};

export function t(key: keyof typeof translations, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}
