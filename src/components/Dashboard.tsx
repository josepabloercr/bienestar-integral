import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { WeightLog, MealLog, HydrationLog, UserProfile } from '../types';
import { getMotivationalQuote } from '../services/geminiService';

interface DashboardProps {
  weightLogs: WeightLog[];
  mealLogs: MealLog[];
  hydrationLogs: HydrationLog[];
  userProfile: UserProfile;
}

export default function Dashboard({ weightLogs, mealLogs, hydrationLogs, userProfile }: DashboardProps) {
  const [quote, setQuote] = useState("La base de toda la felicidad es la salud.");
  
  useEffect(() => {
    getMotivationalQuote().then(setQuote);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  
  // Merge profile weight into logs for display if it's more recent
  const displayWeightLogs = [...weightLogs];
  const lastLogDate = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].date : '';
  if (today > lastLogDate) {
    displayWeightLogs.push({ date: today, weight: userProfile.weight });
  } else if (today === lastLogDate && weightLogs.length > 0) {
    displayWeightLogs[displayWeightLogs.length - 1].weight = userProfile.weight;
  }

  const todayHydration = hydrationLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);
  
  const hydrationGoal = 3000; // 3L
  const hydrationPercent = Math.min(Math.round((todayHydration / hydrationGoal) * 100), 100);

  const todayMeals = mealLogs.filter(log => log.date === today);
  const consumedCalories = todayMeals.reduce((sum, log) => sum + log.calories, 0);
  const calorieGoal = 2500; // Example goal

  return (
    <div className="space-y-8">
      {/* Hero Section: Quote */}
      <section className="relative overflow-hidden rounded-lg p-6 lg:p-12 bg-surface-container-low min-h-[220px] md:min-h-[300px] flex items-center">
        <div className="max-w-2xl relative z-10">
          <span className="text-[0.65rem] lg:text-[0.75rem] uppercase tracking-[0.2em] text-secondary font-bold mb-2 lg:mb-4 block">Inspiración Diaria</span>
          <h2 className="text-2xl md:text-3xl lg:text-[3.5rem] leading-tight font-extrabold tracking-tight text-on-background mb-4 lg:mb-6 italic">
            "{quote}"
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 lg:px-8 py-2 lg:py-3 rounded-full text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">Ver Diario</button>
            <button className="bg-surface-container-high text-on-surface px-4 lg:px-8 py-2 lg:py-3 rounded-full text-sm font-bold transition-all hover:bg-surface-container-highest active:scale-95">Configurar Meta</button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full opacity-30 lg:opacity-40">
          <div className="absolute inset-0 bg-gradient-to-l from-surface via-transparent to-surface lg:to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQleXrSb66RMDwLId3j-l5g_eLxq-DyiHJQDsNQXsukDPD2zFRE54H7KJ_YIVDvdVLfwn8ZK0AeemjjC39dWYSqiBe03mwW-rOoE4aK_9cjnFx83EsMf8xE80gr4er58FMcR9uBQhPcVvM3L7IwdQ1Ku-I_cV5Jw03rsw8JgXZ6_A2Lf38OE8svFPW3w_omGvkucxAzQFAtXbzK0f-ioKeIDwUYa2IcSSzRctSZ129qHL6-6Out-vNsbMD51G75yfgClor_PVFRJo" 
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weight Progress Chart */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-lg p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-4">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold">Resumen del Progreso</h3>
              <p className="text-on-surface-variant text-xs lg:text-sm">Evolución de peso (kg) los últimos registros</p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 rounded-full bg-surface-container-highest text-[10px] lg:text-xs font-bold text-primary">Peso (kg)</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayWeightLogs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#353534" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#c5c6cd" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="#c5c6cd" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#201f1f', border: 'none', borderRadius: '8px', color: '#e5e2e1' }}
                  itemStyle={{ color: '#b4c5ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#b4c5ff" 
                  strokeWidth={3} 
                  dot={{ fill: '#b4c5ff', r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hydration Widget */}
        <div className="lg:col-span-4 bg-surface-container-low rounded-lg p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">Hidratación</h3>
          <p className="text-on-surface-variant text-xs lg:text-sm mb-6 lg:mb-8">Meta diaria: {(hydrationGoal/1000).toFixed(1)} Litros</p>
          
          <div className="relative w-36 h-36 lg:w-48 lg:h-48 mb-6 lg:mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle className="text-surface-container-highest" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
              <circle 
                className="text-primary transition-all duration-1000" 
                cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" 
                strokeWidth="12"
                strokeDasharray={502.65}
                strokeDashoffset={502.65 - (502.65 * hydrationPercent) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl lg:text-4xl font-extrabold text-primary">{(todayHydration/1000).toFixed(1)}</span>
              <span className="text-[8px] lg:text-xs uppercase tracking-widest text-on-surface-variant">Lts logrados</span>
            </div>
          </div>
          
          <div className="w-full flex gap-2">
            <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest py-2.5 lg:py-3 rounded-full text-[10px] lg:text-xs font-bold transition-all active:scale-95 shadow-md">+ 250ml</button>
            <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest py-2.5 lg:py-3 rounded-full text-[10px] lg:text-xs font-bold transition-all active:scale-95 shadow-md">+ 500ml</button>
          </div>
        </div>
      </div>

      {/* Daily Meals Summary */}
      <section className="bg-surface-container-low rounded-lg p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">Comidas de Hoy</h3>
          <div className="text-sm font-bold text-on-surface-variant">
            <span className="text-secondary">{consumedCalories}</span> / {calorieGoal} kcal
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Desayuno', 'Almuerzo', 'Cena', 'Snacks'].map((type) => {
            const meal = todayMeals.find(m => m.type.toLowerCase() === type.toLowerCase().replace('s', ''));
            return (
              <div key={type} className="bg-surface-container-high p-4 rounded-lg flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{type}</span>
                  {meal && <span className="text-xs font-bold text-primary">{meal.calories} kcal</span>}
                </div>
                {meal ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">restaurant</span>
                    </div>
                    <span className="text-sm font-medium truncate">{meal.name}</span>
                  </div>
                ) : (
                  <button className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span className="text-sm">Registrar</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
