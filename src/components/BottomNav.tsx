import React from 'react';
import { ScreenType } from '../types/nutrition';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.03)] border-t border-[#f2f3ff]">
      <div className="max-w-md mx-auto h-20 px-4 flex items-center justify-around">
        {/* Today */}
        <button
          onClick={() => onNavigate('today')}
          aria-current={currentScreen === 'today' ? 'page' : undefined}
          className={`group relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentScreen === 'today'
              ? 'text-[#10b981] font-semibold'
              : 'text-[#6c7a71] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] leading-none transition-transform group-active:scale-90">
            home
          </span>
          <span className="font-label-sm text-[11px] leading-tight">Today</span>
          <span
            className={`w-1 h-1 rounded-full bg-[#10b981] transition-opacity mt-0.5 ${
              currentScreen === 'today' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

        {/* Food */}
        <button
          onClick={() => onNavigate('food-log')}
          aria-current={currentScreen === 'food-log' ? 'page' : undefined}
          className={`group relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentScreen === 'food-log'
              ? 'text-[#10b981] font-semibold'
              : 'text-[#6c7a71] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] leading-none transition-transform group-active:scale-90">
            restaurant
          </span>
          <span className="font-label-sm text-[11px] leading-tight">Food</span>
          <span
            className={`w-1 h-1 rounded-full bg-[#10b981] transition-opacity mt-0.5 ${
              currentScreen === 'food-log' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

        {/* Center Prominent Scan AI Action */}
        <div className="relative flex flex-col items-center -mt-6">
          <button
            onClick={() => onNavigate('scan-ai')}
            aria-label="Launch AI Food Scanner"
            className="group flex flex-col items-center justify-center focus:outline-none"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all group-active:scale-95 ${
                currentScreen === 'scan-ai'
                  ? 'bg-[#006c49] text-white ring-4 ring-[#6ffbbe]/40'
                  : 'bg-[#10b981] text-white hover:bg-[#006c49]'
              }`}
            >
              <span className="material-symbols-outlined text-[28px] leading-none">photo_camera</span>
            </div>
            <span
              className={`font-label-sm text-[11px] font-semibold mt-1 tracking-tight ${
                currentScreen === 'scan-ai' ? 'text-[#006c49]' : 'text-[#10b981]'
              }`}
            >
              Scan AI
            </span>
          </button>
        </div>

        {/* Insights */}
        <button
          onClick={() => onNavigate('weekly-insights')}
          aria-current={currentScreen === 'weekly-insights' ? 'page' : undefined}
          className={`group relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentScreen === 'weekly-insights'
              ? 'text-[#10b981] font-semibold'
              : 'text-[#6c7a71] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] leading-none transition-transform group-active:scale-90">
            monitoring
          </span>
          <span className="font-label-sm text-[11px] leading-tight">Insights</span>
          <span
            className={`w-1 h-1 rounded-full bg-[#10b981] transition-opacity mt-0.5 ${
              currentScreen === 'weekly-insights' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('goals-and-profile')}
          aria-current={currentScreen === 'goals-and-profile' ? 'page' : undefined}
          className={`group relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentScreen === 'goals-and-profile'
              ? 'text-[#10b981] font-semibold'
              : 'text-[#6c7a71] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] leading-none transition-transform group-active:scale-90">
            manage_accounts
          </span>
          <span className="font-label-sm text-[11px] leading-tight">Profile</span>
          <span
            className={`w-1 h-1 rounded-full bg-[#10b981] transition-opacity mt-0.5 ${
              currentScreen === 'goals-and-profile' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};
