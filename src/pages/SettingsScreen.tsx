import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { 
  getUserProfile, 
  saveUserProfile, 
  getLocalPetitions, 
  exportAllDataAsJSON, 
  clearAllLocalData 
} from '@/src/utils/storage';
import { TN_DISTRICTS } from '@/src/data/tnDepartments';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  Languages, 
  Download, 
  Trash2, 
  LogOut, 
  Save, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(getUserProfile());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [wipedSuccess, setWipedSuccess] = useState(false);

  const localCount = getLocalPetitions().length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm(t('clearDataConfirm'))) {
      clearAllLocalData();
      setWipedSuccess(true);
      setTimeout(() => {
        setWipedSuccess(false);
        navigate('/');
      }, 1000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/splash');
  };

  return (
    <div className="flex-1 p-4 space-y-4 pb-20 select-none">
      {/* Header */}
      <div>
        <h2 className="font-display-serif text-lg font-bold text-slate-900">
          {t('settingsTitle')}
        </h2>
        <p className="text-xs text-slate-500">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Account Info Pill */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full civic-gradient-header text-white flex items-center justify-center font-bold text-sm">
            {(user?.displayName || user?.email || 'C')[0].toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {user?.displayName || (language === 'ta' ? 'குடிமக்கள் பயனர்' : 'Citizen User')}
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {user?.email || (language === 'ta' ? 'விருந்தினர் முறைமை' : 'Guest Mode (Local Only)')}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('logoutBtn')}</span>
        </button>
      </div>

      {/* App Language Selector */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'பயன்பாட்டு மொழி (App Language)' : 'Application Language'}</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLanguage('ta')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              language === 'ta'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            தமிழ் (Tamil)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Citizen Profile Information */}
      <form onSubmit={handleSaveProfile} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'ta' ? 'மனுதாரர் நிலையான விவரங்கள்' : 'Default Petitioner Details'}
          </h3>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('fullName')}
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            className="mobile-input text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('phoneNumber')}
          </label>
          <input
            type="tel"
            maxLength={10}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="mobile-input text-xs font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('residentialAddress')}
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="mobile-input text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('district')}
            </label>
            <select
              value={profile.district}
              onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              className="mobile-input text-xs font-semibold"
            >
              {TN_DISTRICTS.map((d) => (
                <option key={d.en} value={d.en}>
                  {language === 'ta' ? d.ta : d.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('taluk')}
            </label>
            <input
              type="text"
              value={profile.taluk}
              onChange={(e) => setProfile({ ...profile, taluk: e.target.value })}
              className="mobile-input text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[42px] rounded-xl civic-gradient-header text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'விவரங்களை சேமிக்க' : 'Save Default Information'}</span>
        </button>
      </form>

      {/* Privacy-First Local Storage Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'ta' ? 'தனியுரிமை & உள்ளூர் தரவு' : 'Privacy & Local Data'}
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-800">
            {localCount} {language === 'ta' ? 'மனுக்கள்' : 'Items'}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {t('privacyNote')}
        </p>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={exportAllDataAsJSON}
            className="w-full min-h-[42px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('exportJsonBtn')}</span>
          </button>

          <button
            type="button"
            onClick={handleClearData}
            className="w-full min-h-[42px] rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearAllDataBtn')}</span>
          </button>

          {wipedSuccess && (
            <p className="text-xs text-center text-rose-600 font-bold">
              {t('dataClearedSuccess')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
