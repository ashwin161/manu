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
  X,
  FileCheck2,
  Sparkles
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
    setPetitions(getLocalPetitions().slice(0, 4));
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
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 select-none">
      {/* 1. Top Greeting & Jurisdiction Locality Bar */}
      <div className="bg-white/70 backdrop-blur-xl px-5 py-3.5 rounded-2xl border border-white/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
            <TamilNaduEmblem size={28} variant="dark" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('welcomeGreeting')}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {user?.displayName || profile.fullName || (language === 'ta' ? 'அன்பு குடிமகன்' : 'Citizen')}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowDistrictModal(true)}
          className="flex items-center gap-2 bg-white/80 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
          title="Change District Jurisdiction"
        >
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[150px]">
            {language === 'ta' ? currentDistrictObj.ta : currentDistrictObj.en}
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono font-bold">
            {language === 'ta' ? 'மாற்று' : 'Edit'}
          </span>
        </button>
      </div>

      {/* 2. Responsive Hero Section Grid (Wide-Screen 2-Column on Desktop/Tablet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Hero Action Card (8 cols) with Translucent Glass */}
        <div className="lg:col-span-8 bg-gradient-to-r from-emerald-950/85 via-teal-900/80 to-blue-950/85 backdrop-blur-xl text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-white/30 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle decorative glow */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold tracking-wider uppercase text-emerald-100">
                <Shield className="w-3.5 h-3.5 text-emerald-200" />
                <span>{language === 'ta' ? 'அரசு தலைமைச் செயலக தரநிலை' : 'Official Secretariat Standard'}</span>
              </div>
              <span className="text-xs text-amber-300 font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
                {language === 'ta' ? '38 மாவட்டங்கள் நேரடி ஏற்பு' : 'All 38 Districts Covered'}
              </span>
            </div>

            <h3 className="font-display-serif text-2xl sm:text-3xl font-extrabold leading-tight tracking-wide">
              {t('createNewPetition')}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/95 mt-2 leading-relaxed max-w-xl">
              {t('startPetitionDesc')}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/wizard')}
              className="w-full sm:w-auto min-h-[46px] px-6 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-amber-300 active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-900" />
              <span>{t('startBtn')}</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>

            <button
              onClick={() => navigate('/petitions')}
              className="w-full sm:w-auto min-h-[46px] px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t('navPetitions')} ({petitions.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Insights & Standards Card (4 cols) */}
        <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'மனு நெறிமுறைகள்' : 'Petition Protocol'}</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{language === 'ta' ? 'Tanglish பேச்சு உள்ளீட்டை தூய அரசு சட்ட நடையாக மாற்றும்' : 'Translates spoken Tanglish into official legal Tamil'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{language === 'ta' ? 'துறை அதிகாரி மற்றும் அதிகார வரம்பு தானியங்கி பொருத்தம்' : 'Auto-routes problem to the exact designated officer'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{language === 'ta' ? 'அரசு முத்திரை மற்றும் கோப்பு எண் கொண்ட A4 PDF' : 'Official A4 PDF with state crest & reference number'}</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[11px] font-medium leading-snug">
              {language === 'ta' 
                ? 'உங்கள் தரவு சாதனத்திலேயே தனிப்பட்ட முறையில் பாதுகாக்கப்படுகிறது.' 
                : '100% Privacy-Preserved: Offline local database support.'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Frequent Departments Grid (Responsive Multi-Column) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'முக்கிய அரசுத் துறைகள்' : 'Frequent Government Departments'}</span>
          </h4>
          <span className="text-xs text-emerald-700 font-bold">
            {language === 'ta' ? 'நேரடியாக தொடங்க கிளிக் செய்க' : 'Click to Draft Directly'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Electricity / TANGEDCO */}
          <button
            onClick={() => handleStartCategory('Tamil Nadu Generation and Distribution Corporation Limited (TANGEDCO)')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'மின்வாரியம் (EB / TANGEDCO)' : 'Electricity Board (TANGEDCO)'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'தெருவிளக்கு, மின்கம்பி, மின்மாற்றி' : 'Power outages, transformer, streetlights'}
              </span>
            </div>
          </button>

          {/* Water Supply / TWAD */}
          <button
            onClick={() => handleStartCategory('Tamil Nadu Water Supply and Drainage Board (TWAD) / Municipal Water Works')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'குடிநீர் & வடிகால் (TWAD)' : 'Water Supply & Drainage (TWAD)'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'குழாய் உடைப்பு, கழிவுநீர் அடைப்பு' : 'Piped water, sewage, pipeline leak'}
              </span>
            </div>
          </button>

          {/* Roads & Highways */}
          <button
            onClick={() => handleStartCategory('Highways and Minor Ports Department / Municipal Engineering Wing')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'நெடுஞ்சாலை & சாலைகள்' : 'Roads & Highways Department'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'சாலை சீரமைப்பு, தார் சாலை, பள்ளங்கள்' : 'Tar road repairs, potholes, bridges'}
              </span>
            </div>
          </button>

          {/* Health & Sanitation */}
          <button
            onClick={() => handleStartCategory('Municipal Corporation / Town Panchayat Health & Sanitation Department')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50/90 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'சுகாதாரம் & துப்புரவு' : 'Health & Public Sanitation'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'குப்பை அகற்றுதல், கொசு ஒழிப்பு' : 'Waste clearance, dengue fogging, hygiene'}
              </span>
            </div>
          </button>

          {/* Revenue & Patta */}
          <button
            onClick={() => handleStartCategory('Revenue and Disaster Management Department (வருவாய்த் துறை)')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50/90 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'பட்டா & வருவாய்த் துறை' : 'Revenue & Land Patta'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'நில அளவை, வட்டாட்சியர், சிட்டா' : 'Land survey, Tahsildar, Chitta transfer'}
              </span>
            </div>
          </button>

          {/* Collectorate Grievance Cell */}
          <button
            onClick={() => handleStartCategory('District Collectorate / Public Grievance Redressal Cell')}
            className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg transition-all text-left flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                {language === 'ta' ? 'மாவட்ட ஆட்சியர் குறைதீர்ப்பு மனு' : 'District Collector Grievance Cell'}
              </span>
              <span className="text-xs text-slate-500 block truncate mt-0.5">
                {language === 'ta' ? 'திங்கட்கிழமை மக்கள் குறைதீர்ப்பு மனு' : 'Monday public grievance petition'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Recent Activity Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>{t('recentActivity')}</span>
          </h4>
          {petitions.length > 0 && (
            <button
              onClick={() => navigate('/petitions')}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('viewAllPetitions')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {petitions.length === 0 ? (
          <div className="p-8 text-center bg-white/65 backdrop-blur-xl rounded-2xl border border-white/80 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50/80 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">{t('noRecentPetitions')}</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {language === 'ta' ? 'உங்கள் முதல் மனுவை உருவாக்க மேலே உள்ள புதிய மனு பொத்தானை அழுத்தவும்.' : 'Click Create Petition above to generate your first court-ready official draft.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {petitions.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('/petitions', { state: { selectedId: p.id } })}
                className="p-4 rounded-xl bg-white/65 backdrop-blur-xl border border-white/80 hover:bg-white/85 hover:border-emerald-400/80 hover:shadow-lg cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-1 pr-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {p.referenceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {language === 'ta' ? p.tamilOutput.subject : p.englishOutput.subject}
                  </h5>
                  <p className="text-xs text-slate-500 truncate">
                    {p.department}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. District Selection Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {language === 'ta' ? 'மாவட்டத்தை மாற்றவும்' : 'Select District Jurisdiction'}
                </h3>
              </div>
              <button
                onClick={() => setShowDistrictModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick search inside district modal */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder={language === 'ta' ? 'மாவட்ட பெயரைத் தேடுங்கள்...' : 'Search district...'}
                className="mobile-input pl-9 py-2 text-xs"
              />
            </div>

            <div className="overflow-y-auto space-y-1 flex-1 pr-1 max-h-72">
              {filteredDistricts.map((dist) => (
                <button
                  key={dist.en}
                  onClick={() => {
                    const updated = { ...profile, district: dist.en };
                    setProfile(updated);
                    saveUserProfile(updated);
                    setShowDistrictModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    profile.district === dist.en
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{dist.en}</span>
                  <span className="text-slate-500 font-semibold text-xs">{dist.ta}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
