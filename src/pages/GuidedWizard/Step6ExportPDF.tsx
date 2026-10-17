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
  Building
} from 'lucide-react';

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

      {/* Mini Document Gazette Preview */}
      <div className="petition-a4-sheet p-4 rounded-xl border border-slate-300 space-y-2.5 text-slate-900">
        <div className="flex items-center justify-between border-b pb-1.5 text-[10px] text-slate-500 font-mono">
          <span>{activeOutput.reference}</span>
          <span>{activeOutput.date}</span>
        </div>

        <div className="text-center space-y-0.5">
          <h4 className="font-state-crest font-bold text-xs tracking-wider">
            {activeOutput.header}
          </h4>
          <p className="text-[10px] text-slate-600">{activeOutput.department}</p>
        </div>

        <div className="text-[11px] pt-1">
          <span className="font-bold">{exportMode === 'en' ? 'Subject: ' : 'பொருள்: '}</span>
          <span className="font-medium text-slate-800">{activeOutput.subject}</span>
        </div>

        <div className="text-[11px] text-slate-700 max-h-36 overflow-y-auto bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-serif">
          {activeOutput.body}
        </div>

        <div className="flex justify-between items-end pt-2 text-[10px] text-slate-500">
          <span>{exportMode === 'en' ? 'Place: ' : 'இடம்: '}{activeOutput.place}</span>
          <span className="font-bold text-slate-800">({petition.applicantName})</span>
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
