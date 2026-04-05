import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, WeightLog, MealLog, ExerciseLog, HydrationLog, Resource } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Meals from './components/Meals';
import Activity from './components/Activity';
import Hydration from './components/Hydration';
import Profile from './components/Profile';
import Landing from './components/Landing';
import AIChat from './components/AIChat';
import Library from './components/Library';
import { auth, db, logout as firebaseLogout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { notificationService } from './services/notificationService';

export type Screen = 'landing' | 'dashboard' | 'meals' | 'activity' | 'hydration' | 'profile' | 'chat' | 'library';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Persistence using localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    const defaultProfile: UserProfile = {
      weight: 78, // in kg
      height: 180,
      age: 28,
      gender: 'masculino',
      activityLevel: 'moderate',
      goal: 'perder',
      reminders: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    };
    if (!saved) return defaultProfile;
    const parsed = JSON.parse(saved);
    return { ...defaultProfile, ...parsed };
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem('weightLogs');
    return saved ? JSON.parse(saved) : [
      { date: '2026-03-01', weight: 82 },
      { date: '2026-03-08', weight: 81.2 },
      { date: '2026-03-15', weight: 80.5 },
      { date: '2026-03-22', weight: 79.1 },
      { date: '2026-03-29', weight: 78.4 },
    ];
  });

  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem('mealLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    const saved = localStorage.getItem('exerciseLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>(() => {
    const saved = localStorage.getItem('hydrationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('resources');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    if (user && userProfile.reminders) {
      setDoc(doc(db, 'users', user.uid), {
        reminders: userProfile.reminders
      }, { merge: true }).catch(e => console.error("Error saving reminders to db:", e));
    }
  }, [userProfile, user]);

  useEffect(() => {
    localStorage.setItem('weightLogs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('mealLogs', JSON.stringify(mealLogs));
  }, [mealLogs]);

  useEffect(() => {
    localStorage.setItem('exerciseLogs', JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  useEffect(() => {
    localStorage.setItem('hydrationLogs', JSON.stringify(hydrationLogs));
  }, [hydrationLogs]);

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  // Handle Notifications Scheduling
  useEffect(() => {
    if (user && userProfile.reminders && userProfile.reminders.length > 0) {
      notificationService.scheduleReminders(userProfile.reminders);
    } else {
      notificationService.clearAllNotifications();
    }
    return () => notificationService.clearAllNotifications();
  }, [userProfile.reminders, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
      if (currentUser) {
        // When logging in, go to profile as requested
        setCurrentScreen('profile');
      } else {
        setCurrentScreen('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await firebaseLogout();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard weightLogs={weightLogs} mealLogs={mealLogs} hydrationLogs={hydrationLogs} userProfile={userProfile} />;
      case 'meals':
        return <Meals mealLogs={mealLogs} setMealLogs={setMealLogs} />;
      case 'activity':
        return <Activity exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs} />;
      case 'hydration':
        return <Hydration hydrationLogs={hydrationLogs} setHydrationLogs={setHydrationLogs} reminders={userProfile.reminders} />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={setUserProfile} onLogout={handleLogout} />;
      case 'chat':
        return <AIChat />;
      case 'library':
        return <Library resources={resources} setResources={setResources} />;
      default:
        return <Dashboard weightLogs={weightLogs} mealLogs={mealLogs} hydrationLogs={hydrationLogs} userProfile={userProfile} />;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Cargando Santuario...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} onLogout={handleLogout} />
      
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="flex justify-between items-center w-full px-4 lg:px-8 py-4 sticky top-0 bg-background/80 backdrop-blur-xl z-40 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4 lg:gap-6 flex-1 lg:flex-none">
            <div className="lg:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">BI</h1>
            </div>
            <div className="relative flex-1 lg:flex-none">
              <button 
                onClick={() => setCurrentScreen('chat')}
                className="bg-surface-container-lowest border-none rounded-full py-2.5 pl-12 pr-6 w-full lg:w-80 text-sm focus:ring-1 focus:ring-primary text-on-surface-variant/60 hover:text-on-surface transition-all flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-hover:text-secondary transition-colors">smart_toy</span>
                <span>¿Tienes alguna duda? Pregúntame...</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6 ml-4">
            <button className="p-2 text-primary hover:bg-surface-container-low hover:text-secondary transition-colors rounded-full active:scale-90">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-primary hover:bg-surface-container-low hover:text-secondary transition-colors rounded-full active:scale-90">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
              <img 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxjt3Ja3gdgePdajTaimxfenFtXxbsIsQhFrXFZ-MvGNvfeNN8HebiBi5Z5_GO2U5RkH4fvea-pOVoQBsJ3hwN2JMzLYJrf7A9BQxfyBtZ6NYxz5butqOY6zKNC9G0_fH0CTpGh1DQllybH2J9TPljqq04L23AqgrgEO5AXHqBc_rcJREDbYtRh5-HaWclCs_Le53fkImid7XYGD-eY27rglJsSNVpPiPfITWobsuWxnwMQxLgYSknrS7_LLkT7EOFEs9y8jnyTIc" 
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
