import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Settings, 
  Languages, 
  Shield, 
  LogOut,
  Landmark,
  UserCheck
} from 'lucide-react';
import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';
import { TamilNaduParticleBackground } from '@/src/components/TamilNaduParticleBackground';

interface AppShellProps {
  children: React.ReactNode;
}

export const MobileAppShell: React.FC<AppShellProps> = ({ children }) => {
  const { language, toggleLanguage, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isSplashRoute = location.pathname === '/splash' || location.pathname === '/auth';
  const isWizardRoute = location.pathname.startsWith('/wizard') || location.pathname === '/create';
  const isHomeActive = location.pathname === '/' || location.pathname === '/home';
  const isPetitionsActive = location.pathname === '/petitions';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="min-h-screen relative flex flex-col font-ui text-slate-900 select-none">
      {/* Interactive Tamil Nadu Logo Particle Background */}
      <TamilNaduParticleBackground />

      {/* Sovereign Official Top Ribbon */}
      <div className="relative z-30 bg-emerald-950/90 text-white text-[11px] font-medium py-1.5 px-4 sm:px-8 border-b border-emerald-800/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-state-crest font-semibold text-emerald-100 tracking-wider text-[10px] sm:text-[11px]">
            GOVERNMENT OF TAMIL NADU
          </span>
          <span className="text-emerald-700 hidden sm:inline">|</span>
          <span className="text-emerald-200/90 hidden sm:inline font-legal-tamil text-[11px]">
            தமிழ்நாடு அரசு பொது குறைதீர்ப்பு மனு மையம்
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-300/80 text-[10px] sm:text-[11px]">
          <span className="hidden md:inline">CM Special Cell Format</span>
          <span className="hidden md:inline">·</span>
          <span>District Collectorate Standards</span>
        </div>
      </div>

      {/* Responsive Global Web Header */}
      {!isSplashRoute && (
        <header className="relative z-30 bg-gradient-to-r from-emerald-950/85 via-teal-900/80 to-blue-950/85 backdrop-blur-xl text-white shadow-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo & Name */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all shadow-md">
                <TamilNaduEmblem size={28} variant="light" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-state-crest font-extrabold text-lg tracking-wider leading-none">
                    {language === 'ta' ? 'மனு' : 'MANU'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 bg-black/20 rounded border border-amber-300/30">
                    {language === 'ta' ? 'தமிழ்நாடு அரசு' : 'TN Govt'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5">
                  {t('appTagline')}
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links (Visible on Laptop, Monitor, Tablet) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isHomeActive
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('navHome')}</span>
              </Link>

              <Link
                to="/petitions"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isPetitionsActive
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('navPetitions')}</span>
              </Link>

              <Link
                to="/wizard"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-900 shadow-md hover:bg-amber-300 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('navNew')}</span>
              </Link>

              <Link
                to="/settings"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSettingsActive
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t('navSettings')}</span>
              </Link>
            </nav>

            {/* Language Selector & Profile Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleLanguage}
                aria-label="Toggle Language"
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border border-white/20 transition-all min-h-[36px]"
              >
                <Languages className="w-4 h-4 text-emerald-200" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-900/90 p-1.5 pr-3 rounded-full border border-emerald-400/30 text-white transition-all cursor-pointer"
                    title={user.displayName || user.email || 'Citizen'}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold border border-white/30 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(user.displayName || user.email || 'C')[0].toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold max-w-[120px] truncate hidden sm:inline">
                      {user.displayName || user.email?.split('@')[0] || 'Citizen'}
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/splash');
                    }}
                    className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden sm:flex"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/splash')}
                  className="flex items-center gap-1.5 bg-white text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm hover:bg-emerald-50 active:scale-95 transition-all"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'உள்நுழைவு' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Responsive Web Body Container */}
      <div className="relative z-20 flex-1 flex flex-col w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <main className="glass-section flex-1 flex flex-col rounded-2xl overflow-hidden min-h-[500px]">
          {children}
        </main>
      </div>

      {/* Mobile-Only Bottom Tab Navigation Bar (Visible only on screens < 768px) */}
      {!isWizardRoute && !isSplashRoute && (
        <nav className="md:hidden sticky bottom-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-2xl border-t border-white/60 grid grid-cols-4 items-center shrink-0 z-40 px-2 shadow-2xl">
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
    </div>
  );
};

export const AppShell = MobileAppShell;
