import React, { useState } from 'react';
import { UserProfile } from '../types/nutrition';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'maintenance' | 'deficit' | 'surplus'>(
    userProfile.metabolicGoal
  );
  const [weightKg, setWeightKg] = useState(userProfile.weightKg);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(userProfile.weightKg.toString());

  const [appleHealthSync, setAppleHealthSync] = useState(userProfile.appleHealthSync);
  const [smartReminders, setSmartReminders] = useState(userProfile.smartReminders);
  const [aiScanSensitivity, setAiScanSensitivity] = useState(userProfile.aiScanSensitivity);

  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showRecalcToast, setShowRecalcToast] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('12 mins ago');

  // Compute dynamic caloric budget based on goal
  const calorieOffset =
    selectedGoal === 'deficit' ? -350 : selectedGoal === 'surplus' ? +250 : 0;
  const currentBudget = userProfile.targetCalories + calorieOffset;

  const proteinGrams = selectedGoal === 'deficit' ? 145 : 140;
  const carbsGrams =
    selectedGoal === 'deficit' ? 175 : selectedGoal === 'surplus' ? 260 : 220;
  const fatsGrams = selectedGoal === 'deficit' ? 60 : 70;

  const proteinPct = Math.round(((proteinGrams * 4) / currentBudget) * 100);
  const carbsPct = Math.round(((carbsGrams * 4) / currentBudget) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  const handleGoalChange = (goal: 'maintenance' | 'deficit' | 'surplus') => {
    setSelectedGoal(goal);
    onUpdateProfile({ metabolicGoal: goal });
  };

  const handleSaveWeight = () => {
    const parsed = parseFloat(newWeightInput);
    if (!isNaN(parsed) && parsed > 30 && parsed < 250) {
      setWeightKg(parsed);
      onUpdateProfile({ weightKg: parsed });
    }
    setIsEditingWeight(false);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setShowRecalcToast(true);
      setLastSyncedText('Just now');
      setTimeout(() => setShowRecalcToast(false), 4500);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Profile Identity Card */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff]">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              alt="Elena Vance profile avatar"
              className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-[#eaedff]"
              src={userProfile.avatarUrl}
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#10b981] rounded-full flex items-center justify-center text-white text-[10px] ring-2 ring-white">
              <span
                className="material-symbols-outlined text-[12px] leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-headline-md text-[20px] text-[#131b2e] font-semibold truncate">
                {userProfile.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#004e5c] font-label-sm text-[11px] font-semibold">
                {userProfile.tier}
              </span>
            </div>
            <p className="font-label-sm text-[11px] text-[#006c49] font-semibold mt-0.5">
              Active Streak: {userProfile.streakDays} Days 🔥
            </p>
            <p className="font-body-sm text-[12px] text-[#6c7a71] mt-0.5 truncate">
              Member since Aug 2023 • 68 Days Logged
            </p>
          </div>
        </div>

        {/* Micro Streak & Consistency Metric Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 bg-[#f2f3ff] rounded-lg p-2.5 border border-[#e2e7ff]">
          <div className="flex flex-col items-center text-center">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Adherence
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold mt-0.5">
              {userProfile.adherenceRate}%
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Logged
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold mt-0.5">
              {userProfile.totalMealsLogged} meals
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Sync State
            </span>
            <span className="font-headline-sm text-[15px] text-[#10b981] font-bold mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[15px]">sync_saved_locally</span> Live
            </span>
          </div>
        </div>
      </section>

      {/* Biometrics Baseline Grid */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
              Biometrics Baseline
            </h3>
            <p className="font-body-sm text-[12px] text-[#6c7a71]">
              Clinical data powering metabolic predictions
            </p>
          </div>
          <span className="material-symbols-outlined text-[#6c7a71]">tune</span>
        </div>

        {/* 2x2 Telemetry Metric Matrix */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col justify-between border border-[#e2e7ff]">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Age &amp; Sex
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
                {userProfile.age} yrs
              </span>
              <span className="font-label-sm text-[10px] text-[#00687a] bg-white px-2 py-0.5 rounded-full font-medium shadow-2xs">
                {userProfile.gender}
              </span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col justify-between border border-[#e2e7ff]">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Height
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
                {userProfile.heightCm} cm
              </span>
              <span className="font-label-sm text-[11px] text-[#6c7a71]">5'8"</span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col justify-between col-span-2 border border-[#e2e7ff]">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
                Current Weight
              </span>
              <span className="font-label-sm text-[11px] text-[#006c49] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">trending_flat</span> Steady
                (-0.2 kg/wk)
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              {isEditingWeight ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightInput}
                    onChange={(e) => setNewWeightInput(e.target.value)}
                    className="w-20 px-2 py-1 bg-white border border-[#10b981] rounded text-[18px] font-bold"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveWeight}
                    className="text-[12px] bg-[#10b981] text-white px-2 py-1 rounded font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-metric-lg text-[28px] text-[#131b2e] font-bold">
                    {weightKg.toFixed(1)}
                  </span>
                  <span className="font-body-md text-[14px] text-[#6c7a71]">
                    kg ({(weightKg * 2.20462).toFixed(1)} lbs)
                  </span>
                  <button
                    onClick={() => setIsEditingWeight(true)}
                    className="ml-auto text-[#006c49] font-label-sm text-[11px] font-semibold bg-[#eaedff] px-2.5 py-1 rounded-full hover:bg-[#e2e7ff] transition-colors"
                    type="button"
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Activity Level Selector */}
        <div className="bg-[#f2f3ff] rounded-lg p-3 space-y-1.5 border border-[#e2e7ff]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider font-semibold">
              Daily Activity Level
            </span>
            <button
              className="text-[#006c49] font-label-sm text-[11px] font-semibold flex items-center gap-0.5"
              type="button"
            >
              <span>Edit</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00687a]/10 flex items-center justify-center text-[#00687a] shrink-0">
              <span className="material-symbols-outlined text-[18px]">directions_run</span>
            </div>
            <div className="min-w-0">
              <p className="font-body-md text-[14px] font-semibold text-[#131b2e]">
                {userProfile.activityLevel}
              </p>
              <p className="font-body-sm text-[12px] text-[#6c7a71] truncate">
                {userProfile.activityDetail}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Goal Toggle Chips */}
        <div className="space-y-2">
          <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider block font-semibold">
            Primary Metabolic Goal
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGoalChange('maintenance')}
              className={`px-3 py-1.5 rounded-full font-label-md text-[12px] flex items-center gap-1.5 shadow-sm transition-all ${
                selectedGoal === 'maintenance'
                  ? 'bg-[#10b981] text-white font-semibold'
                  : 'bg-[#eaedff] text-[#3c4a42] hover:bg-[#e2e7ff]'
              }`}
              type="button"
            >
              {selectedGoal === 'maintenance' && (
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
              )}
              Lean Muscle &amp; Maintenance
            </button>

            <button
              onClick={() => handleGoalChange('deficit')}
              className={`px-3 py-1.5 rounded-full font-label-md text-[12px] flex items-center gap-1.5 shadow-sm transition-all ${
                selectedGoal === 'deficit'
                  ? 'bg-[#10b981] text-white font-semibold'
                  : 'bg-[#eaedff] text-[#3c4a42] hover:bg-[#e2e7ff]'
              }`}
              type="button"
            >
              {selectedGoal === 'deficit' && (
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
              )}
              Gentle Deficit
            </button>

            <button
              onClick={() => handleGoalChange('surplus')}
              className={`px-3 py-1.5 rounded-full font-label-md text-[12px] flex items-center gap-1.5 shadow-sm transition-all ${
                selectedGoal === 'surplus'
                  ? 'bg-[#10b981] text-white font-semibold'
                  : 'bg-[#eaedff] text-[#3c4a42] hover:bg-[#e2e7ff]'
              }`}
              type="button"
            >
              {selectedGoal === 'surplus' && (
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
              )}
              Athletic Surplus
            </button>
          </div>
        </div>
      </section>

      {/* Smart Calculated Nutrition Engine */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006c49] font-label-sm text-[11px] font-semibold mb-1">
              <span className="material-symbols-outlined text-[13px]">bolt</span> Bio-Calibrated Model
            </div>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
              Target Energy &amp; Macros
            </h3>
          </div>
          <span className="text-[#006172] font-label-sm text-[11px] bg-[#57dffe]/20 px-2 py-0.5 rounded-full font-medium">
            Katch-McArdle v2
          </span>
        </div>

        {/* Hero Calorie Target Display */}
        <div className="rounded-lg bg-[#f2f3ff] p-4 flex flex-col items-center text-center relative overflow-hidden border border-[#e2e7ff]">
          <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-widest font-semibold">
            Recommended Daily Budget
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display-hero-mobile text-[36px] text-[#006c49] font-bold tracking-tight">
              {currentBudget.toLocaleString()}
            </span>
            <span className="font-headline-sm text-[16px] text-[#3c4a42] font-medium">
              kcal / day
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-2 text-[#6c7a71] font-body-sm text-[12px]">
            <span>
              BMR: <strong className="text-[#131b2e]">1,480 kcal</strong>
            </span>
            <span>•</span>
            <span>
              Expenditure:{' '}
              <strong className="text-[#131b2e]">
                {selectedGoal === 'deficit' ? '+270 kcal' : '+620 kcal'}
              </strong>
            </span>
          </div>

          {/* Segmented Bar for Macro Split */}
          <div className="w-full h-2.5 rounded-full bg-[#eaedff] mt-4 flex overflow-hidden">
            <div
              className="h-full bg-[#10b981] transition-all duration-500"
              style={{ width: `${proteinPct}%` }}
            />
            <div
              className="h-full bg-[#00687a] transition-all duration-500"
              style={{ width: `${carbsPct}%` }}
            />
            <div
              className="h-full bg-[#e29100] transition-all duration-500"
              style={{ width: `${fatsPct}%` }}
            />
          </div>
          <div className="w-full flex justify-between text-center mt-1.5 font-label-sm text-[11px]">
            <span className="text-[#006c49] font-semibold">Protein {proteinPct}%</span>
            <span className="text-[#00687a] font-semibold">Carbs {carbsPct}%</span>
            <span className="text-[#855300] font-semibold">Fats {fatsPct}%</span>
          </div>
        </div>

        {/* Macro Breakdown Cards */}
        <div className="space-y-2.5">
          {/* Protein */}
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-center justify-between border border-[#e2e7ff]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 rounded-full bg-[#10b981]"></div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
                    {proteinGrams}g
                  </span>
                  <span className="font-label-sm text-[11px] text-[#006c49] font-semibold">
                    Protein
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#6c7a71]">
                  2.2g per kg body weight • Muscle recovery
                </p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] text-[#6c7a71] bg-white px-2 py-1 rounded-full shadow-2xs font-medium">
              {proteinGrams * 4} kcal
            </span>
          </div>

          {/* Carbohydrates */}
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-center justify-between border border-[#e2e7ff]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 rounded-full bg-[#00687a]"></div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
                    {carbsGrams}g
                  </span>
                  <span className="font-label-sm text-[11px] text-[#00687a] font-semibold">
                    Carbohydrates
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#6c7a71]">
                  Aerobic stamina &amp; high glycogen replenishment
                </p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] text-[#6c7a71] bg-white px-2 py-1 rounded-full shadow-2xs font-medium">
              {carbsGrams * 4} kcal
            </span>
          </div>

          {/* Fats */}
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-center justify-between border border-[#e2e7ff]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 rounded-full bg-[#e29100]"></div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
                    {fatsGrams}g
                  </span>
                  <span className="font-label-sm text-[11px] text-[#e29100] font-semibold">
                    Healthy Fats
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#6c7a71]">
                  Optimal hormonal profile &amp; cellular support
                </p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] text-[#6c7a71] bg-white px-2 py-1 rounded-full shadow-2xs font-medium">
              {fatsGrams * 9} kcal
            </span>
          </div>
        </div>

        {/* Fluid / Hydration Target Module */}
        <div className="rounded-lg bg-[#f2f3ff] p-3.5 flex items-center justify-between border border-[#e2e7ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#57dffe]/20 text-[#00687a] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                water_drop
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-[#6c7a71] uppercase tracking-wider block font-semibold">
                Fluid Intake Goal
              </span>
              <span className="font-headline-sm text-[15px] text-[#131b2e] font-semibold">
                {userProfile.waterGoalLitres.toFixed(1)} Litres / day
              </span>
              <p className="font-body-sm text-[12px] text-[#6c7a71]">
                Calibrated to {weightKg.toFixed(1)}kg &amp; high perspiration factor
              </p>
            </div>
          </div>
          <div className="w-11 h-11 relative flex items-center justify-center">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#dae2fd]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#00687a]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="85, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute font-label-sm text-[11px] font-semibold text-[#00687a]">
              85%
            </span>
          </div>
        </div>
      </section>

      {/* Preferences & Integrations */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff] space-y-3">
        <div>
          <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
            Sync &amp; Logging Automations
          </h3>
          <p className="font-body-sm text-[12px] text-[#6c7a71]">
            Device handoffs and notification rhythms
          </p>
        </div>

        <div className="space-y-3">
          {/* Apple Health Sync Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#ba1a1a] shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-body-md text-[14px] font-semibold text-[#131b2e]">
                    Apple Health Sync
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                </div>
                <p className="font-body-sm text-[12px] text-[#6c7a71]">
                  Passive steps, heart rate &amp; active burn data
                </p>
              </div>
            </div>
            <button
              aria-label="Toggle Apple Health Sync"
              onClick={() => setAppleHealthSync(!appleHealthSync)}
              className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                appleHealthSync ? 'bg-[#10b981] justify-end' : 'bg-[#bbcabf] justify-start'
              }`}
              type="button"
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>

          {/* Smart Reminders */}
          <div className="p-3 rounded-lg bg-[#f2f3ff] space-y-2 border border-[#e2e7ff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#006c49] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <div>
                  <span className="font-body-md text-[14px] font-semibold text-[#131b2e]">
                    Smart Meal Reminders
                  </span>
                  <p className="font-body-sm text-[12px] text-[#6c7a71]">
                    Gentle push alerts based on metabolic curves
                  </p>
                </div>
              </div>
              <button
                aria-label="Toggle Smart Reminders"
                onClick={() => setSmartReminders(!smartReminders)}
                className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                  smartReminders ? 'bg-[#10b981] justify-end' : 'bg-[#bbcabf] justify-start'
                }`}
                type="button"
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
              <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3c4a42] font-label-sm text-[11px] shrink-0">
                8:00 AM Breakfast
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3c4a42] font-label-sm text-[11px] shrink-0">
                1:00 PM Lunch
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3c4a42] font-label-sm text-[11px] shrink-0">
                7:00 PM Dinner
              </span>
            </div>
          </div>

          {/* AI Scan Precision Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#00687a] shrink-0">
                <span className="material-symbols-outlined text-[20px]">document_scanner</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-body-md text-[14px] font-semibold text-[#131b2e]">
                    AI Scan Sensitivity
                  </span>
                  <span className="font-label-sm text-[10px] text-[#006c49] font-semibold bg-white px-1.5 py-0.5 rounded shadow-2xs">
                    HD Macro
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#6c7a71]">
                  Multi-angle volumetric estimation on meals
                </p>
              </div>
            </div>
            <button
              aria-label="Toggle AI Scan Sensitivity"
              onClick={() => setAiScanSensitivity(!aiScanSensitivity)}
              className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                aiScanSensitivity ? 'bg-[#10b981] justify-end' : 'bg-[#bbcabf] justify-start'
              }`}
              type="button"
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Recalculate Metabolic Targets Action */}
      <section className="space-y-2 pt-1">
        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="w-full min-h-[46px] rounded-full bg-[#10b981] hover:bg-[#006c49] text-white font-headline-sm text-[15px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-transform duration-500 ${
              isRecalculating ? 'rotate-180 animate-spin' : ''
            }`}
          >
            cached
          </span>
          <span>
            {isRecalculating ? 'Recalibrating Bio-metrics...' : 'Recalculate Metabolic Targets'}
          </span>
        </button>

        <p className="text-center font-label-sm text-[11px] text-[#6c7a71]">
          Last synced with Aura Diagnostics {lastSyncedText}
        </p>

        {/* Micro Feedback Banner */}
        {showRecalcToast && (
          <div className="rounded-lg bg-[#10b981] text-white p-3 flex items-center justify-between shadow-md transition-all">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
              <span className="font-label-md text-[12px] font-semibold">
                Targets calibrated! Macro ratios refreshed.
              </span>
            </div>
            <button
              onClick={() => setShowRecalcToast(false)}
              className="text-white opacity-80 hover:opacity-100 p-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
