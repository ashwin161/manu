import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { Shield, ArrowRight, CheckCircle2, Globe2, AlertCircle, FileCheck2, Cpu, Scale } from 'lucide-react';
import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';

export const SplashScreen: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { signInWithGoogle, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithGoogle();
      navigate('/location');
    } catch (e: any) {
      console.error('Google Auth Failed:', e);
      setAuthError(e?.message || 'Google Authentication encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setAuthError(null);
    await loginAsGuest();
    navigate('/location');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 md:p-10 bg-transparent text-slate-900 select-none">
      {/* Top Bar with Language Toggle & Official Seal Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold tracking-wide">
            {language === 'ta' ? 'தமிழ்நாடு அரசு நெறிமுறை போர்ட்டல்' : 'Govt of Tamil Nadu Official Citizen Portal'}
          </span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 border border-emerald-300 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all min-h-[36px]"
        >
          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'en' ? 'தமிழ் (Tamil)' : 'English'}</span>
        </button>
      </div>

      {/* Main Responsive Hero Grid: Left side features, Right side Authentication */}
      <div className="my-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full">
        {/* Left / Center Column: Official Insignia & Branding */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl civic-gradient-header flex items-center justify-center p-3 shadow-xl border-4 border-white relative shrink-0">
              <TamilNaduEmblem size={64} variant="light" />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                TN GOVT
              </div>
            </div>
            <div className="text-left">
              <h1 className="font-state-crest font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-wider">
                {language === 'ta' ? 'மனு' : 'MANU'}
              </h1>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded inline-block mt-0.5">
                Official Grievance Petition Platform
              </span>
            </div>
          </div>

          <div>
            <p className="font-display-serif text-lg sm:text-xl font-bold text-emerald-900 mt-2">
              {t('appTagline')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-lg">
              {t('taglineSubtitle')}
            </p>
          </div>

          {/* Key Platform Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-2">
            <div className="p-3 bg-white/65 backdrop-blur-xl rounded-xl border border-white/80 shadow-xs flex flex-col gap-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'தமிழ் & தங்கிலீஷ்' : 'Tamil & Tanglish'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ta' ? 'எளிய பேச்சுவழக்கு தட்டச்சு & குரல் உள்ளீடு' : 'Natural vernacular & voice input supported'}
              </p>
            </div>

            <div className="p-3 bg-white/65 backdrop-blur-xl rounded-xl border border-white/80 shadow-xs flex flex-col gap-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'AI அதிகார சரிபார்ப்பு' : 'AI Routing'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ta' ? '38 மாவட்டங்கள் & 120+ அரசுத் துறைகள்' : 'Automatic jurisdiction routing for 38 districts'}
              </p>
            </div>

            <div className="p-3 bg-white/65 backdrop-blur-xl rounded-xl border border-white/80 shadow-xs flex flex-col gap-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'சட்டப்பூர்வ A4 PDF' : 'Legal A4 PDF'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {language === 'ta' ? 'ஆட்சியர் குறைதீர்ப்பு வடிவத்தில் தயார்' : 'Collectorate & CM Special Cell approved'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card with Frosted Glass Blur */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-2xl p-6 sm:p-7 rounded-2xl border border-white/80 shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'ta' ? 'குடிமக்கள் உள்நுழைவு' : 'Citizen Access & Sign-In'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ta' 
                ? 'உங்கள் உண்மையான கூகுள் கணக்கு அல்லது விருந்தினர் முறைமையில் தொடரலாம்.' 
                : 'Authenticate securely with your real Google account or continue in offline guest mode.'}
            </p>
          </div>

          {/* Error Banner (Shows if Google OAuth has issues) */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{language === 'ta' ? 'உள்நுழைவுப் பிழை' : 'Authentication Notice'}</p>
                <p className="text-[11px] text-rose-700 leading-tight mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* Real Google Sign-In Action */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full min-h-[48px] rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
          >
            {/* Google Vector Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>{loading ? (language === 'ta' ? 'இணைக்கப்படுகிறது...' : 'Connecting to Google...') : t('continueWithGoogle')}</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ta' ? 'அல்லது' : 'or'}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Continue as Guest Button */}
          <button
            onClick={handleGuest}
            className="w-full min-h-[44px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{t('guestMode')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-500 leading-tight">
            {t('loginSubtitle')}
          </p>
        </div>
      </div>

      {/* Bottom Footer Ribbon */}
      <div className="pt-4 border-t border-emerald-900/10 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© Government of Tamil Nadu · Department of Public Grievances</span>
        <span className="font-mono text-emerald-800">Secure AES & Firebase Firestore Encrypted</span>
      </div>
    </div>
  );
};
