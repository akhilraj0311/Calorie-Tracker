export type ScreenType = 'today' | 'food-log' | 'scan-ai' | 'weekly-insights' | 'goals-and-profile';

export interface MacroSplit {
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  subtitle: string;
  portion: number; // in grams
  portionMin: number;
  portionMax: number;
  calories: number;
  macro: string;
  icon: string;
  accentColor: string;
}

export interface MealEntry {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time?: string;
  image?: string;
  aiScanned?: boolean;
  planned?: boolean;
  notes?: string;
}

export interface UserProfile {
  name: string;
  tier: string;
  avatarUrl: string;
  streakDays: number;
  adherenceRate: number;
  totalMealsLogged: number;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  activityDetail: string;
  metabolicGoal: 'maintenance' | 'deficit' | 'surplus';
  targetCalories: number;
  bmr: number;
  expenditure: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  waterGoalLitres: number;
  appleHealthSync: boolean;
  smartReminders: boolean;
  aiScanSensitivity: boolean;
}

export interface DayMetric {
  day: string;
  dateStr: string;
  calories: number;
  target: number;
  water: number;
  compliant: boolean;
}
