import React from 'react';
import { Screen } from '../App';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export default function Navigation({ currentScreen, onNavigate, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: 'home' },
    { id: 'meals', label: 'Comidas', icon: 'restaurant' },
    { id: 'activity', label: 'Actividad', icon: 'fitness_center' },
    { id: 'hydration', label: 'Hidratación', icon: 'water_drop' },
    { id: 'library', label: 'Biblioteca', icon: 'video_library' },
    { id: 'chat', label: 'IA Chat', icon: 'smart_toy' },
    { id: 'profile', label: 'Perfil', icon: 'person' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-surface shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex-col py-8 px-4 z-50">
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent tracking-tight">Bienestar Integral</h1>
          <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant/60 font-sans mt-1">Midnight Sanctuary</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={cn(
                "w-full flex items-center gap-4 rounded-full px-6 py-3 transition-all duration-300",
                currentScreen === item.id 
                  ? "bg-secondary text-on-secondary shadow-[0_0_15px_rgba(78,222,163,0.3)] scale-105" 
                  : "text-primary/60 hover:text-primary hover:bg-surface-container-low"
              )}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: currentScreen === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1">
          <button className="w-full flex items-center gap-4 px-6 py-3 text-primary/40 hover:text-secondary transition-all cursor-pointer uppercase tracking-[0.1em] text-[10px]">
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Soporte</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-3 text-primary/40 hover:text-secondary transition-all cursor-pointer uppercase tracking-[0.1em] text-[10px]"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Cerrar Sesión</span>
          </button>
          
          <div className="px-4 py-6 bg-surface-container-low rounded-lg flex items-center gap-3 mt-4">
            <img 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-primary-container" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqKqaGSv4S_uBoY4KZM-NnDqs-rc0Tc7N38jB_Iv8mTSUoGgoBK1a7v6aqrJQwYusDGGKlfnPU6ldO27EBdT7CqQdIlaJgYywARb9mDsFoY5IVuumwVGieu39o1FrQkv3hu18MW_0MpC_lU3NoX714PIqBXloaaMgSgNUemcEddjBAGXMAhcQzrYa5yUsOMxdH4wfNThZhzGbDr4T-dVGj1LFiPw1xVXERP0k7WKPLdvMod14sWH-bzpfeXW84oeyrlMXOFFhURb0" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Vance</p>
              <p className="text-xs text-on-surface-variant truncate">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/95 backdrop-blur-xl border-t border-surface-container-highest z-50 flex items-center justify-around px-4 pb-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              currentScreen === item.id ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            )}
          >
            <span className={cn(
              "material-symbols-outlined text-[24px] transition-transform",
              currentScreen === item.id && "scale-110"
            )} style={{ fontVariationSettings: currentScreen === item.id ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className={cn(
              "text-[10px] font-medium",
              currentScreen === item.id && "font-bold"
            )}>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
