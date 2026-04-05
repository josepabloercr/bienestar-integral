import React from 'react';
import { signInWithSocial, googleProvider } from '../firebase';

interface LandingProps {
  onLogin: () => void;
}

export default function Landing({ onLogin }: LandingProps) {
  const [isLogin, setIsLogin] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSocialLogin = async (provider: any) => {
    setIsValidating(true);
    setError(null);
    try {
      await signInWithSocial(provider);
      // App.tsx handles the redirect via onAuthStateChanged
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Este método de inicio de sesión no está habilitado en la consola de Firebase. Por favor, actívalo en Authentication > Sign-in method.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes e intenta de nuevo.");
      } else {
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col selection:bg-secondary/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl h-16 flex items-center justify-between px-6 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent tracking-tight">Bienestar Integral</h1>
          <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant/60 font-sans mt-1">Midnight Sanctuary</p>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <span className="text-neutral-400 hover:text-on-surface transition-colors cursor-pointer">Funciones</span>
          <span className="text-secondary hover:text-secondary/80 transition-colors cursor-pointer" onClick={() => setIsLogin(false)}>Registrarse</span>
          <span className="text-neutral-400 hover:text-on-surface transition-colors cursor-pointer" onClick={() => setIsLogin(true)}>Ingresar</span>
        </div>
        <button className="md:hidden text-primary p-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 pt-24 pb-24">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-xl bg-surface-container-low shadow-2xl">
          {/* Left Side: Visuals */}
          <div className="hidden md:flex md:col-span-7 relative flex-col justify-end p-12 overflow-hidden min-h-[600px]">
            <img 
              alt="Athlete" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBErYHpUIi2zAmRtHFSV9ljG59cbwPCCsh8ZdNeNtAQ7rCOPWVngAEiQs_0ysApU6f_6sXiU3se6l1gDBMBEBoK1-OLmtytQbVd-0b0305KQwjKsJoCQwsS7inxY2X_cx93v7nmxyJgZKm98lp6YKzwVl6xhyP2foX6zaBrGD8Pz4_F9GjTdkNmDOXOqSwbDCOeePe0EqE09aZtbU1JfKEmt4DwPsOnkiZ6bZg92q-QSVlJglWWuWHTweajLCenSRlfKPVW1VF2w1I" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/20 text-secondary text-xs uppercase tracking-widest font-bold">
                Transformación Consciente
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter leading-tight max-w-md">
                Eleva tu <span className="text-secondary">Bienestar</span> al Infinito.
              </h1>
              <p className="text-on-surface-variant text-lg max-w-sm font-light leading-relaxed">
                Accede a un santuario digital diseñado para optimizar cada aspecto de tu salud con precisión y elegancia.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="col-span-1 md:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-surface-container-high">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
              <p className="text-on-surface-variant font-light">
                {isLogin ? 'Bienvenido de nuevo a tu santuario.' : 'Comienza tu viaje hacia la vitalidad hoy mismo.'}
              </p>
              {error && (
                <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant ml-4 block">Correo Electrónico</label>
                <input 
                  className="w-full h-14 px-6 bg-surface-container-lowest border-2 border-transparent rounded-full focus:border-secondary focus:ring-0 text-on-surface placeholder:text-neutral-600 transition-all outline-none" 
                  placeholder="nombre@ejemplo.com" 
                  required 
                  type="email" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant ml-4 block">Contraseña</label>
                <input 
                  className="w-full h-14 px-6 bg-surface-container-lowest border-2 border-transparent rounded-full focus:border-secondary focus:ring-0 text-on-surface placeholder:text-neutral-600 transition-all outline-none" 
                  placeholder="••••••••" 
                  required 
                  type="password" 
                />
              </div>
              <button 
                type="submit"
                disabled={isValidating}
                className="w-full h-14 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-bold rounded-full shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:scale-[1.01] active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin"></span>
                    <span>Validando...</span>
                  </>
                ) : (
                  isLogin ? 'Ingresar' : 'Registrarse'
                )}
              </button>
            </form>
            
            <div className="relative my-8 text-center">
              <span className="absolute inset-x-0 top-1/2 h-px bg-outline-variant/30"></span>
              <span className="relative px-4 bg-surface-container-high text-[10px] text-on-surface-variant uppercase tracking-widest">
                o {isLogin ? 'inicia sesión' : 'continúa'} con
              </span>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleSocialLogin(googleProvider)} 
                disabled={isValidating}
                className="flex items-center justify-center gap-3 w-full h-14 bg-surface-container-low border border-outline-variant/20 rounded-full hover:bg-surface-container-highest hover:border-secondary transition-all active:scale-95 group disabled:opacity-50"
              >
                <img 
                  alt="Google" 
                  className="w-6 h-6 object-contain" 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                  {isLogin ? 'Iniciar sesión' : 'Continuar'} con Google
                </span>
              </button>
            </div>
            
            <p className="mt-8 text-center text-on-surface-variant text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary font-semibold hover:text-secondary hover:underline ml-1 transition-all"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
