import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { Plus, LogOut, Landmark } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-neutral-300 sticky top-0 z-40 no-print">
      {/* Top Sovereign Official Ribbon */}
      <div className="bg-black text-white text-[11px] font-medium tracking-wider py-1.5 px-4 sm:px-8 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Landmark className="w-3.5 h-3.5 text-white" />
          <span className="font-state-crest font-semibold text-white tracking-widest text-[10px]">
            GOVERNMENT OF TAMIL NADU
          </span>
          <span className="text-neutral-500">|</span>
          <span className="font-legal-tamil text-neutral-300">தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு மையம்</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-400 text-[11px]">
          <span>CM Special Cell Standards</span>
          <span className="text-neutral-600">·</span>
          <span>District Collectorate Format</span>
          <span className="text-neutral-600">·</span>
          <span className="font-mono text-neutral-300">Ver. 2.4</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 bg-black text-white font-serif text-lg flex items-center justify-center font-bold border border-black shadow-xs">
            ம
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-state-crest text-lg font-bold tracking-wider text-black">
                MANU
              </span>
              <span className="text-xs font-bold text-neutral-700 font-legal-tamil">
                மனு
              </span>
            </div>
            <span className="text-[10px] tracking-wide uppercase text-neutral-500 font-mono">
              Official Grievance Petition Drafter
            </span>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Language Selector */}
          <div className="inline-flex border border-black p-0.5 bg-white text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-black text-white font-bold'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1 transition-colors ${
                language === 'ta'
                  ? 'bg-black text-white font-bold'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={`text-xs font-semibold px-3 py-1.5 transition-colors border ${
                  isCurrent('/dashboard')
                    ? 'border-black bg-neutral-100 text-black font-bold'
                    : 'border-transparent text-neutral-700 hover:text-black hover:border-neutral-300'
                }`}
              >
                {t('dashboard')}
              </Link>

              <Link
                to="/create"
                className="gov-btn-primary flex items-center gap-1.5 text-xs px-4 py-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('newPetition')}</span>
              </Link>

              {/* Citizen ID */}
              <div className="h-5 w-px bg-neutral-300 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-600 hidden md:inline max-w-[150px] truncate" title={user.email || ''}>
                  {user.email || user.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-300"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/auth/login"
                className="gov-btn-secondary text-xs px-4 py-2"
              >
                {t('login')}
              </Link>
              <Link
                to="/auth/signup"
                className="gov-btn-primary text-xs px-4 py-2"
              >
                {t('signup')}
              </Link>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
