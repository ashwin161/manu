import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Settings, 
  Languages, 
  Shield, 
  Wifi, 
  Battery, 
  Signal,
  UserCheck
} from 'lucide-react';

import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';

interface MobileAppShellProps {
  children: React.ReactNode;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({ children }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Determine if bottom navigation should be shown (hide during multi-step wizard)
  const isWizardRoute = location.pathname.startsWith('/wizard') || location.pathname === '/create';
  const isSplashRoute = location.pathname === '/splash' || location.pathname === '/auth';

  const isHomeActive = location.pathname === '/' || location.pathname === '/home';
  const isPetitionsActive = location.pathname === '/petitions';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:py-6 md:px-4">
      {/* Background ambient lighting on desktop */}
      <div className="fixed inset-0 pointer-events-none opacity-25 hidden md:block bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-600 via-teal-900 to-slate-950" />

      {/* Mobile Device Frame Container */}
      <div className="w-full md:max-w-[430px] h-screen md:h-[900px] md:max-h-[95vh] bg-white md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] md:border-[10px] md:border-slate-800 flex flex-col relative overflow-hidden z-10 transition-all">
        
        {/* Mobile Status Bar (Dynamic Island & Carrier on Desktop/Simulated) */}
        <div className="h-10 bg-emerald-950 text-white px-6 flex items-center justify-between text-xs font-semibold shrink-0 select-none z-50">
          <span>{currentTime || '09:41'}</span>
          
          {/* Speaker / Camera Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 opacity-80">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Global Mobile Top App Header */}
        {!isSplashRoute && (
          <header className="civic-gradient-header text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-40 border-b border-emerald-600/30">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/15 transition-colors">
                <TamilNaduEmblem size={22} variant="light" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-state-crest font-bold text-sm tracking-wide leading-none">
                    {language === 'ta' ? 'மனு' : 'MANU'}
                  </h1>
                  <span className="text-[10px] text-emerald-200 font-semibold px-1.5 py-0.2 bg-white/10 rounded">
                    {language === 'ta' ? 'தமிழ்நாடு அரசு' : 'TN Govt'}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100/80 leading-tight mt-0.5">
                  {t('appTagline')}
                </p>
              </div>
            </button>

            {/* Language Switcher & Profile Pill */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                aria-label="Toggle Language"
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/20 transition-all min-h-[36px]"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
              </button>

              {user ? (
                <button
                  onClick={() => navigate('/settings')}
                  className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold border border-white/30"
                  title={user.displayName || user.email || 'Citizen'}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{(user.displayName || user.email || 'C')[0].toUpperCase()}</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/settings')}
                  className="w-8 h-8 rounded-full bg-white/10 text-emerald-200 flex items-center justify-center border border-white/20"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative flex flex-col">
          {children}
        </main>

        {/* Bottom Tab Navigation Bar (Visible on Top-Level Pages) */}
        {!isWizardRoute && !isSplashRoute && (
          <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center shrink-0 z-40 px-2 shadow-lg">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isHomeActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('navHome')}</span>
            </button>

            <button
              onClick={() => navigate('/petitions')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isPetitionsActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('navPetitions')}</span>
            </button>

            <button
              onClick={() => navigate('/wizard')}
              className="flex flex-col items-center justify-center h-full min-h-[44px] text-emerald-700 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full civic-gradient-header text-white flex items-center justify-center shadow-md">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] mt-0.5 font-bold text-emerald-800">{t('navNew')}</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isSettingsActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('navSettings')}</span>
            </button>
          </nav>
        )}

        {/* Mobile Home Bar Pill (Touch visual indicator on desktop) */}
        <div className="h-3 bg-white flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
