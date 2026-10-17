import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { getLocalPetitions, getUserProfile, saveUserProfile, PetitionDocument } from '@/src/utils/storage';
import { TN_DISTRICTS } from '@/src/data/tnDepartments';
import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';
import { 
  PlusCircle, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Zap, 
  Droplet, 
  Truck, 
  Trash2, 
  ShieldCheck, 
  Landmark,
  ChevronRight,
  Clock,
  Shield,
  Search,
  X
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [petitions, setPetitions] = useState<PetitionDocument[]>([]);
  const [profile, setProfile] = useState(getUserProfile());
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [searchDistrict, setSearchDistrict] = useState('');

  useEffect(() => {
    setPetitions(getLocalPetitions().slice(0, 3));
    setProfile(getUserProfile());
  }, []);

  const handleStartCategory = (categoryDept: string) => {
    navigate('/wizard', { state: { preselectedDept: categoryDept } });
  };

  const currentDistrictObj = TN_DISTRICTS.find(
    (d) => d.en.toLowerCase() === (profile.district || 'Madurai').toLowerCase()
  ) || TN_DISTRICTS[0];

  const filteredDistricts = TN_DISTRICTS.filter(d => 
    d.en.toLowerCase().includes(searchDistrict.toLowerCase()) || 
    d.ta.includes(searchDistrict)
  );

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-20 select-none">
      {/* 1. Top Greeting & Jurisdiction Locality Bar */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <TamilNaduEmblem size={24} variant="dark" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('welcomeGreeting')}
            </span>
            <h2 className="text-sm font-bold text-slate-900 truncate">
              {user?.displayName || profile.fullName || (language === 'ta' ? 'அன்பு குடிமகன்' : 'Citizen')}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowDistrictModal(true)}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-emerald-200 text-xs font-bold transition-all shrink-0 min-h-[36px]"
          title="Change District"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[110px]">
            {language === 'ta' ? currentDistrictObj.ta : currentDistrictObj.en}
          </span>
        </button>
      </div>

      {/* 2. Primary Hero Action Card */}
      <div className="civic-gradient-header text-white p-5 rounded-2xl shadow-md border border-emerald-700/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-bold tracking-wider uppercase text-emerald-100">
            <Shield className="w-3 h-3 text-emerald-200" />
            <span>{language === 'ta' ? 'அரசு தலைமைச் செயலகம்' : 'Official Secretariat'}</span>
          </div>
          <span className="text-[11px] text-emerald-200/90 font-mono font-semibold">
            {language === 'ta' ? '38 மாவட்டங்கள்' : '38 Districts'}
          </span>
        </div>

        <h3 className="font-display-serif text-xl font-bold leading-tight tracking-wide">
          {t('createNewPetition')}
        </h3>
        <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
          {t('startPetitionDesc')}
        </p>

        <button
          onClick={() => navigate('/wizard')}
          className="mt-4 w-full min-h-[46px] rounded-xl bg-white text-emerald-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-50 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          <span>{t('startBtn')}</span>
          <ArrowRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* 3. Frequent Departments Grid (Modern 2-Column Responsive Alignment) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'ta' ? 'முக்கிய அரசுத் துறைகள்' : 'Frequent Departments'}
          </h4>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {language === 'ta' ? 'நொடியில் தொடங்க' : 'Quick Start'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Electricity / TANGEDCO */}
          <button
            onClick={() => handleStartCategory('Tamil Nadu Generation and Distribution Corporation Limited (TANGEDCO)')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'மின்வாரியம் (EB)' : 'Electricity (EB)'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'விளக்கு, மின்கம்பி' : 'Streetlights, Power'}
              </span>
            </div>
          </button>

          {/* Water Supply / TWAD */}
          <button
            onClick={() => handleStartCategory('Tamil Nadu Water Supply and Drainage Board (TWAD) / Municipal Water Works')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'குடிநீர் / TWAD' : 'Water Supply'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'குழாய் உடைப்பு, விநியோகம்' : 'Pipeline, Drainage'}
              </span>
            </div>
          </button>

          {/* Roads & Highways */}
          <button
            onClick={() => handleStartCategory('Highways and Minor Ports Department / Municipal Engineering Wing')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'சாலைகள் / குழி' : 'Roads & Repair'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'தார் சாலை, பாலம்' : 'Potholes, Tar Road'}
              </span>
            </div>
          </button>

          {/* Health & Sanitation */}
          <button
            onClick={() => handleStartCategory('Municipal Corporation / Town Panchayat Health & Sanitation Department')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'சுகாதாரம் / குப்பை' : 'Sanitation'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'குப்பை அகற்றுதல்' : 'Waste, Cleaning'}
              </span>
            </div>
          </button>

          {/* Revenue & Patta */}
          <button
            onClick={() => handleStartCategory('Revenue and Disaster Management Department (வருவாய்த் துறை)')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'பட்டா / வருவாய்' : 'Patta & Revenue'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'நில அளவை, வட்டாட்சியர்' : 'Land survey, Tahsildar'}
              </span>
            </div>
          </button>

          {/* Collectorate Grievance Cell */}
          <button
            onClick={() => handleStartCategory('District Collectorate / Public Grievance Redressal Cell')}
            className="mobile-card-interactive p-3 flex items-start gap-2.5 text-left border border-slate-200/80 hover:border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {language === 'ta' ? 'ஆட்சியர் மனு' : 'Collector Cell'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'மக்கள் குறைதீர்ப்பு' : 'Grievance Redressal'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Recent Activity Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('recentActivity')}
          </h4>
          {petitions.length > 0 && (
            <button
              onClick={() => navigate('/petitions')}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>{t('viewAllPetitions')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {petitions.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-2xl border border-slate-200/80 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">{t('noRecentPetitions')}</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              {language === 'ta' ? 'உங்கள் முதல் மனுவை உருவாக்க மேலே உள்ள தொடங்கு பொத்தானை அழுத்தவும்.' : 'Tap Start Petition above to create your first official draft.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {petitions.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('/petitions', { state: { selectedId: p.id } })}
                className="mobile-card-interactive p-3.5 flex items-center justify-between cursor-pointer border border-slate-200/80 hover:border-emerald-300"
              >
                <div className="space-y-1 pr-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {p.referenceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate">
                    {language === 'ta' ? p.tamilOutput.subject : p.englishOutput.subject}
                  </h5>
                  <p className="text-[11px] text-slate-500 truncate">
                    {p.department}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Privacy Notice Bar */}
      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex items-center gap-2.5 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="text-[11px] leading-relaxed">
          {language === 'ta' 
            ? 'பாதுகாப்பு உறுதி: உங்கள் மனு விவரங்கள் உங்கள் தொலைபேசியிலேயே சேமிக்கப்படுகிறது.' 
            : 'Privacy First: All petition drafts and data remain strictly on this device.'}
        </span>
      </div>

      {/* 6. District Selection Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-5 space-y-3.5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'ta' ? 'மாவட்டத்தை மாற்றவும்' : 'Select District'}
                </h3>
              </div>
              <button
                onClick={() => setShowDistrictModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick search inside district modal */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder={language === 'ta' ? 'மாவட்ட பெயரைத் தேடுங்கள்...' : 'Search district...'}
                className="mobile-input pl-8.5 py-1.5 text-xs"
              />
            </div>

            <div className="overflow-y-auto space-y-1 flex-1 pr-1 max-h-64">
              {filteredDistricts.map((dist) => (
                <button
                  key={dist.en}
                  onClick={() => {
                    const updated = { ...profile, district: dist.en };
                    setProfile(updated);
                    saveUserProfile(updated);
                    setShowDistrictModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    profile.district === dist.en
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{dist.en}</span>
                  <span className="text-slate-400 text-[11px]">{dist.ta}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
