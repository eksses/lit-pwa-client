import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CommentModal } from './components/CommentModal';
import { CreateLiteratureModal } from './components/CreateLiteratureModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { ReadingPage } from './pages/ReadingPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FollowingPage } from './pages/FollowingPage';
import { OfflinePage } from './pages/OfflinePage';
import { ProfilePage } from './pages/ProfilePage';

import { Theme, Language, Literature } from './types';
import { useAuthStore } from './store/useAuthStore';
import { useReaderStore } from './store/useReaderStore';

export default function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useReaderStore();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [langFilter, setLangFilter] = useState<'all' | Language>('all');

  // Active reading item state
  const [activeLiterature, setActiveLiterature] = useState<Literature | null>(null);

  // Active author profile view state
  const [activeAuthorId, setActiveAuthorId] = useState<string | null>(null);

  // Modals state
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentLiterature, setCommentLiterature] = useState<Literature | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Synchronize document theme class
  useEffect(() => {
    document.documentElement.className = `theme-${theme} ${theme === 'dark' ? 'dark' : ''}`;
  }, [theme]);

  const handleReadLiterature = (item: Literature) => {
    setActiveLiterature(item);
  };

  const handleOpenComment = (item: Literature) => {
    setCommentLiterature(item);
    setIsCommentOpen(true);
  };

  const handleAuthorClick = (authorId: string) => {
    setActiveAuthorId(authorId);
    setActiveTab('profile');
  };

  const handleTabChange = (tab: string) => {
    setActiveLiterature(null);
    if (tab !== 'profile') {
      setActiveAuthorId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    if (isAuthenticated) {
      setIsCreateOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#121212] text-gray-100'
          : theme === 'sepia'
          ? 'bg-[#fbf0d9] text-[#2d2318]'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Fullscreen Immersive Reader View */}
      {activeLiterature ? (
        <ReadingPage
          literature={activeLiterature}
          onBack={() => setActiveLiterature(null)}
          onComment={handleOpenComment}
          onOpenAuth={() => setIsAuthOpen(true)}
          onAuthorClick={(authorId) => {
            setActiveLiterature(null);
            handleAuthorClick(authorId);
          }}
        />
      ) : (
        <>
          {/* Top Header Navbar */}
          <Navbar
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenCreate={handleCreateClick}
            onNavigateTab={handleTabChange}
          />

          {/* Main App Page View Container */}
          <main className="max-w-3xl mx-auto px-4 py-5">
            {activeTab === 'home' && (
              <HomePage
                langFilter={langFilter}
                onRead={handleReadLiterature}
                onComment={handleOpenComment}
                onAuthorClick={handleAuthorClick}
                onOpenCreate={handleCreateClick}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesPage
                onRead={handleReadLiterature}
                onComment={handleOpenComment}
                onAuthorClick={handleAuthorClick}
              />
            )}

            {activeTab === 'following' && (
              <FollowingPage
                onRead={handleReadLiterature}
                onComment={handleOpenComment}
                onAuthorClick={handleAuthorClick}
                onOpenAuth={() => setIsAuthOpen(true)}
                onGoHome={() => handleTabChange('home')}
              />
            )}

            {activeTab === 'offline' && (
              <OfflinePage
                onRead={handleReadLiterature}
                onGoHome={() => handleTabChange('home')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                authorId={activeAuthorId}
                onRead={handleReadLiterature}
                onComment={handleOpenComment}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenCreate={handleCreateClick}
              />
            )}
          </main>

          {/* Fixed Mobile Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}

      {/* Global Modals */}
      <CommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        literature={commentLiterature}
      />

      <CreateLiteratureModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        langFilter={langFilter}
        onLangFilterChange={setLangFilter}
      />

      <ToastContainer />
    </div>
  );
}
