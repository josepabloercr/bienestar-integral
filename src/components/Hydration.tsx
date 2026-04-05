import React from 'react';
import { HydrationLog } from '../types';
import { cn } from '../lib/utils';

interface HydrationProps {
  hydrationLogs: HydrationLog[];
  setHydrationLogs: React.Dispatch<React.SetStateAction<HydrationLog[]>>;
  reminders: string[];
}

export default function Hydration({ hydrationLogs, setHydrationLogs, reminders }: HydrationProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = hydrationLogs.filter(log => log.date === today);
  const todayAmount = todayLogs.reduce((sum, log) => sum + log.amount, 0);
  
  const goal = 2500;
  const percent = Math.min(Math.round((todayAmount / goal) * 100), 100);

  const addWater = (amount: number) => {
    const now = new Date();
    const newLog: HydrationLog = {
      id: Date.now().toString(),
      date: today,
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      amount
    };
    setHydrationLogs(prev => [...prev, newLog]);
  };

  const deleteLog = (id: string) => {
    setHydrationLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div className="space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2 block">Bienestar Integral</span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Hidratación</h2>
        </div>
        <div className="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">calendar_today</span>
          <span className="font-bold text-sm tracking-wide">HOY, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Card */}
        <section className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="6"></circle>
              <circle 
                className="text-primary transition-all duration-1000" 
                cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" 
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * percent) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl md:text-7xl font-extrabold tracking-tighter">{(todayAmount/1000).toFixed(1)}<span className="text-2xl text-primary ml-1">L</span></span>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-2">Objetivo: {(goal/1000).toFixed(1)}L</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{percent}%</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Completado</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-2xl font-bold text-tertiary">{Math.max(0, goal - todayAmount)}ml</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Restante</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{Math.floor(todayAmount / 250)}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vasos</p>
            </div>
          </div>
        </section>

        {/* Quick Log & Reminders */}
        <section className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Registro Rápido
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[250, 500, 750].map((ml) => (
                  <button 
                    key={ml}
                    onClick={() => addWater(ml)}
                    className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg hover:bg-primary-container transition-all group border border-white/5 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-primary mb-2">local_drink</span>
                    <span className="font-bold">{ml}ml</span>
                  </button>
                ))}
                <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg shadow-lg active:scale-95 transition-all">
                  <span className="material-symbols-outlined mb-2">edit</span>
                  <span className="font-bold">Personalizar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">notifications_active</span>
              Recordatorios
            </h3>
            <div className="flex flex-wrap gap-2">
              {(reminders || []).length > 0 ? (reminders || []).map((time, i) => (
                <div key={i} className="px-3 py-1.5 bg-surface-container-highest rounded-full text-xs font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">alarm</span>
                  {time}
                </div>
              )) : (
                <p className="text-xs text-on-surface-variant italic">Configura recordatorios en tu perfil.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* History Section */}
      <section className="bg-surface-container-low rounded-xl p-8 border border-white/5">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-tertiary rounded-full"></span>
          Historial de Hoy
        </h3>
        <div className="space-y-4">
          {todayLogs.length > 0 ? todayLogs.slice().reverse().map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-surface-container-high rounded-lg group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <p className="font-bold">{log.amount} ml</p>
                  <p className="text-xs text-on-surface-variant">{log.time}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteLog(log.id)}
                className="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          )) : (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-lg">
              <p className="text-on-surface-variant">Aún no has registrado agua hoy.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
