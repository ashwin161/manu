import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { PetitionDocument, saveLocalPetition, clearLocalDraft } from '@/src/utils/storage';
import { downloadPetitionPDF, sharePetition } from '@/src/utils/pdfGenerator';
import { 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Home, 
  FileText, 
  Languages, 
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { TamilNaduEmblem } from '@/src/components/TamilNaduEmblem';

interface Step6Props {
  petition: PetitionDocument;
}

export const Step6ExportPDF: React.FC<Step6Props> = ({ petition }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [exportMode, setExportMode] = useState<'ta' | 'en' | 'dual'>(
    petition.preferredLang === 'en' ? 'en' : 'ta'
  );
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);

  // Auto-save to local storage on mount
  React.useEffect(() => {
    saveLocalPetition({
      ...petition,
      preferredLang: exportMode === 'dual' ? 'ta' : exportMode,
    });
    clearLocalDraft();
    setSavedLocally(true);
  }, [petition, exportMode]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadPetitionPDF(petition, exportMode);
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      await sharePetition(petition, exportMode === 'dual' ? 'ta' : exportMode);
    } catch (e) {
      console.error('Share failed', e);
    } finally {
      setSharing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeOutput = exportMode === 'en' ? petition.englishOutput : petition.tamilOutput;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step6Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step6Subtitle')}
        </p>
      </div>

      {/* Local Save Success Banner */}
      {savedLocally && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2 text-xs text-emerald-950 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{t('saveToDeviceBtn')}</span>
        </div>
      )}

      {/* Export Format Selector (Tamil / English / Dual Package) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          {language === 'ta' ? 'PDF பதிவிறக்க மொழித் தேர்வு:' : 'Choose PDF Output Language:'}
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setExportMode('ta')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              exportMode === 'ta' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            தமிழ் PDF
          </button>
          <button
            type="button"
            onClick={() => setExportMode('en')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              exportMode === 'en' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English PDF
          </button>
          <button
            type="button"
            onClick={() => setExportMode('dual')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              exportMode === 'dual' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ta' ? 'இருமொழி' : 'Bilingual'}
          </button>
        </div>
      </div>

      {/* Primary Action Buttons: Download PDF & Native Print */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full min-h-[50px] rounded-xl civic-gradient-header text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5 text-emerald-200" />
          <span>{downloading ? 'Preparing PDF...' : t('downloadPdfBtn')}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePrint}
            className="min-h-[44px] rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('printBtn')}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={sharing}
            className="min-h-[44px] rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>{t('shareBtn')}</span>
          </button>
        </div>
      </div>

      {/* Quality Certification Badge */}
      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {language === 'ta' 
              ? 'உயர் தெளிவுத்திறன் A4 ஆவணம் (தூய தமிழ் எழுத்துரு பிழையின்றி பதிவிறங்கும்)' 
              : 'High-Definition A4 Gazette (Pristine Unicode Tamil typography guaranteed)'}
          </span>
        </div>
        <span className="font-mono text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded font-bold text-emerald-900">
          HD A4
        </span>
      </div>

      {/* Official Document Gazette Preview Sheet */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border-2 border-slate-800 shadow-xl space-y-4 text-slate-900 font-serif">
        {/* Top Official Crest & Title */}
        <div className="text-center pb-3 border-b-2 border-emerald-800 space-y-1">
          <div className="flex justify-center mb-1">
            <TamilNaduEmblem size={44} variant="dark" />
          </div>
          <h4 className="font-state-crest font-extrabold text-sm sm:text-base tracking-wider text-emerald-900">
            {exportMode === 'en' ? 'GOVERNMENT OF TAMIL NADU' : 'தமிழ்நாடு அரசு'}
          </h4>
          <h5 className="text-xs font-bold text-blue-900 tracking-wide font-sans">
            {exportMode === 'en' ? 'OFFICIAL GRIEVANCE PETITION' : 'பொதுக் குறைதீர்ப்பு மனு'}
          </h5>
          <p className="text-[11px] text-slate-600 font-sans font-medium">
            {activeOutput.department} • {petition.district}
          </p>
        </div>

        {/* Ref and Date */}
        <div className="flex items-center justify-between text-[11px] font-mono border-b pb-2 text-slate-600">
          <span><strong>{exportMode === 'en' ? 'Ref No:' : 'மனு எண்:'}</strong> {activeOutput.reference}</span>
          <span><strong>{exportMode === 'en' ? 'Date:' : 'நாள்:'}</strong> {activeOutput.date}</span>
        </div>

        {/* Structured From and To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-emerald-800 block text-[11px] mb-1 font-sans uppercase">
              {exportMode === 'en' ? 'From:' : 'அனுப்புநர்:'}
            </span>
            <div className="font-bold text-slate-900">{petition.applicantName}</div>
            <div className="text-slate-600 text-[11px] whitespace-pre-line mt-0.5">{petition.applicantAddress}</div>
            <div className="text-slate-500 text-[10px] font-mono mt-1">Phone: {petition.applicantPhone}</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-blue-800 block text-[11px] mb-1 font-sans uppercase">
              {exportMode === 'en' ? 'To:' : 'பெறுநர்:'}
            </span>
            <div className="font-bold text-slate-900">{petition.recipientDesignation || (exportMode === 'en' ? 'The Competent Officer' : 'உயர்திரு துறை அதிகாரி')}</div>
            <div className="text-slate-600 text-[11px] mt-0.5">{petition.department}</div>
            <div className="text-slate-500 text-[10px] mt-1">{petition.district} மாவட்ட ஆட்சியரகம்</div>
          </div>
        </div>

        {/* Subject */}
        <div className="bg-emerald-50/70 border-l-4 border-emerald-700 p-2.5 rounded text-xs">
          <span className="font-bold text-emerald-950 font-sans">{exportMode === 'en' ? 'Subject: ' : 'பொருள்: '}</span>
          <span className="font-medium text-slate-900">{activeOutput.subject}</span>
        </div>

        {/* Petition Body */}
        <div className="text-xs text-slate-800 max-h-48 overflow-y-auto bg-slate-50/60 p-3 rounded-lg border border-slate-200 leading-relaxed font-serif text-justify whitespace-pre-line">
          {activeOutput.body}
        </div>

        {/* Relief Requested */}
        {activeOutput.reliefRequested && (
          <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded text-xs">
            <span className="font-bold text-blue-950 font-sans block mb-0.5">
              {exportMode === 'en' ? 'Relief Prayed For:' : 'கோரப்படும் தீர்வு:'}
            </span>
            <span className="text-slate-800">{activeOutput.reliefRequested}</span>
          </div>
        )}

        {/* Footer Signature */}
        <div className="flex justify-between items-end pt-3 border-t text-xs text-slate-600">
          <div>
            <div><strong>{exportMode === 'en' ? 'Place:' : 'இடம்:'}</strong> {activeOutput.place}</div>
            <div><strong>{exportMode === 'en' ? 'Date:' : 'நாள்:'}</strong> {activeOutput.date}</div>
          </div>
          <div className="text-right">
            <div className="italic text-[11px] text-slate-500 mb-4">{exportMode === 'en' ? 'Yours faithfully,' : 'இப்படிக்கு தங்கள் உண்மையுள்ள,'}</div>
            <div className="font-bold text-slate-900">({petition.applicantName})</div>
            <div className="text-[10px] text-slate-500">{exportMode === 'en' ? 'Petitioner Signature' : 'மனுதாரர் கையொப்பம்'}</div>
          </div>
        </div>
      </div>

      {/* Return to Dashboard or Home */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex-1 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{t('navHome')}</span>
        </button>

        <button
          onClick={() => navigate('/petitions')}
          className="flex-1 min-h-[44px] rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>{t('navPetitions')}</span>
        </button>
      </div>
    </div>
  );
};
