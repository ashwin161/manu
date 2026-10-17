import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { getUserProfile, saveUserProfile } from '@/src/utils/storage';
import { TN_DISTRICTS } from '@/src/data/tnDepartments';
import { MapPin, Navigation, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

// Approximate coordinate centroids for major Tamil Nadu District centers
const TN_COORDINATES = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', lat: 11.6643, lng: 78.1460 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
  { name: 'Tiruppur', lat: 11.1085, lng: 77.3411 },
  { name: 'Erode', lat: 11.3410, lng: 77.7172 },
  { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
  { name: 'Thanjavur', lat: 10.7870, lng: 79.1378 },
  { name: 'Dindigul', lat: 10.3673, lng: 77.9803 },
  { name: 'Kanchipuram', lat: 12.8342, lng: 79.7036 },
  { name: 'Cuddalore', lat: 11.7480, lng: 79.7714 },
  { name: 'Nagapattinam', lat: 10.7672, lng: 79.8449 },
  { name: 'Kanniyakumari', lat: 8.0883, lng: 77.5385 },
];

function findNearestDistrict(lat: number, lng: number): string {
  let closest = 'Madurai';
  let minDistance = Infinity;

  for (const item of TN_COORDINATES) {
    const d = Math.hypot(item.lat - lat, item.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = item.name;
    }
  }
  return closest;
}

export const LocationPermissionScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [detecting, setDetecting] = useState(false);
  const [detectedLocality, setDetectedLocality] = useState<string | null>(null);
  const [manualDistrict, setManualDistrict] = useState<string>('Madurai');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestLocation = () => {
    setDetecting(true);
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setErrorMessage(t('locationManualNotice'));
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestDistrict(latitude, longitude);
        setDetectedLocality(nearest);

        const profile = getUserProfile();
        saveUserProfile({
          ...profile,
          district: nearest,
        });

        setDetecting(false);
        setTimeout(() => {
          navigate('/');
        }, 800);
      },
      (error) => {
        console.warn('Geolocation denied or unavailable:', error.message);
        setErrorMessage(t('locationManualNotice'));
        setDetecting(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const handleManualProceed = () => {
    const profile = getUserProfile();
    saveUserProfile({
      ...profile,
      district: manualDistrict,
    });
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-xl mx-auto w-full text-slate-900 select-none">
      {/* Top Header */}
      <div>
        <div className="w-16 h-16 rounded-2xl civic-gradient-subtle border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-6 shadow-sm">
          <MapPin className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-center text-slate-900">
          {t('locationTitle')}
        </h2>
        <p className="text-sm text-slate-600 text-center mt-2 leading-relaxed max-w-xs mx-auto">
          {t('locationDesc')}
        </p>
      </div>

      {/* Middle Card: Auto-detection status or manual selector */}
      <div className="my-auto py-6">
        {detectedLocality ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-emerald-900 text-sm">{t('locationDetected')}</p>
            <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{detectedLocality} {language === 'ta' ? 'மாவட்டம்' : 'District, Tamil Nadu'}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="mobile-card p-4 space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                {language === 'ta' ? 'உங்கள் மாவட்டம் (கைமுறை தேர்வு)' : 'Select Your District Manually'}
              </label>
              <select
                value={manualDistrict}
                onChange={(e) => setManualDistrict(e.target.value)}
                className="mobile-input text-sm font-semibold"
              >
                {TN_DISTRICTS.map((dist) => (
                  <option key={dist.en} value={dist.en}>
                    {language === 'ta' ? dist.ta : dist.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleRequestLocation}
          disabled={detecting || Boolean(detectedLocality)}
          className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? t('detectingLocation') : t('allowLocationBtn')}</span>
        </button>

        <button
          onClick={handleManualProceed}
          className="w-full min-h-[44px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-slate-100 active:scale-[0.98] transition-all"
        >
          <span>{t('skipLocationBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
