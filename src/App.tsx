import React, { useState } from 'react';
import { ScreenType, MealEntry, UserProfile } from './types/nutrition';
import { INITIAL_USER_PROFILE, INITIAL_TODAY_MEALS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayScreen } from './components/TodayScreen';
import { ScanAiScreen } from './components/ScanAiScreen';
import { FoodLogScreen } from './components/FoodLogScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { WeeklyInsightsScreen } from './components/WeeklyInsightsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('today');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [meals, setMeals] = useState<MealEntry[]>(INITIAL_TODAY_MEALS);
  const [waterAmount, setWaterAmount] = useState<number>(1.8);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddWater = (amount: number) => {
    setWaterAmount((prev) => {
      const next = Math.min(3.0, +(prev + amount).toFixed(2));
      return next;
    });
  };

  const handleAddMeal = (newMeal: MealEntry) => {
    setMeals((prev) => [newMeal, ...prev.filter((m) => m.id !== 'meal-dinner-planned' || newMeal.mealType !== 'dinner')]);
    showToast(`Added "${newMeal.name}" to today's log`);
  };

  const handleRemoveMeal = (mealId: string) => {
    const mealToRemove = meals.find((m) => m.id === mealId);
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
    if (mealToRemove) {
      showToast(`Removed "${mealToRemove.name}"`);
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center">
      {/* Top Device & Screen Switcher Bar (visible on md/lg displays for review & presentation) */}
      <div className="w-full bg-[#283044] text-[#eef0ff] py-2 px-4 shadow-sm z-50 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#4edea3]">AuraTrack Telemetry Suite</span>
          <span className="hidden sm:inline text-[#bbcabf]">• Clinical Precision Wellness</span>
        </div>

        {/* Quick Screen Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[#bbcabf] text-[11px] mr-1 hidden sm:inline">Screen:</span>
          {(
            [
              { id: 'today', label: '1. Today' },
              { id: 'scan-ai', label: '2. Scan AI' },
              { id: 'food-log', label: '3. Food Log' },
              { id: 'weekly-insights', label: '4. Insights' },
              { id: 'goals-and-profile', label: '5. Profile' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(s.id as ScreenType)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentScreen === s.id
                  ? 'bg-[#10b981] text-[#00422b] font-bold shadow-2xs'
                  : 'text-[#eef0ff]/80 hover:bg-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="hidden md:flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              isMobileFrame ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
            title="Switch to Mobile Frame View"
          >
            Mobile Frame
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              !isMobileFrame ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
            title="Switch to Full Width View"
          >
            Full Width
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Frame Mockup or Full Screen */}
      <div
        className={`w-full transition-all duration-300 flex-1 flex flex-col justify-start items-center ${
          isMobileFrame
            ? 'py-0 md:py-6'
            : ''
        }`}
      >
        <div
          className={`w-full flex flex-col bg-[#faf8ff] min-h-screen relative transition-all ${
            isMobileFrame
              ? 'max-w-[430px] md:min-h-[884px] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] md:border-[8px] md:border-[#283044] md:overflow-hidden'
              : 'max-w-2xl'
          }`}
        >
          {/* Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            onBack={() => setCurrentScreen('today')}
            showBack={currentScreen !== 'today'}
          />

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#10b981] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[13px] font-semibold animate-bounce">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Screen Routing */}
          <main className="flex-1 w-full pt-16 flex flex-col">
            {currentScreen === 'today' && (
              <TodayScreen
                userProfile={userProfile}
                meals={meals}
                waterAmount={waterAmount}
                onAddWater={handleAddWater}
                onNavigate={setCurrentScreen}
                onRemoveMeal={handleRemoveMeal}
              />
            )}

            {currentScreen === 'scan-ai' && (
              <ScanAiScreen
                onConfirmMeal={(meal) => {
                  handleAddMeal(meal);
                  setCurrentScreen('today');
                }}
                onNavigateBack={() => setCurrentScreen('today')}
              />
            )}

            {currentScreen === 'food-log' && (
              <FoodLogScreen
                onAddMeal={handleAddMeal}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'weekly-insights' && (
              <WeeklyInsightsScreen userProfile={userProfile} />
            )}

            {currentScreen === 'goals-and-profile' && (
              <ProfileScreen
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        </div>
      </div>
    </div>
  );
}
