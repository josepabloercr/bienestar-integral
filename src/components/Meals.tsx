import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MealLog } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import { cn } from '../lib/utils';

interface MealsProps {
  mealLogs: MealLog[];
  setMealLogs: React.Dispatch<React.SetStateAction<MealLog[]>>;
}

export default function Meals({ mealLogs, setMealLogs }: MealsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedImage(reader.result as string);
      setIsAnalyzing(true);
      
      try {
        const analysis = await analyzeFoodImage(base64);
        const newMeal: MealLog = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: 'lunch', // Default or could be selected
          name: analysis.name,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
          image: reader.result as string,
          aiAdvice: analysis.advice
        };
        setMealLogs(prev => [newMeal, ...prev]);
      } catch (error) {
        alert("Error al analizar la imagen. Por favor intenta de nuevo.");
      } finally {
        setIsAnalyzing(false);
        setSelectedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Registro de Comidas</h2>
          <p className="text-on-surface-variant mt-2">Sube una foto de tu comida y deja que la IA la analice.</p>
        </div>
        
        <label className="relative cursor-pointer bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined">add_a_photo</span>
          Analizar Comida
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isAnalyzing} />
        </label>
      </header>

      {isAnalyzing && (
        <div className="bg-surface-container-high p-8 rounded-lg flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-bold">Analizando tu comida...</p>
          <p className="text-on-surface-variant text-sm">Nuestra IA está calculando calorías y nutrientes.</p>
          {selectedImage && (
            <img src={selectedImage} alt="Preview" className="w-48 h-48 object-cover rounded-lg mt-4 opacity-50" />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Macros Summary */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-lg p-6 space-y-8">
            <h3 className="text-xl font-bold">Nutrientes de Hoy</h3>
            <div className="space-y-6">
              {[
                { label: 'Proteína', value: mealLogs.reduce((s, m) => s + m.protein, 0), goal: 180, color: 'bg-primary' },
                { label: 'Carbos', value: mealLogs.reduce((s, m) => s + m.carbs, 0), goal: 250, color: 'bg-secondary' },
                { label: 'Grasas', value: mealLogs.reduce((s, m) => s + m.fat, 0), goal: 70, color: 'bg-tertiary' },
              ].map((macro) => (
                <div key={macro.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span>{macro.label}</span>
                    <span className="text-on-surface-variant">{macro.value}g / {macro.goal}g</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", macro.color)} 
                      style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meal History */}
        <section className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-bold">Historial Reciente</h3>
          <div className="space-y-4">
            {mealLogs.length === 0 ? (
              <div className="bg-surface-container-low p-12 rounded-lg text-center text-on-surface-variant italic">
                No hay comidas registradas hoy.
              </div>
            ) : (
              mealLogs.map((meal) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={meal.id} 
                  className="bg-surface-container-low p-6 rounded-lg flex flex-col md:flex-row gap-6"
                >
                  {meal.image && (
                    <img src={meal.image} alt={meal.name} className="w-full md:w-32 h-32 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{meal.type}</span>
                        <h4 className="text-xl font-bold">{meal.name}</h4>
                      </div>
                      <span className="text-xl font-bold text-primary">{meal.calories} kcal</span>
                    </div>
                    <div className="flex gap-4 text-xs text-on-surface-variant">
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>G: {meal.fat}g</span>
                    </div>
                    {meal.aiAdvice && (
                      <div className="mt-4 p-3 bg-surface-container-high rounded-lg border-l-4 border-secondary text-sm italic">
                        <span className="font-bold text-secondary block mb-1">Consejo IA:</span>
                        {meal.aiAdvice}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
