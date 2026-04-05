import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { notificationService } from '../services/notificationService';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
}

export default function Profile({ userProfile, setUserProfile, onLogout }: ProfileProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    if (granted) {
      notificationService.testNotification();
    }
  };

  const handleTestNotification = () => {
    notificationService.testNotification();
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate save delay
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const addReminder = () => {
    const newTime = "08:00";
    setUserProfile(prev => ({ ...prev, reminders: [...(prev.reminders || []), newTime] }));
  };

  const removeReminder = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      reminders: (prev.reminders || []).filter((_, i) => i !== index)
    }));
  };

  const updateReminder = (index: number, time: string) => {
    setUserProfile(prev => ({
      ...prev,
      reminders: (prev.reminders || []).map((r, i) => i === index ? time : r)
    }));
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Perfil de Bienestar</h2>
        <p className="text-on-surface-variant text-lg mt-4 max-w-2xl">Personaliza tu experiencia. Tus datos biométricos permiten que la IA ajuste tu camino hacia la vitalidad absoluta.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low p-6 md:p-10 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Peso (kg)</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-lowest border-2 border-transparent rounded-full px-6 py-4 text-on-surface focus:ring-0 focus:border-primary transition-all" 
                  type="number" 
                  value={userProfile.weight}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">weight</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Altura (cm)</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-lowest border-2 border-transparent rounded-full px-6 py-4 text-on-surface focus:ring-0 focus:border-primary transition-all" 
                  type="number" 
                  value={userProfile.height}
                  onChange={(e) => handleChange('height', parseInt(e.target.value))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">straighten</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Edad</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-lowest border-2 border-transparent rounded-full px-6 py-4 text-on-surface focus:ring-0 focus:border-primary transition-all" 
                  type="number" 
                  value={userProfile.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">calendar_today</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Sexo</label>
              <select 
                className="w-full bg-surface-container-lowest border-2 border-transparent rounded-full px-6 py-4 text-on-surface focus:ring-0 focus:border-primary appearance-none cursor-pointer transition-all"
                value={userProfile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Nivel de Actividad</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'sedentary', label: 'Sedentario', icon: 'pace' },
                  { id: 'moderate', label: 'Moderado', icon: 'fitness_center' },
                  { id: 'intense', label: 'Intenso', icon: 'bolt' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleChange('activityLevel', level.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-6 rounded-lg transition-all border-2 border-transparent",
                      userProfile.activityLevel === level.id 
                        ? "bg-secondary-container text-on-secondary-container shadow-lg" 
                        : "bg-surface-container-lowest hover:bg-surface-container-high text-on-surface-variant"
                    )}
                  >
                    <span className="material-symbols-outlined text-3xl">{level.icon}</span>
                    <span className="text-sm font-bold">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 pt-6 border-t border-white/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold ml-1">Recordatorios de Hidratación</label>
                  <p className="text-[10px] text-on-surface-variant/60 ml-1">Recibe notificaciones push en tu dispositivo.</p>
                </div>
                <div className="flex items-center gap-3">
                  {notificationPermission === 'granted' && (
                    <button 
                      onClick={handleTestNotification}
                      className="text-xs font-bold bg-secondary/10 text-secondary px-4 py-2 rounded-full hover:bg-secondary/20 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">notifications_active</span>
                      Probar Notificación
                    </button>
                  )}
                  {notificationPermission !== 'granted' && (
                    <button 
                      onClick={handleRequestPermission}
                      className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {notificationPermission === 'denied' ? 'notifications_off' : 'notifications'}
                      </span>
                      {notificationPermission === 'denied' ? 'Permiso Denegado' : 'Habilitar Notificaciones'}
                    </button>
                  )}
                  <button 
                    onClick={addReminder}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Añadir Hora
                  </button>
                </div>
              </div>

              {/* Permission Guidance */}
              {notificationPermission !== 'granted' && (
                <div className="bg-surface-container-highest/30 p-4 rounded-lg flex items-start gap-3 border border-white/5">
                  <span className="material-symbols-outlined text-primary">help_outline</span>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface">¿No aparece la opción?</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Si al hacer clic no sucede nada o dice "Denegado", es probable que el navegador esté bloqueando las notificaciones dentro de esta ventana. 
                      **Para solucionarlo, abre la aplicación en una pestaña nueva** usando el botón en la esquina superior derecha del editor, o asegúrate de que los permisos no estén bloqueados en la configuración de tu navegador.
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Guidance */}
              {notificationPermission === 'granted' && (
                <div className="bg-surface-container-highest/30 p-4 rounded-lg flex items-start gap-3 border border-white/5">
                  <span className="material-symbols-outlined text-tertiary">info</span>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Tip para Móviles y Tablets</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Para recibir notificaciones en tu celular o tablet (especialmente iOS), asegúrate de **"Añadir a la pantalla de inicio"** desde tu navegador. Esto permitirá que la app funcione como una aplicación nativa y envíe alertas incluso en segundo plano.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(userProfile.reminders || []).map((time, index) => (
                  <div key={index} className="relative group">
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => updateReminder(index, e.target.value)}
                      className="w-full bg-surface-container-lowest border-0 rounded-full px-4 py-2 text-sm font-bold text-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <button 
                      onClick={() => removeReminder(index)}
                      className="absolute -top-1 -right-1 bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={cn(
              "w-full mt-10 py-5 rounded-full font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3",
              saveStatus === 'saved' ? "bg-tertiary text-on-tertiary" : "bg-gradient-to-r from-primary to-primary-container text-on-primary hover:scale-[1.01] active:scale-95"
            )}
          >
            <span>{saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'saved' ? '¡Guardado!' : 'Guardar Cambios'}</span>
            <span className="material-symbols-outlined">{saveStatus === 'saved' ? 'check_circle' : 'save'}</span>
          </button>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-high p-8 rounded-lg space-y-4">
            <span className="material-symbols-outlined text-tertiary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <h3 className="text-xl font-bold">Privacidad Absoluta</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Tus datos están encriptados bajo protocolos de grado militar. Solo se utilizan para personalizar tu experiencia.</p>
          </div>

          <button 
            onClick={onLogout}
            className="w-full p-4 bg-surface-container-high rounded-lg text-error flex items-center justify-between hover:bg-error/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-bold">Cerrar Sesión</span>
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
