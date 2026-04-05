export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: 'sedentary' | 'moderate' | 'intense';
  goal: string;
  reminders: string[];
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface MealLog {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  aiAdvice?: string;
}

export interface ExerciseLog {
  id: string;
  date: string;
  dayIndex?: number;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  sets?: number;
  reps?: number;
  weightKg?: number;
  duration?: number;
  intensity: 'low' | 'moderate' | 'high';
  muscleGroup?: string;
}

export interface HydrationLog {
  id: string;
  date: string;
  time: string;
  amount: number; // in ml
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'image' | 'link';
  category: 'ejercicio' | 'comida' | 'recomendacion' | 'otro';
  date: string;
}
