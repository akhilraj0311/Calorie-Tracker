import React, { useState, useRef } from 'react';
import { ASSETS, INITIAL_INGREDIENTS } from '../data/mockData';
import { Ingredient, MealEntry } from '../types/nutrition';

interface ScanAiScreenProps {
  onConfirmMeal: (meal: MealEntry) => void;
  onNavigateBack: () => void;
}

export const ScanAiScreen: React.FC<ScanAiScreenProps> = ({ onConfirmMeal, onNavigateBack }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [mealTitle, setMealTitle] = useState('Mediterranean Wild Salmon Bowl');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemGrams, setCustomItemGrams] = useState(50);
  const [currentImage, setCurrentImage] = useState<string>(ASSETS.mediterraneanSalmonLive);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic calculations based on ingredients portions
  // Wild salmon: ~1.88 kcal/g
  // Quinoa: ~1.42 kcal/g
  // Avocado: ~1.6 kcal/g
  // EVOO dressing: ~5.5 kcal/g
  const totalCalories = Math.round(
    ingredients.reduce((acc, ing) => {
      if (ing.id === 'ing-1') return acc + (ing.portion * 340) / 180;
      if (ing.id === 'ing-2') return acc + (ing.portion * 170) / 120;
      if (ing.id === 'ing-3') return acc + (ing.portion * 80) / 50;
      if (ing.id === 'ing-4') return acc + (ing.portion * 55) / 10;
      return acc + ing.portion * 1.5;
    }, 0)
  );

  const totalProtein = Math.round(
    ingredients.reduce((acc, ing) => {
      if (ing.id === 'ing-1') return acc + (ing.portion * 34) / 180;
      if (ing.id === 'ing-2') return acc + (ing.portion * 5) / 120;
      if (ing.id === 'ing-3') return acc + (ing.portion * 1.5) / 50;
      return acc;
    }, 0)
  );

  const totalCarbs = Math.round(
    ingredients.reduce((acc, ing) => {
      if (ing.id === 'ing-2') return acc + (ing.portion * 28) / 120;
      if (ing.id === 'ing-3') return acc + (ing.portion * 4.5) / 50;
      return acc;
    }, 0)
  );

  const totalFats = Math.round(
    ingredients.reduce((acc, ing) => {
      if (ing.id === 'ing-1') return acc + (ing.portion * 13) / 180;
      if (ing.id === 'ing-3') return acc + (ing.portion * 7.5) / 50;
      if (ing.id === 'ing-4') return acc + (ing.portion * 6) / 10;
      return acc;
    }, 0)
  );

  const totalFiber = +(
    ingredients.reduce((acc, ing) => {
      if (ing.id === 'ing-2') return acc + (ing.portion * 3.5) / 120;
      if (ing.id === 'ing-3') return acc + (ing.portion * 3.7) / 50;
      return acc;
    }, 0)
  ).toFixed(1);

  const totalWeight = ingredients.reduce((acc, ing) => acc + ing.portion, 0);

  const handlePortionChange = (id: string, newPortion: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const ratio = newPortion / (item.id === 'ing-1' ? 180 : item.id === 'ing-2' ? 120 : item.id === 'ing-3' ? 50 : 10);
          const baseCal = item.id === 'ing-1' ? 340 : item.id === 'ing-2' ? 170 : item.id === 'ing-3' ? 80 : 55;
          return {
            ...item,
            portion: newPortion,
            calories: Math.round(baseCal * ratio),
          };
        }
        return item;
      })
    );
  };

  const handleConfirm = () => {
    setIsLogging(true);
    setTimeout(() => {
      setIsLogging(false);
      setLoggedSuccess(true);
      const newMeal: MealEntry = {
        id: `meal-lunch-${Date.now()}`,
        name: mealTitle,
        mealType: 'lunch',
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
        time: '1:15 PM',
        image: currentImage,
        aiScanned: true,
        notes: `${ingredients.map((i) => `${i.name} (${i.portion}g)`).join(', ')}`,
      };
      setTimeout(() => {
        onConfirmMeal(newMeal);
      }, 900);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImage(url);
      setMealTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Custom Scanned Meal');
    }
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    const newItem: Ingredient = {
      id: `ing-${Date.now()}`,
      name: customItemName.trim(),
      subtitle: 'Fresh addition • Whole food',
      portion: customItemGrams,
      portionMin: 10,
      portionMax: 200,
      calories: Math.round(customItemGrams * 1.2),
      macro: `${Math.round(customItemGrams * 0.08)}g protein`,
      icon: 'restaurant',
      accentColor: '#10b981',
    };
    setIngredients((prev) => [...prev, newItem]);
    setCustomItemName('');
    setShowAddItemModal(false);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-[#faf8ff] pb-28">
      {/* AR Viewfinder / Scan Telemetry Section */}
      <div className="relative w-full aspect-[4/3] max-h-[380px] overflow-hidden bg-[#283044] text-[#eef0ff] select-none">
        {/* Camera Viewfinder Live Image */}
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105 transition-all duration-300"
          alt="Top down overhead close-up shot of meal"
          src={currentImage}
        />

        {/* Flash Simulation */}
        {flashActive && (
          <div className="absolute inset-0 bg-white/60 pointer-events-none transition-opacity duration-300 z-30" />
        )}

        {/* Camera Ambient Dark Scrims */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#283044]/80 via-transparent to-[#283044]/90 pointer-events-none" />

        {/* Top Viewfinder Telemetry Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10b981] text-[#00422b] font-label-sm text-[11px] font-semibold shadow-sm backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              AI Vision Pro
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#283044]/70 text-[#eef0ff]/90 font-label-sm text-[11px] backdrop-blur-md">
              <span className="material-symbols-outlined text-[13px]">shutter_speed</span>
              f/1.8 • ISO 160
            </span>
            <span className="hidden xs:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#283044]/70 text-[#eef0ff]/90 font-label-sm text-[11px] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              Optimal Lux
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Library / Upload Photo */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              aria-label="Upload photo from library"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full bg-[#283044]/70 hover:bg-[#283044]/90 text-[#eef0ff] transition-colors backdrop-blur-md"
              type="button"
              title="Upload custom meal photo"
            >
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
            </button>

            {/* Toggle camera flash */}
            <button
              aria-label="Toggle camera flash"
              onClick={() => {
                setFlashActive(true);
                setTimeout(() => setFlashActive(false), 300);
              }}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition-colors backdrop-blur-md ${
                flashActive
                  ? 'bg-[#10b981] text-white'
                  : 'bg-[#283044]/70 hover:bg-[#283044]/90 text-[#eef0ff]'
              }`}
              type="button"
              title="Simulate Camera Flash"
            >
              <span className="material-symbols-outlined text-[18px]">flash_on</span>
            </button>
          </div>
        </div>

        {/* AR Bounding Box & Recognition Reticles */}
        <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-center items-center">
          {/* Outer HUD Bounding Ring */}
          <div className="relative w-64 h-48 sm:w-80 sm:h-56 rounded-2xl flex items-center justify-center">
            {/* AR Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 rounded-tl-xl bg-transparent shadow-[-2px_-2px_0_2px_#4edea3]"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-tr-xl bg-transparent shadow-[2px_-2px_0_2px_#4edea3]"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-bl-xl bg-transparent shadow-[-2px_2px_0_2px_#4edea3]"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-br-xl bg-transparent shadow-[2px_2px_0_2px_#4edea3]"></div>

            {/* Target Scan Radial Grid Overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35 animate-pulse"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <line
                stroke="#4edea3"
                strokeDasharray="2,2"
                strokeWidth="0.5"
                x1="50"
                x2="50"
                y1="0"
                y2="100"
              />
              <line
                stroke="#4edea3"
                strokeDasharray="2,2"
                strokeWidth="0.5"
                x1="0"
                x2="100"
                y1="50"
                y2="50"
              />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="30"
                stroke="#4edea3"
                strokeDasharray="3,3"
                strokeWidth="0.5"
              />
            </svg>

            {/* Dynamic AR Tracking Badges Inside Reticle */}
            <div className="absolute -top-4 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#131b2e] shadow-md backdrop-blur-md flex items-center gap-1.5 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-ping"></span>
              <span className="font-label-sm text-[11px] font-semibold text-[#006c49]">
                Target Acquired
              </span>
            </div>

            <div className="absolute -bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#00687a] text-white shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">view_in_ar</span>
              <span className="font-label-sm text-[11px] font-semibold">
                Vol: {totalWeight}g ± 15g
              </span>
            </div>

            {/* Floating Item Detection Pointers */}
            <div className="absolute top-8 left-6 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#283044]/80 text-[#eef0ff] text-[10px] font-medium backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              Salmon ({ingredients.find((i) => i.id === 'ing-1')?.portion || 180}g)
            </div>
            <div className="absolute bottom-9 left-12 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#283044]/80 text-[#eef0ff] text-[10px] font-medium backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
              Quinoa ({ingredients.find((i) => i.id === 'ing-2')?.portion || 120}g)
            </div>
            <div className="absolute top-12 right-6 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#283044]/80 text-[#eef0ff] text-[10px] font-medium backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]"></span>
              Avocado ({ingredients.find((i) => i.id === 'ing-3')?.portion || 50}g)
            </div>
          </div>
        </div>

        {/* Real-time AI Confidence Capsule */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#283044]/80 backdrop-blur-md text-[#eef0ff] shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">verified</span>
            <span className="font-label-sm text-[11px] font-semibold tracking-wide text-[#4edea3]">
              98.4% Match
            </span>
            <span className="text-[#eef0ff]/60 text-[10px]">
              • {ingredients.length} Ingredients Identified
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#283044]/80 text-[#eef0ff]/90 text-[11px] font-label-sm">
            <span className="material-symbols-outlined text-[14px] text-[#ffddb8]">bolt</span>
            <span>0.14s Latency</span>
          </div>
        </div>
      </div>

      {/* AI Nutrition Analysis Sheet / Interactive Drawer */}
      <div className="flex flex-col w-full bg-white rounded-t-3xl -mt-4 relative z-20 shadow-xl px-4 pt-4 pb-8 space-y-4 border-t border-[#eaedff]">
        {/* Drawer Drag Affordance Handle */}
        <div className="self-center w-12 h-1 rounded-full bg-[#dae2fd] mb-1"></div>

        {/* Verification Pill & Timestamp */}
        <div className="flex items-center justify-between gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#3c4a42]">
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">cloud_done</span>
            <span className="font-label-sm text-[11px] font-medium">
              Verified with USDA FoodData Central
            </span>
          </div>
          <span className="font-label-sm text-[11px] text-[#6c7a71]">Today, 1:15 PM</span>
        </div>

        {/* Dish Title Header with Edit CTA */}
        <div className="flex items-start justify-between gap-2 pt-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={mealTitle}
                  onChange={(e) => setMealTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="font-headline-lg text-[22px] text-[#131b2e] font-semibold tracking-tight border-b-2 border-[#10b981] bg-transparent outline-none w-full"
                />
              ) : (
                <h2 className="font-headline-lg text-[22px] text-[#131b2e] font-semibold tracking-tight truncate">
                  {mealTitle}
                </h2>
              )}
              <button
                aria-label="Edit meal title"
                onClick={() => setIsEditingTitle(!isEditingTitle)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#6c7a71] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <p className="font-body-sm text-[12px] text-[#3c4a42] mt-0.5">
              High-protein vitality lunch • Omega-3 fortified • Clean carbs
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-label-sm text-[11px] font-semibold shrink-0">
            Meal: Lunch
          </div>
        </div>

        {/* Core Telemetry Metric Banner (Caloric Output & Progress Arc) */}
        <div className="w-full bg-[#f2f3ff] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-[#e2e7ff]">
          <div className="flex flex-col">
            <span className="font-label-md text-[12px] text-[#3c4a42] uppercase tracking-wider font-semibold">
              Total Caloric Estimate
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display-hero-mobile text-[36px] text-[#131b2e] font-bold">
                {totalCalories}
              </span>
              <span className="font-headline-sm text-[16px] text-[#3c4a42] font-medium">kcal</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#10b981] text-[#00422b] font-label-sm text-[11px] font-semibold">
                {Math.round((totalCalories / 2000) * 100)}% of 2,000 kcal
              </span>
              <span className="font-body-sm text-[12px] text-[#3c4a42]">Daily Budget</span>
            </div>
          </div>

          {/* Compact SVG Radial Dial Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              {/* Background Track */}
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14.5"
                stroke="#dae2fd"
                strokeDasharray="91"
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              {/* Active Calorie Arc */}
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14.5"
                stroke="#10b981"
                strokeDasharray="91"
                strokeDashoffset={91 - (91 * Math.min(100, (totalCalories / 2000) * 100)) / 100}
                strokeLinecap="round"
                strokeWidth="3.5"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-[#006c49]">
                local_fire_department
              </span>
              <span className="font-label-sm text-[10px] font-semibold text-[#131b2e]">Target</span>
            </div>
          </div>
        </div>

        {/* Macro 4-Pack Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Protein Pill Card */}
          <div className="flex flex-col p-3 rounded-xl bg-[#eaedff] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-semibold">Protein</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            </div>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="font-headline-md text-[20px] text-[#131b2e] font-semibold">
                {totalProtein}
              </span>
              <span className="font-body-sm text-[12px] text-[#3c4a42]">g</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#006c49]">High (26%)</span>
              <span className="text-[10px] text-[#6c7a71]">Target: 40g</span>
            </div>
            <div className="w-full bg-[#dae2fd] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalProtein / 40) * 100))}%` }}
              />
            </div>
          </div>

          {/* Carbs Pill Card */}
          <div className="flex flex-col p-3 rounded-xl bg-[#eaedff] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-semibold">
                Carbohydrates
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00687a]"></span>
            </div>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="font-headline-md text-[20px] text-[#131b2e] font-semibold">
                {totalCarbs}
              </span>
              <span className="font-body-sm text-[12px] text-[#3c4a42]">g</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#00687a]">Balanced (30%)</span>
              <span className="text-[10px] text-[#6c7a71]">Target: 60g</span>
            </div>
            <div className="w-full bg-[#dae2fd] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#57dffe] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalCarbs / 60) * 100))}%` }}
              />
            </div>
          </div>

          {/* Fats Pill Card */}
          <div className="flex flex-col p-3 rounded-xl bg-[#eaedff] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-semibold">
                Healthy Fats
              </span>
              <span className="w-2 h-2 rounded-full bg-[#e29100]"></span>
            </div>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="font-headline-md text-[20px] text-[#131b2e] font-semibold">
                {totalFats}
              </span>
              <span className="font-body-sm text-[12px] text-[#3c4a42]">g</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#855300]">Lipids (39%)</span>
              <span className="text-[10px] text-[#6c7a71]">Target: 25g</span>
            </div>
            <div className="w-full bg-[#dae2fd] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#e29100] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalFats / 25) * 100))}%` }}
              />
            </div>
          </div>

          {/* Dietary Fiber Card */}
          <div className="flex flex-col p-3 rounded-xl bg-[#eaedff] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#3c4a42] font-semibold">
                Dietary Fiber
              </span>
              <span className="w-2 h-2 rounded-full bg-[#6c7a71]"></span>
            </div>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="font-headline-md text-[20px] text-[#131b2e] font-semibold">
                {totalFiber}
              </span>
              <span className="font-body-sm text-[12px] text-[#3c4a42]">g</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#3c4a42]">Optimal (28%)</span>
              <span className="text-[10px] text-[#6c7a71]">Goal: 8g</span>
            </div>
            <div className="w-full bg-[#dae2fd] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#6c7a71] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((Number(totalFiber) / 8) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Deconstructed Food Items Breakdown */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
                Deconstructed Ingredients
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#3c4a42] font-label-sm text-[11px] font-semibold">
                {ingredients.length} items
              </span>
            </div>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="text-[#006c49] font-label-md text-[12px] font-semibold hover:underline flex items-center gap-0.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add Item
            </button>
          </div>

          {/* Ingredient Cards with Sliders */}
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="p-3.5 rounded-xl bg-[#f2f3ff] shadow-sm flex flex-col space-y-2 border border-[#e2e7ff]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#006c49] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{ing.icon}</span>
                  </div>
                  <div className="truncate">
                    <h3 className="font-headline-sm text-[14px] text-[#131b2e] font-semibold truncate">
                      {ing.name}
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#3c4a42]">{ing.subtitle}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-headline-sm text-[14px] text-[#131b2e] font-semibold">
                    {ing.calories} kcal
                  </span>
                  <p className="font-label-sm text-[11px] font-medium" style={{ color: ing.accentColor }}>
                    {ing.macro}
                  </p>
                </div>
              </div>

              {/* Portion Slider Controller */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-label-sm text-[11px] text-[#6c7a71] shrink-0">Portion</span>
                  <input
                    className="w-full h-1.5 bg-[#dae2fd] rounded-lg appearance-none cursor-pointer accent-[#006c49]"
                    max={ing.portionMax}
                    min={ing.portionMin}
                    type="range"
                    value={ing.portion}
                    onChange={(e) => handlePortionChange(ing.id, Number(e.target.value))}
                  />
                </div>
                <span className="font-label-md text-[12px] font-semibold text-[#131b2e] bg-[#eaedff] px-2 py-0.5 rounded shrink-0">
                  {ing.portion}g
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Nutritional Health Insight Banner */}
        <div className="p-3.5 rounded-2xl bg-[#eaedff] flex items-start gap-3 shadow-sm border border-[#dae2fd]">
          <div className="w-8 h-8 rounded-full bg-[#4edea3]/30 flex items-center justify-center text-[#006c49] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-headline-sm text-[14px] text-[#131b2e] font-semibold">
              AuraTrack Metabolic Insight
            </h4>
            <p className="font-body-sm text-[12px] text-[#3c4a42] leading-relaxed">
              This meal provides a near-ideal 1:1.1 protein-to-carb balance with healthy lipid ratios,
              stabilizing postprandial glucose curves for up to 4 hours.
            </p>
          </div>
        </div>

        {/* Action Bar / Dual Mobile CTAs */}
        <div className="pt-2 space-y-2">
          {/* Primary Affirmative Action Button */}
          <button
            onClick={handleConfirm}
            disabled={isLogging}
            className={`w-full min-h-[50px] px-4 py-3 rounded-full font-headline-sm text-[16px] font-semibold tracking-tight shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
              loggedSuccess
                ? 'bg-[#006c49] text-white'
                : 'bg-[#10b981] text-[#00422b] hover:bg-[#006c49] hover:text-white'
            }`}
            type="button"
          >
            {isLogging ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Logging Nutritional Bio-metrics...</span>
              </>
            ) : loggedSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">done_all</span>
                <span>Logged to Lunch & Daily Fuel!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Confirm & Add to Lunch Log</span>
              </>
            )}
          </button>

          {/* Secondary Retake Action */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-full bg-[#eaedff] text-[#131b2e] font-body-md text-[14px] font-medium hover:bg-[#e2e7ff] transition-colors flex items-center justify-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>Retake Photo or Scan Ingredients</span>
          </button>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold">
                Add Ingredient
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-[#6c7a71] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#3c4a42] mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Organic Baby Spinach, Feta..."
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="w-full px-3 py-2 border border-[#dae2fd] rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#10b981]"
                autoFocus
              />
            </div>

            <div>
              <div className="flex justify-between text-[12px] text-[#3c4a42] mb-1">
                <span>Portion Size</span>
                <span className="font-semibold">{customItemGrams}g</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={customItemGrams}
                onChange={(e) => setCustomItemGrams(Number(e.target.value))}
                className="w-full accent-[#006c49]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#f2f3ff] text-[#3c4a42] font-semibold text-[13px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="flex-1 py-2 rounded-xl bg-[#10b981] text-white font-semibold text-[13px] hover:bg-[#006c49]"
              >
                Add Ingredient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
