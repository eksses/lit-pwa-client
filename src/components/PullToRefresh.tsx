import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguageStore } from '../store/useLanguageStore';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
  const queryClient = useQueryClient();
  const { uiLang } = useLanguageStore();

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const PULL_THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      isDraggingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0 && window.scrollY === 0) {
      // Resistance effect math
      const distance = Math.min(100, deltaY * 0.45);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50);

      if (navigator.vibrate) {
        navigator.vibrate(30);
      }

      try {
        if (onRefresh) {
          await onRefresh();
        } else {
          await queryClient.invalidateQueries();
        }
      } catch (err) {
        console.warn('Pull-to-refresh error:', err);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 600);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull-to-Refresh Indicator Ring */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center transition-all duration-200"
          style={{
            transform: `translate(-50%, ${pullDistance}px)`,
            opacity: Math.min(1, pullDistance / PULL_THRESHOLD),
          }}
        >
          <div className="w-10 h-10 rounded-full bg-theme-card border border-emerald-500/50 shadow-xl flex items-center justify-center text-emerald-500">
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${pullDistance * 3.6}deg)`,
              }}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
