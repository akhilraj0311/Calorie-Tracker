import React, { useState } from 'react';
import { ASSETS, FOOD_DATABASE } from '../data/mockData';
import { MealEntry, ScreenType } from '../types/nutrition';

interface FoodLogScreenProps {
  onAddMeal: (meal: MealEntry) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const FoodLogScreen: React.FC<FoodLogScreenProps> = ({ onAddMeal, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('Rosemary Herb Chicken & Sweet Potato');
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Dinner');
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const [portionGrams, setPortionGrams] = useState(280);
  const [activeUnit, setActiveUnit] = useState<'g' | 'oz' | '1/2 cup' | '1 cup'>('g');
  const [prepNotes, setPrepNotes] = useState('Roasted with 1 tbsp olive oil, extra rosemary salt');
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const currentFood = FOOD_DATABASE[selectedFoodIndex] || FOOD_DATABASE[0];

  // Dynamic calculations based on grams
  const ratio = portionGrams / 100;
  const currentCalories = Math.round(currentFood.kcalPer100g * ratio);
  const currentProtein = Math.round(currentFood.proteinPer100g * ratio);
  const currentCarbs = Math.round(currentFood.carbsPer100g * ratio);
  const currentFats = Math.round(currentFood.fatsPer100g * ratio);

  const currentSodium = Math.round(currentFood.sodiumPer100g * ratio);
  const currentPotassium = Math.round(currentFood.potassiumPer100g * ratio);
  const currentIron = +(currentFood.ironPer100g * ratio).toFixed(1);

  const servings = (portionGrams / currentFood.baseGrams).toFixed(1);

  const handleUnitPreset = (grams: number, unitLabel: 'g' | 'oz' | '1/2 cup' | '1 cup') => {
    setPortionGrams(grams);
    setActiveUnit(unitLabel);
  };

  const handleAddMeal = () => {
    setIsLogging(true);
    setTimeout(() => {
      setIsLogging(false);
      setLogSuccess(true);

      const newEntry: MealEntry = {
        id: `meal-${selectedMealType.toLowerCase()}-${Date.now()}`,
        name: currentFood.name,
        mealType: selectedMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        calories: currentCalories,
        protein: currentProtein,
        carbs: currentCarbs,
        fats: currentFats,
        time: selectedMealType === 'Breakfast' ? '8:30 AM' : selectedMealType === 'Lunch' ? '1:00 PM' : selectedMealType === 'Dinner' ? '7:45 PM' : '4:30 PM',
        image: currentFood.image,
        notes: prepNotes,
      };

      setTimeout(() => {
        onAddMeal(newEntry);
        onNavigate('today');
      }, 800);
    }, 600);
  };

  const filteredFoods = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-3">
      {/* Undo Alert Notification Toast */}
      {showToast && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#283044] text-[#eef0ff] rounded-xl shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              check_circle
            </span>
            <span className="font-body-sm text-[12px] truncate">
              Removed "Avocado Sourdough Toast"
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              className="font-label-sm text-[11px] font-semibold text-[#6ffbbe] hover:text-[#4edea3] px-2 py-1 transition-colors"
              onClick={() => setShowToast(false)}
              type="button"
            >
              UNDO
            </button>
            <button
              className="p-1 text-[#bbcabf] hover:text-[#eef0ff] rounded-full transition-colors flex items-center justify-center"
              onClick={() => setShowToast(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Assistant Toast Feedback */}
      {voiceToast && (
        <div className="px-4 py-2.5 bg-[#10b981] text-white rounded-xl shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">mic</span>
            <span className="text-[12px] font-medium">{voiceToast}</span>
          </div>
          <button onClick={() => setVoiceToast(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Search & Input Toolbar */}
      <section className="flex flex-col gap-2">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[#6c7a71] text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-10 bg-white text-[#131b2e] font-body-md text-[14px] rounded-xl shadow-sm border border-[#e2e7ff] placeholder:text-[#6c7a71] focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all"
            placeholder="Search food, brand, or restaurant..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 text-[#6c7a71] hover:text-[#131b2e] transition-colors flex items-center justify-center p-1"
              onClick={() => setSearchQuery('')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Search Results Dropdown (if user searches) */}
        {searchQuery.trim().length > 0 &&
          searchQuery !== 'Rosemary Herb Chicken & Sweet Potato' &&
          filteredFoods.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-[#dae2fd] p-1.5 space-y-1">
              {filteredFoods.map((food, idx) => (
                <div
                  key={food.name}
                  onClick={() => {
                    setSelectedFoodIndex(FOOD_DATABASE.findIndex((f) => f.name === food.name));
                    setSearchQuery(food.name);
                    setPortionGrams(food.baseGrams);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-[#f2f3ff] rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-headline-sm text-[13px] text-[#131b2e] truncate">{food.name}</p>
                    <p className="text-[11px] text-[#6c7a71]">{Math.round(food.kcalPer100g * 2)} kcal per serving</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#006c49]">Select</span>
                </div>
              ))}
            </div>
          )}

        {/* Quick Logging Pill Actions */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onNavigate('scan-ai')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] text-white rounded-full shadow-sm shrink-0 transition-transform active:scale-95 hover:bg-[#006c49]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span className="font-label-sm text-[11px] font-semibold">AI Photo</span>
          </button>

          <button
            onClick={() => {
              setVoiceToast('Barcode simulated: GS1 scanned "Organic Pasture Herb Chicken"');
              setTimeout(() => setVoiceToast(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#3c4a42] hover:text-[#131b2e] rounded-full shadow-sm border border-[#e2e7ff] shrink-0 transition-transform active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
            <span className="font-label-sm text-[11px]">Barcode</span>
          </button>

          <button
            onClick={() => {
              setVoiceToast('Voice recognized: "Added 280g Rosemary Herb Chicken with yams"');
              setTimeout(() => setVoiceToast(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#3c4a42] hover:text-[#131b2e] rounded-full shadow-sm border border-[#e2e7ff] shrink-0 transition-transform active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span className="font-label-sm text-[11px]">Voice</span>
          </button>

          <button
            onClick={() => {
              setVoiceToast('Filtered by your frequently logged favorites');
              setTimeout(() => setVoiceToast(null), 3000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#3c4a42] hover:text-[#131b2e] rounded-full shadow-sm border border-[#e2e7ff] shrink-0 transition-transform active:scale-95"
            type="button"
          >
            <span
              className="material-symbols-outlined text-[16px] text-[#e29100]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-label-sm text-[11px]">Favorites</span>
          </button>

          <button
            onClick={() => {
              const customName = prompt('Enter manual food name:');
              if (customName) setSearchQuery(customName);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#3c4a42] hover:text-[#131b2e] rounded-full shadow-sm border border-[#e2e7ff] shrink-0 transition-transform active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span className="font-label-sm text-[11px]">Manual</span>
          </button>
        </div>
      </section>

      {/* Meal Type Segmented Tabs */}
      <section className="py-1">
        <div className="p-1 bg-[#f2f3ff] rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar border border-[#e2e7ff]">
          {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const).map((mealName) => {
            const isSelected = selectedMealType === mealName;
            const kcal =
              mealName === 'Breakfast'
                ? '480 kcal'
                : mealName === 'Lunch'
                ? '640 kcal'
                : mealName === 'Dinner'
                ? '520 kcal'
                : '220 kcal';

            return (
              <button
                key={mealName}
                onClick={() => setSelectedMealType(mealName)}
                className={`flex-1 min-w-[76px] py-1.5 px-2 rounded-lg text-center font-label-sm text-[11px] transition-all ${
                  isSelected
                    ? 'bg-white text-[#131b2e] font-semibold shadow-sm'
                    : 'text-[#6c7a71] hover:text-[#131b2e]'
                }`}
                type="button"
              >
                <span className="block truncate">{mealName}</span>
                <span
                  className={`block text-[10px] mt-0.5 ${
                    isSelected ? 'text-[#10b981] font-semibold' : 'opacity-80'
                  }`}
                >
                  {kcal}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Selected Item Card */}
      <section className="py-1">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff] flex flex-col gap-4">
          {/* Item Identity Header */}
          <div className="flex gap-4 items-start">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm bg-[#eaedff]">
              <img
                className="w-full h-full object-cover"
                alt={currentFood.name}
                src={currentFood.image}
              />
              {currentFood.isBio && (
                <div className="absolute bottom-1 right-1 bg-white/95 px-1 rounded text-[10px] font-semibold text-[#006c49] shadow-sm">
                  BIO
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#10b981]/10 text-[#006c49] rounded-full mb-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span className="font-label-sm text-[10px] font-semibold">
                  98% Match • Fresh Cooked
                </span>
              </div>
              <h2 className="font-headline-sm text-[15px] text-[#131b2e] font-semibold truncate">
                {currentFood.name}
              </h2>
              <p className="font-body-sm text-[12px] text-[#6c7a71] mt-0.5 line-clamp-2">
                {currentFood.description}
              </p>
            </div>
          </div>

          {/* Quantity & Serving Calibrator */}
          <div className="bg-[#f2f3ff] rounded-xl p-3.5 flex flex-col gap-2 border border-[#e2e7ff]">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-metric-lg text-[28px] text-[#131b2e] font-bold tracking-tight">
                  {portionGrams}
                </span>
                <span className="font-body-md text-[14px] text-[#6c7a71] font-medium">
                  {activeUnit === 'oz' ? `oz (${portionGrams}g)` : 'g'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[15px] text-[#006c49]">
                  pie_chart
                </span>
                <span className="font-label-sm text-[11px] font-semibold text-[#131b2e]">
                  {servings} Servings
                </span>
              </div>
            </div>

            {/* Smooth Calibration Slider */}
            <div className="flex flex-col gap-1 pt-1">
              <input
                className="w-full h-2 bg-[#dae2fd] rounded-full appearance-none cursor-pointer accent-[#10b981]"
                max="500"
                min="100"
                step="10"
                type="range"
                value={portionGrams}
                onChange={(e) => setPortionGrams(Number(e.target.value))}
              />
              <div className="flex justify-between items-center px-0.5 font-label-sm text-[10px] text-[#6c7a71]">
                <span>100g (Min)</span>
                <span className="text-[#131b2e] font-medium">200g (Standard)</span>
                <span>500g (Max)</span>
              </div>
            </div>

            {/* Unit Switcher Pills */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <button
                className={`flex-1 py-1 px-2 rounded-lg font-label-sm text-[11px] text-center shadow-sm active:scale-95 transition-transform ${
                  activeUnit === '1/2 cup'
                    ? 'bg-[#10b981] text-white font-semibold'
                    : 'bg-white text-[#6c7a71] hover:text-[#131b2e]'
                }`}
                onClick={() => handleUnitPreset(140, '1/2 cup')}
                type="button"
              >
                1/2 cup
              </button>
              <button
                className={`flex-1 py-1 px-2 rounded-lg font-label-sm text-[11px] text-center shadow-sm active:scale-95 transition-transform ${
                  activeUnit === '1 cup'
                    ? 'bg-[#10b981] text-white font-semibold'
                    : 'bg-white text-[#6c7a71] hover:text-[#131b2e]'
                }`}
                onClick={() => handleUnitPreset(240, '1 cup')}
                type="button"
              >
                1 cup
              </button>
              <button
                className={`flex-1 py-1 px-2 rounded-lg font-label-sm text-[11px] text-center shadow-sm active:scale-95 transition-transform ${
                  activeUnit === 'g'
                    ? 'bg-[#10b981] text-white font-semibold'
                    : 'bg-white text-[#6c7a71] hover:text-[#131b2e]'
                }`}
                onClick={() => handleUnitPreset(280, 'g')}
                type="button"
              >
                Grams (g)
              </button>
              <button
                className={`flex-1 py-1 px-2 rounded-lg font-label-sm text-[11px] text-center shadow-sm active:scale-95 transition-transform ${
                  activeUnit === 'oz'
                    ? 'bg-[#10b981] text-white font-semibold'
                    : 'bg-white text-[#6c7a71] hover:text-[#131b2e]'
                }`}
                onClick={() => handleUnitPreset(283, 'oz')}
                type="button"
              >
                Ounces (oz)
              </button>
            </div>
          </div>

          {/* Preparation & Culinary Notes */}
          <div className="flex flex-col gap-1.5">
            <label
              className="font-label-sm text-[11px] text-[#6c7a71] uppercase tracking-wider font-semibold"
              htmlFor="prepNotes"
            >
              Preparation Notes
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full h-9 px-3 bg-[#f2f3ff] text-[#131b2e] font-body-sm text-[12px] rounded-lg border border-[#e2e7ff] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                id="prepNotes"
                type="text"
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
              />
              <span className="material-symbols-outlined text-[#6c7a71] text-[16px] absolute right-2.5 pointer-events-none">
                edit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Specs Breakdown */}
      <section className="py-1 flex flex-col gap-2">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e7ff] flex flex-col gap-4">
          {/* Energy Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-[11px] text-[#6c7a71] uppercase tracking-wider font-semibold">
                Total Caloric Load
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-metric-xl text-[38px] font-bold text-[#131b2e] tracking-tight">
                  {currentCalories}
                </span>
                <span className="font-body-md text-[14px] text-[#6c7a71]">kcal</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="px-2.5 py-1 bg-[#f2f3ff] text-[#00687a] font-label-sm text-[11px] rounded-full font-semibold border border-[#e2e7ff]">
                {Math.round((currentCalories / 2000) * 100)}% of Daily Target
              </div>
              <span className="font-label-sm text-[11px] text-[#6c7a71] mt-1">Goal: 2,000 kcal</span>
            </div>
          </div>

          {/* Macro Split Bars */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Protein */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-sm text-[11px]">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                  Protein
                </span>
                <span className="text-[#131b2e] font-semibold">
                  {currentProtein}g{' '}
                  <span className="text-[#6c7a71] font-normal text-[11px]">(35%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b981] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentProtein / 55) * 100))}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-sm text-[11px]">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6]"></span>
                  Carbohydrates
                </span>
                <span className="text-[#131b2e] font-semibold">
                  {currentCarbs}g{' '}
                  <span className="text-[#6c7a71] font-normal text-[11px]">(29%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4cd7f6] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentCarbs / 55) * 100))}%` }}
                />
              </div>
            </div>

            {/* Dietary Fats */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-sm text-[11px]">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f]"></span>
                  Dietary Fats
                </span>
                <span className="text-[#131b2e] font-semibold">
                  {currentFats}g{' '}
                  <span className="text-[#6c7a71] font-normal text-[11px]">(24%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffb95f] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentFats / 30) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Micronutrient Diagnostic Cards */}
          <div className="pt-2">
            <span className="font-label-sm text-[11px] text-[#6c7a71] uppercase tracking-wider font-semibold block mb-2">
              Key Micronutrients
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#f2f3ff] p-2.5 rounded-xl flex flex-col justify-between border border-[#e2e7ff]">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-[#6c7a71]">Sodium</span>
                  <span className="material-symbols-outlined text-[14px] text-[#00687a]">
                    water_drop
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-[16px] font-semibold text-[#131b2e] block">
                    {currentSodium}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-label-sm text-[10px] text-[#6c7a71]">mg</span>
                    <span className="font-label-sm text-[10px] text-[#006c49] font-semibold">
                      {Math.round((currentSodium / 2300) * 100)}% DV
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f2f3ff] p-2.5 rounded-xl flex flex-col justify-between border border-[#e2e7ff]">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-[#6c7a71]">Potassium</span>
                  <span className="material-symbols-outlined text-[14px] text-[#10b981]">bolt</span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-[16px] font-semibold text-[#131b2e] block">
                    {currentPotassium}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-label-sm text-[10px] text-[#6c7a71]">mg</span>
                    <span className="font-label-sm text-[10px] text-[#006c49] font-semibold">
                      {Math.round((currentPotassium / 2600) * 100)}% DV
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f2f3ff] p-2.5 rounded-xl flex flex-col justify-between border border-[#e2e7ff]">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-[#6c7a71]">Iron</span>
                  <span className="material-symbols-outlined text-[14px] text-[#e29100]">
                    vital_signs
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-[16px] font-semibold text-[#131b2e] block">
                    {currentIron}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-label-sm text-[10px] text-[#6c7a71]">mg</span>
                    <span className="font-label-sm text-[10px] text-[#006c49] font-semibold">
                      {Math.round((currentIron / 18) * 100)}% DV
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action CTA Panel */}
      <section className="pt-2 pb-1">
        <button
          className={`w-full h-12 rounded-full shadow-md flex items-center justify-between px-6 transition-all active:scale-98 ${
            logSuccess
              ? 'bg-[#006c49] text-white'
              : 'bg-[#10b981] hover:bg-[#006c49] text-white'
          }`}
          onClick={handleAddMeal}
          disabled={isLogging}
          type="button"
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                isLogging ? 'animate-spin' : ''
              }`}
            >
              {isLogging ? 'sync' : logSuccess ? 'check_circle' : 'add_circle'}
            </span>
            <span className="font-headline-sm text-[15px] font-semibold tracking-tight">
              {isLogging
                ? `Logging to ${selectedMealType}...`
                : logSuccess
                ? 'Item Added Successfully!'
                : `Add to ${selectedMealType} Log`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-headline-sm text-[15px] font-semibold">
              {currentCalories} kcal
            </span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </button>
      </section>
    </div>
  );
};
