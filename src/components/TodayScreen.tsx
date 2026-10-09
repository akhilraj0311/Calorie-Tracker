import React, { useState } from 'react';
import { MealEntry, UserProfile, ScreenType } from '../types/nutrition';

interface TodayScreenProps {
  userProfile: UserProfile;
  meals: MealEntry[];
  waterAmount: number;
  onAddWater: (amount: number) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectMealForView?: (meal: MealEntry) => void;
  onRemoveMeal?: (mealId: string) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  userProfile,
  meals,
  waterAmount,
  onAddWater,
  onNavigate,
  onSelectMealForView,
  onRemoveMeal,
}) => {
  const [showToast, setShowToast] = useState(true);
  const [syncedTime, setSyncedTime] = useState('2m ago');

  // Compute total calories & macros from logged meals (excluding planned dinner)
  const consumedMeals = meals.filter((m) => !m.planned);
  const currentCalories = consumedMeals.reduce((acc, m) => acc + m.calories, 0);
  const currentProtein = consumedMeals.reduce((acc, m) => acc + m.protein, 0);
  const currentCarbs = consumedMeals.reduce((acc, m) => acc + m.carbs, 0);
  const currentFats = consumedMeals.reduce((acc, m) => acc + m.fats, 0);

  const calorieTarget = userProfile.targetCalories;
  const remainingCalories = Math.max(0, calorieTarget - currentCalories);
  const caloriePercent = Math.min(100, Math.round((currentCalories / calorieTarget) * 100));

  // Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // 427.25
  const strokeDashoffset = circumference - (circumference * caloriePercent) / 100;

  const waterGoal = userProfile.waterGoalLitres;
  const waterPercent = Math.min(100, Math.round((waterAmount / waterGoal) * 100));
  const glassesLogged = Math.round(waterAmount / 0.25);
  const glassesRemaining = Math.max(0, Math.round(waterGoal / 0.25) - glassesLogged);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-2 pb-28 space-y-4">
      {/* Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-headline-lg text-[22px] text-[#131b2e] tracking-tight font-semibold">
              Good morning, {userProfile.name.split(' ')[0]}
            </h1>
            <span className="text-[20px] select-none" role="img" aria-label="wave">
              👋
            </span>
          </div>
          <p className="font-body-md text-[14px] text-[#3c4a42] mt-0.5">Let's stay on track today</p>
        </div>

        <button
          onClick={() => setSyncedTime('Just now')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f3ff] shadow-sm hover:bg-[#eaedff] transition-colors"
          title="Click to sync biometrics"
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="font-label-sm text-[11px] text-[#3c4a42] font-medium">
            Synced {syncedTime}
          </span>
          <span className="material-symbols-outlined text-[#00687a] text-[14px]">vital_signs</span>
        </button>
      </div>

      {/* Calorie & Metabolic Telemetry Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e2e7ff] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-md text-[12px] text-[#6c7a71] uppercase tracking-wider font-semibold">
            Metabolic Budget
          </span>
          <span className="font-label-sm text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006c49]">
            {caloriePercent}% of target
          </span>
        </div>

        {/* Concentric SVG Progress Gauge */}
        <div className="relative flex flex-col items-center justify-center my-1">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg aria-hidden="true" className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background track */}
              <circle
                className="text-[#eaedff]"
                cx="80"
                cy="80"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="11"
              />
              {/* Calorie progress arc */}
              <circle
                className="text-[#10b981] transition-all duration-700 ease-out"
                cx="80"
                cy="80"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="11"
              />
              {/* Inner secondary subtle ring track for activity burn */}
              <circle
                className="text-[#f2f3ff]"
                cx="80"
                cy="80"
                fill="none"
                r="54"
                stroke="currentColor"
                strokeWidth="5"
              />
              <circle
                className="text-[#00687a]"
                cx="80"
                cy="80"
                fill="none"
                r="54"
                stroke="currentColor"
                strokeDasharray="339.29"
                strokeDashoffset="101"
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>

            {/* Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-metric-xl text-[38px] text-[#131b2e] font-semibold tracking-tight leading-none">
                {currentCalories.toLocaleString()}
              </span>
              <span className="font-label-sm text-[11px] text-[#3c4a42] mt-0.5">
                / {calorieTarget.toLocaleString()} kcal
              </span>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#006c49] font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[12px]">bolt</span>
                <span>{remainingCalories} kcal left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Indicators Breakdown */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Protein */}
          <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] font-semibold text-[#006c49]">Protein</span>
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-medium">
                {Math.round((currentProtein / userProfile.targetProtein) * 100)}%
              </span>
            </div>
            <div className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
              {currentProtein}
              <span className="font-body-sm text-[11px] text-[#6c7a71] font-normal">
                /{userProfile.targetProtein}g
              </span>
            </div>
            <div className="w-full bg-[#eaedff] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentProtein / userProfile.targetProtein) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] font-semibold text-[#e29100]">Carbs</span>
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-medium">
                {Math.round((currentCarbs / userProfile.targetCarbs) * 100)}%
              </span>
            </div>
            <div className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
              {currentCarbs}
              <span className="font-body-sm text-[11px] text-[#6c7a71] font-normal">
                /{userProfile.targetCarbs}g
              </span>
            </div>
            <div className="w-full bg-[#eaedff] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#e29100] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentCarbs / userProfile.targetCarbs) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] font-semibold text-[#00687a]">Fats</span>
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-medium">
                {Math.round((currentFats / userProfile.targetFats) * 100)}%
              </span>
            </div>
            <div className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
              {currentFats}
              <span className="font-body-sm text-[11px] text-[#6c7a71] font-normal">
                /{userProfile.targetFats}g
              </span>
            </div>
            <div className="w-full bg-[#eaedff] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#00687a] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentFats / userProfile.targetFats) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Water Tracker Section */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e2e7ff] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#00687a]">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                water_drop
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-[15px] text-[#131b2e] font-semibold leading-tight">
                Water Intake
              </h2>
              <span className="font-label-sm text-[11px] text-[#3c4a42]">
                {glassesLogged} glasses logged • {glassesRemaining > 0 ? `${glassesRemaining} to goal` : 'Goal met!'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-[20px] text-[#131b2e] font-semibold">
              {waterAmount.toFixed(1)}
            </span>
            <span className="font-body-md text-[14px] text-[#3c4a42] font-normal">
              {' '}
              / {waterGoal.toFixed(1)}L
            </span>
          </div>
        </div>

        {/* Fluid Wave Progress Bar */}
        <div className="mt-4 mb-2 relative">
          <div className="w-full bg-[#f2f3ff] rounded-full h-4 overflow-hidden relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4cd7f6] via-[#00687a] to-[#006172] transition-all duration-500 ease-out flex items-center justify-end pr-1"
              style={{ width: `${waterPercent}%` }}
            >
              <span className="w-2 h-2 rounded-full bg-white opacity-80 animate-ping"></span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="font-label-sm text-[11px] text-[#6c7a71]">0.0L</span>
            <span className="font-label-sm text-[11px] font-semibold text-[#00687a]">
              {waterPercent}% Reached
            </span>
            <span className="font-label-sm text-[11px] text-[#6c7a71]">{waterGoal.toFixed(1)}L Goal</span>
          </div>
        </div>

        {/* Quick Add Action Chips */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            className="min-h-[44px] px-2 py-2 rounded-xl bg-[#f2f3ff] active:bg-[#acedff]/50 transition-all flex flex-col items-center justify-center group active:scale-95 hover:bg-[#eaedff]"
            onClick={() => onAddWater(0.25)}
          >
            <span className="font-label-sm text-[11px] font-semibold text-[#00687a] group-hover:text-[#006172]">
              +250 ml
            </span>
            <span className="font-label-sm text-[11px] text-[#6c7a71]">Glass</span>
          </button>
          <button
            className="min-h-[44px] px-2 py-2 rounded-xl bg-[#f2f3ff] active:bg-[#acedff]/50 transition-all flex flex-col items-center justify-center group active:scale-95 hover:bg-[#eaedff]"
            onClick={() => onAddWater(0.5)}
          >
            <span className="font-label-sm text-[11px] font-semibold text-[#00687a] group-hover:text-[#006172]">
              +500 ml
            </span>
            <span className="font-label-sm text-[11px] text-[#6c7a71]">Flask</span>
          </button>
          <button
            className="min-h-[44px] px-2 py-2 rounded-xl bg-[#f2f3ff] active:bg-[#acedff]/50 transition-all flex flex-col items-center justify-center group active:scale-95 hover:bg-[#eaedff]"
            onClick={() => onAddWater(0.75)}
          >
            <span className="font-label-sm text-[11px] font-semibold text-[#00687a] group-hover:text-[#006172]">
              +750 ml
            </span>
            <span className="font-label-sm text-[11px] text-[#6c7a71]">Bottle</span>
          </button>
        </div>
      </div>

      {/* Today's Meals Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">Today's Meals</h2>
            <span className="font-label-sm text-[11px] text-[#3c4a42]">
              {meals.length} logged entries
            </span>
          </div>
          <button
            onClick={() => onNavigate('food-log')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#10b981] text-white font-label-md text-[12px] font-semibold shadow-sm active:scale-95 transition-transform hover:bg-[#006c49]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Food</span>
          </button>
        </div>

        {/* Meal List */}
        {meals.map((meal) => {
          const isPlanned = meal.planned;

          if (isPlanned) {
            return (
              <div
                key={meal.id}
                onClick={() => onNavigate('food-log')}
                className="p-3 rounded-xl bg-[#f2f3ff]/80 border border-dashed border-[#bbcabf] shadow-sm flex items-center gap-3 cursor-pointer hover:bg-[#eaedff] transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0 text-[#6c7a71]">
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] font-semibold text-[#6c7a71] uppercase">
                      Dinner (Planned)
                    </span>
                    <span className="font-label-sm text-[11px] font-semibold text-[#006c49]">
                      300 kcal budget
                    </span>
                  </div>
                  <p className="font-body-md text-[14px] text-[#3c4a42] truncate font-medium">
                    {meal.time}
                  </p>
                  <span className="font-label-sm text-[11px] text-[#6c7a71] truncate block">
                    {meal.name}
                  </span>
                </div>
              </div>
            );
          }

          const typeColor =
            meal.mealType === 'breakfast'
              ? 'text-[#006c49]'
              : meal.mealType === 'lunch'
              ? 'text-[#00687a]'
              : meal.mealType === 'dinner'
              ? 'text-[#855300]'
              : 'text-[#e29100]';

          return (
            <div
              key={meal.id}
              onClick={() => {
                if (meal.aiScanned) {
                  onNavigate('scan-ai');
                } else if (onSelectMealForView) {
                  onSelectMealForView(meal);
                }
              }}
              className="p-3 rounded-xl bg-white border border-[#e2e7ff] shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow group relative"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#f2f3ff]">
                {meal.image ? (
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    alt={meal.name}
                    src={meal.image}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6c7a71]">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-label-sm text-[11px] font-semibold uppercase ${typeColor}`}>
                      {meal.mealType}
                    </span>
                    {meal.aiScanned && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#acedff]/50 text-[#006172] font-label-sm text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                        AI Scanned
                      </span>
                    )}
                  </div>
                  <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
                    {meal.calories}{' '}
                    <span className="font-label-sm text-[11px] text-[#6c7a71] font-normal">kcal</span>
                  </span>
                </div>
                <p className="font-body-md text-[14px] text-[#131b2e] font-medium truncate">
                  {meal.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-label-sm text-[11px] text-[#3c4a42]">P {meal.protein}g</span>
                  <span className="text-[#bbcabf] text-[10px]">•</span>
                  <span className="font-label-sm text-[11px] text-[#3c4a42]">C {meal.carbs}g</span>
                  <span className="text-[#bbcabf] text-[10px]">•</span>
                  <span className="font-label-sm text-[11px] text-[#3c4a42]">F {meal.fats}g</span>
                </div>
              </div>

              {onRemoveMeal && (
                <button
                  type="button"
                  aria-label="Remove meal"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMeal(meal.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#6c7a71] hover:text-[#ba1a1a] p-1 rounded transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Undo Confirmation Toast Preview */}
        {showToast && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#e2e7ff] shadow-md transition-all">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c49] text-[18px]">
                check_circle
              </span>
              <span className="font-body-sm text-[12px] text-[#131b2e] font-medium">
                Dinner meal saved to plan
              </span>
            </div>
            <button
              className="font-label-md text-[12px] text-[#006c49] font-semibold hover:underline active:scale-95 transition-transform min-h-[32px] px-2 flex items-center"
              onClick={() => setShowToast(false)}
            >
              Undo
            </button>
          </div>
        )}
      </div>

      {/* Primary Bottom Call To Action Trigger */}
      <div className="pt-1 pb-2">
        <button
          onClick={() => onNavigate('scan-ai')}
          className="w-full min-h-[48px] py-3.5 rounded-full bg-[#10b981] text-white font-headline-sm text-[16px] font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group hover:bg-[#006c49]"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
            add_circle
          </span>
          <span>Log Meal or Scan</span>
        </button>
      </div>
    </div>
  );
};
