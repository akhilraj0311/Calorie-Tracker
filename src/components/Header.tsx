import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenType } from '../types/nutrition';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onBack?: () => void;
  showBack?: boolean;
  titleOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  showBack,
  titleOverride,
}) => {
  const isScanAi = currentScreen === 'scan-ai';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left Section: Back button or Logo + Title */}
        <div className="flex items-center gap-2">
          {showBack || isScanAi ? (
            <button
              aria-label="Go back"
              onClick={onBack || (() => onNavigate('today'))}
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onNavigate('today')}
          >
            <img
              alt="AuraTrack Modern Logo"
              className="h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
            <h1 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold tracking-tight">
              {titleOverride || (isScanAi ? 'Scan Ai' : 'AuraTrack')}
            </h1>
          </div>
        </div>

        {/* Right Section: Streak & Profile Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f3ff] shadow-[0_1px_4px_rgba(0,0,0,0.02)] cursor-default"
            title="Active Streak: 14 Consecutive Days Logged"
          >
            <span className="text-[12px] leading-none select-none">🔥</span>
            <span className="font-label-sm text-[11px] font-semibold text-[#e29100] tracking-wide uppercase">
              14D Streak
            </span>
          </div>

          <button
            onClick={() => onNavigate('goals-and-profile')}
            aria-label="Go to Profile"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#dae2fd]"
              src={ASSETS.profileAvatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
