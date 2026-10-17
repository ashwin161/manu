import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { Shield, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';
import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';

export const SplashScreen: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { signInWithGoogle, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/location');
    } catch (e) {
      console.error(e);
      // Fallback to guest mode
      await loginAsGuest();
      navigate('/location');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    await loginAsGuest();
    navigate('/location');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 civic-gradient-subtle text-slate-900 select-none">
      {/* Top Language Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'தமிழ்நாடு அரசு நெறிமுறை' : 'Govt of Tamil Nadu Standard'}</span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-bold text-emerald-800 border border-emerald-200 shadow-sm min-h-[36px]"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>
      </div>

      {/* Hero Government Emblem & Title */}
      <div className="flex flex-col items-center text-center my-auto py-8">
        {/* Tamil Nadu State Crest Insignia */}
        <div className="w-24 h-24 rounded-full civic-gradient-header flex items-center justify-center p-3.5 shadow-xl border-4 border-white mb-6 relative">
          <TamilNaduEmblem size={68} variant="light" />
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
            TN
          </div>
        </div>

        <h1 className="font-state-crest font-extrabold text-3xl text-slate-900 tracking-wider">
          {language === 'ta' ? 'மனு' : 'MANU'}
        </h1>
        <p className="font-display-serif text-lg font-semibold text-emerald-800 mt-1">
          {t('appTagline')}
        </p>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
          {t('taglineSubtitle')}
        </p>

        <div className="w-16 h-0.5 bg-emerald-600/30 my-4 rounded-full" />

        <div className="space-y-2 text-xs text-slate-600 max-w-xs text-center">
          <p className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{language === 'ta' ? 'Tanglish & தமிழ் எளிய பேச்சு மொழி ஏற்பு' : 'Natural Tanglish & Tamil Speech Input'}</span>
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{language === 'ta' ? 'Gemini AI அதிகார வரம்பு சரிபார்ப்பு' : 'Gemini AI Authority Verification'}</span>
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{language === 'ta' ? 'சட்டப்பூர்வ A4 PDF & அச்சிடும் வசதி' : 'Court-Ready A4 PDF & Print Format'}</span>
          </p>
        </div>
      </div>

      {/* Bottom Auth Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full min-h-[48px] rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Connecting...' : t('continueWithGoogle')}</span>
        </button>

        <button
          onClick={handleGuest}
          className="w-full min-h-[44px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span>{t('guestMode')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-slate-500 leading-tight">
          {t('loginSubtitle')}
        </p>
      </div>
    </div>
  );
};
