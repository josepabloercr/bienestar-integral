import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseLog } from '../types';
import { cn } from '../lib/utils';

interface ActivityProps {
  exerciseLogs: ExerciseLog[];
  setExerciseLogs: React.Dispatch<React.SetStateAction<ExerciseLog[]>>;
}

export default function Activity({ exerciseLogs, setExerciseLogs }: ActivityProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'];

  const addExercise = (type: 'strength' | 'cardio') => {
    const newLog: ExerciseLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      dayIndex: selectedDayIndex,
      name: type === 'strength' ? 'Nuevo Ejercicio' : 'Nueva Actividad',
      type,
      sets: type === 'strength' ? 4 : undefined,
      reps: type === 'strength' ? 12 : undefined,
      weightKg: type === 'strength' ? 0 : undefined,
      duration: type === 'cardio' ? 30 : undefined,
      intensity: 'moderate',
      muscleGroup: type === 'strength' ? 'General' : undefined
    };
    setExerciseLogs(prev => [newLog, ...prev]);
  };

  const deleteExercise = (id: string) => {
    setExerciseLogs(prev => prev.filter(log => log.id !== id));
  };

  const updateExercise = (id: string, field: keyof ExerciseLog, value: any) => {
    setExerciseLogs(prev => prev.map(log => log.id === id ? { ...log, [field]: value } : log));
  };

  const currentDayLogs = exerciseLogs.filter(log => log.dayIndex === selectedDayIndex);
  const gymLogs = currentDayLogs.filter(log => log.type === 'strength');
  const otherLogs = currentDayLogs.filter(log => log.type !== 'strength');

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Rendimiento Élite</span>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tighter">Entrenamiento</h2>
        </div>
        <div className="bg-surface-container-low p-2 pr-6 rounded-full border border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Semana Actual</p>
            <p className="text-sm font-bold">Plan de Entrenamiento</p>
          </div>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        {days.map((day, i) => (
          <button 
            key={day}
            onClick={() => setSelectedDayIndex(i)}
            className={cn(
              "px-8 py-4 rounded-full font-bold text-sm transition-all whitespace-nowrap",
              selectedDayIndex === i ? "bg-secondary text-on-secondary shadow-lg shadow-secondary/20" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-secondary rounded-full"></span>
            Rutinas de Gimnasio
          </h3>
          <button 
            onClick={() => addExercise('strength')}
            className="text-secondary text-sm font-bold flex items-center gap-2 hover:bg-secondary/10 px-4 py-2 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Añadir Ejercicio
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {gymLogs.length > 0 ? gymLogs.map((ex) => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-container-low hover:bg-surface-container-high transition-all rounded-2xl p-6 border border-white/5 group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-surface-container-highest flex-shrink-0">
                    <img 
                      src={`https://picsum.photos/seed/${ex.name}/200/200`} 
                      alt={ex.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <input 
                          className="text-xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                          value={ex.name}
                          onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                        />
                        <input 
                          className="text-sm text-on-surface-variant bg-transparent border-none p-0 focus:ring-0 w-full"
                          value={ex.muscleGroup}
                          placeholder="Grupo muscular"
                          onChange={(e) => updateExercise(ex.id, 'muscleGroup', e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => deleteExercise(ex.id)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Series</label>
                        <input 
                          className="w-full bg-surface-container-lowest border-0 rounded-full text-center font-bold text-secondary text-sm h-12 focus:ring-1 focus:ring-secondary transition-all" 
                          type="number" 
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Reps</label>
                        <input 
                          className="w-full bg-surface-container-lowest border-0 rounded-full text-center font-bold text-secondary text-sm h-12 focus:ring-1 focus:ring-secondary transition-all" 
                          type="number" 
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.id, 'reps', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Peso (kg)</label>
                        <input 
                          className="w-full bg-surface-container-lowest border-0 rounded-full text-center font-bold text-secondary text-sm h-12 focus:ring-1 focus:ring-secondary transition-all" 
                          type="number" 
                          value={ex.weightKg}
                          onChange={(e) => updateExercise(ex.id, 'weightKg', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-white/10">
                <p className="text-on-surface-variant">No hay ejercicios registrados para este día.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Otras Actividades
          </h3>
          <button 
            onClick={() => addExercise('cardio')}
            className="text-primary text-sm font-bold flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Añadir Actividad
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {otherLogs.map((act) => (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-surface-container-low rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all group relative"
              >
                <button 
                  onClick={() => deleteExercise(act.id)}
                  className="absolute top-4 right-4 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                      {act.type === 'cardio' ? 'directions_run' : 'self_improvement'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input 
                      className="font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                      value={act.name}
                      onChange={(e) => updateExercise(act.id, 'name', e.target.value)}
                    />
                    <p className="text-xs text-on-surface-variant capitalize">{act.type}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Duración (min)</label>
                    <input 
                      className="w-full bg-surface-container-lowest border-0 rounded-full px-4 py-2.5 font-bold text-primary text-sm focus:ring-1 focus:ring-primary transition-all" 
                      type="number" 
                      value={act.duration}
                      onChange={(e) => updateExercise(act.id, 'duration', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Intensidad</label>
                    <select 
                      className="w-full bg-surface-container-lowest border-0 rounded-full px-4 py-2.5 font-bold text-primary text-sm focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      value={act.intensity}
                      onChange={(e) => updateExercise(act.id, 'intensity', e.target.value)}
                    >
                      <option value="low">Baja</option>
                      <option value="moderate">Moderada</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
