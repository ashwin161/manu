import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { PetitionDocument } from '@/src/utils/storage';
import { 
  FileText, 
  Sparkles, 
  Edit3, 
  Check, 
  ArrowRight, 
  Languages, 
  ShieldCheck,
  Zap,
  Minimize2,
  AlertCircle
} from 'lucide-react';

interface Step5Props {
  data: any;
  petition: PetitionDocument | null;
  onUpdatePetition: (pet: PetitionDocument) => void;
  onNext: () => void;
}

export const Step5DraftReview: React.FC<Step5Props> = ({
  data,
  petition,
  onUpdatePetition,
  onNext,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(!petition);
  const [letterLang, setLetterLang] = useState<'ta' | 'en'>('ta');
  const [isEditing, setIsEditing] = useState(false);
  const [polishing, setPolishing] = useState(false);

  // Form edit states
  const [subjectEdit, setSubjectEdit] = useState('');
  const [bodyEdit, setBodyEdit] = useState('');
  const [reliefEdit, setReliefEdit] = useState('');

  useEffect(() => {
    if (petition) {
      const activeOutput = letterLang === 'ta' ? petition.tamilOutput : petition.englishOutput;
      setSubjectEdit(activeOutput.subject || '');
      setBodyEdit(activeOutput.body || '');
      setReliefEdit(activeOutput.reliefRequested || '');
      return;
    }

    let isMounted = true;
    const generateDraft = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicantName: data.applicantName,
            applicantPhone: data.applicantPhone,
            applicantAddress: data.applicantAddress,
            department: data.department,
            recipientDesignation: data.recipientDesignation,
            district: data.district,
            taluk: data.taluk,
            tanglishInput: data.tanglishInput,
          }),
        });

        const json = await res.json();
        if (isMounted) {
          const newDoc: PetitionDocument = {
            id: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            createdAt: new Date().toISOString(),
            applicantName: data.applicantName,
            applicantPhone: data.applicantPhone,
            applicantAddress: data.applicantAddress,
            district: data.district,
            taluk: data.taluk,
            pincode: data.pincode,
            department: data.department,
            recipientDesignation: data.recipientDesignation,
            tanglishInput: data.tanglishInput,
            referenceNumber: json.referenceNumber || json.tamilOutput.reference?.replace(/[^0-9A-Z-]/g, '') || `SEC-TN-${Date.now()}`,
            tamilOutput: json.tamilOutput,
            englishOutput: json.englishOutput,
            preferredLang: letterLang,
          };

          onUpdatePetition(newDoc);
          setSubjectEdit(newDoc.tamilOutput.subject);
          setBodyEdit(newDoc.tamilOutput.body);
          setReliefEdit(newDoc.tamilOutput.reliefRequested || '');
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to generate petition draft', e);
        setLoading(false);
      }
    };

    generateDraft();
    return () => {
      isMounted = false;
    };
  }, [petition, data, onUpdatePetition, letterLang]);

  // Sync edits when switching language
  const handleSwitchLanguage = (lang: 'ta' | 'en') => {
    setLetterLang(lang);
    if (petition) {
      const activeOutput = lang === 'ta' ? petition.tamilOutput : petition.englishOutput;
      setSubjectEdit(activeOutput.subject || '');
      setBodyEdit(activeOutput.body || '');
      setReliefEdit(activeOutput.reliefRequested || '');
      setIsEditing(false);
    }
  };

  const handleSaveEdits = () => {
    if (!petition) return;

    if (letterLang === 'ta') {
      const updated = {
        ...petition,
        tamilOutput: {
          ...petition.tamilOutput,
          subject: subjectEdit,
          body: bodyEdit,
          reliefRequested: reliefEdit,
        },
      };
      onUpdatePetition(updated);
    } else {
      const updated = {
        ...petition,
        englishOutput: {
          ...petition.englishOutput,
          subject: subjectEdit,
          body: bodyEdit,
          reliefRequested: reliefEdit,
        },
      };
      onUpdatePetition(updated);
    }
    setIsEditing(false);
  };

  const handleAiPolish = async (action: 'formal' | 'concise' | 'urgent') => {
    if (!petition) return;
    setPolishing(true);
    try {
      const currentActiveBody = letterLang === 'ta' ? petition.tamilOutput.body : petition.englishOutput.body;
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBody: currentActiveBody,
          action,
          language: letterLang,
        }),
      });
      const json = await res.json();
      if (json.refinedBody) {
        setBodyEdit(json.refinedBody);
        if (letterLang === 'ta') {
          onUpdatePetition({
            ...petition,
            tamilOutput: { ...petition.tamilOutput, body: json.refinedBody },
          });
        } else {
          onUpdatePetition({
            ...petition,
            englishOutput: { ...petition.englishOutput, body: json.refinedBody },
          });
        }
      }
    } catch (e) {
      console.error('Polish error', e);
    } finally {
      setPolishing(false);
    }
  };

  if (loading || !petition) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full civic-gradient-subtle border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-700 animate-spin">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-800">
            {language === 'ta' ? 'அரசு மனு உருவாக்கப்படுகிறது...' : 'Drafting Formal Secretariat Petition...'}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் பேச்சு மொழியை சட்ட நடைக்கு ஏற்ப தமிழ் மற்றும் ஆங்கிலத்தில் மாற்றுகிறோம்.'
              : 'Translating informal language into court-ready Tamil and English letters.'}
          </p>
        </div>
      </div>
    );
  }

  const activeOutput = letterLang === 'ta' ? petition.tamilOutput : petition.englishOutput;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step5Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step5Subtitle')}
        </p>
      </div>

      {/* Petition Letter Language Switcher (தமிழ் ⇄ English) */}
      <div className="p-2 bg-slate-200/80 rounded-2xl flex items-center gap-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => handleSwitchLanguage('ta')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            letterLang === 'ta'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Languages className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('langTamilBtn')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchLanguage('en')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            letterLang === 'en'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Languages className="w-3.5 h-3.5 text-blue-700" />
          <span>{t('langEnglishBtn')}</span>
        </button>
      </div>

      {/* AI Quick Polish Actions Strip */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          {t('aiPolishTools')}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            disabled={polishing || isEditing}
            onClick={() => handleAiPolish('formal')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-[11px] font-bold text-slate-700 flex flex-col items-center text-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="leading-tight">{t('polishFormal')}</span>
          </button>

          <button
            type="button"
            disabled={polishing || isEditing}
            onClick={() => handleAiPolish('concise')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-[11px] font-bold text-slate-700 flex flex-col items-center text-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            <Minimize2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="leading-tight">{t('polishConcise')}</span>
          </button>

          <button
            type="button"
            disabled={polishing || isEditing}
            onClick={() => handleAiPolish('urgent')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-[11px] font-bold text-slate-700 flex flex-col items-center text-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            <Zap className="w-3.5 h-3.5 text-rose-600" />
            <span className="leading-tight">{t('polishUrgent')}</span>
          </button>
        </div>
      </div>

      {/* Document Card Layout */}
      <div className="petition-a4-sheet p-4 rounded-xl space-y-3 text-slate-900 border-slate-300">
        {/* Document Header */}
        <div className="text-center border-b pb-2.5 space-y-0.5">
          <p className="text-[11px] font-state-crest font-bold text-slate-900 tracking-wider">
            {activeOutput.header}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            {activeOutput.department}
          </p>
          <p className="text-[10px] font-mono font-bold text-emerald-800 pt-0.5">
            {activeOutput.reference}
          </p>
        </div>

        {/* From & To */}
        <div className="text-xs space-y-2">
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              {letterLang === 'ta' ? 'அனுப்புநர்:' : 'From:'}
            </span>
            <p className="text-slate-700 whitespace-pre-line pl-2 text-[11px]">
              {activeOutput.applicant}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-900 block text-[11px]">
              {letterLang === 'ta' ? 'பெறுநர்:' : 'To:'}
            </span>
            <p className="text-slate-700 whitespace-pre-line pl-2 text-[11px]">
              {activeOutput.recipient}
            </p>
          </div>
        </div>

        {/* Subject (Editable) */}
        <div>
          <span className="font-bold text-slate-900 block text-[11px]">
            {letterLang === 'ta' ? 'பொருள்:' : 'Subject:'}
          </span>
          {isEditing ? (
            <textarea
              rows={2}
              value={subjectEdit}
              onChange={(e) => setSubjectEdit(e.target.value)}
              className="mobile-input text-xs mt-1"
            />
          ) : (
            <p className="text-xs font-semibold text-slate-900 pl-2 leading-relaxed">
              {activeOutput.subject}
            </p>
          )}
        </div>

        {/* Body (Editable) */}
        <div>
          <span className="font-bold text-slate-900 block text-[11px]">
            {letterLang === 'ta' ? 'மனு விவரம் / கோரிக்கை:' : 'Petition Body:'}
          </span>
          {isEditing ? (
            <textarea
              rows={8}
              value={bodyEdit}
              onChange={(e) => setBodyEdit(e.target.value)}
              className="mobile-input text-xs leading-relaxed mt-1"
            />
          ) : (
            <div className={`text-xs text-slate-800 leading-relaxed pl-2 whitespace-pre-line ${
              letterLang === 'ta' ? 'font-legal-tamil' : 'font-legal-english'
            }`}>
              {activeOutput.body}
            </div>
          )}
        </div>

        {/* Relief Prayed For (Editable) */}
        {activeOutput.reliefRequested && (
          <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200">
            <span className="font-bold text-emerald-950 block text-[11px]">
              {letterLang === 'ta' ? 'கோரப்படும் உடனடி நிவாரணம்:' : 'Relief & Action Prayed For:'}
            </span>
            {isEditing ? (
              <textarea
                rows={2}
                value={reliefEdit}
                onChange={(e) => setReliefEdit(e.target.value)}
                className="mobile-input text-xs mt-1"
              />
            ) : (
              <p className="text-xs text-emerald-900 pl-1 mt-0.5 leading-relaxed font-medium">
                {activeOutput.reliefRequested}
              </p>
            )}
          </div>
        )}

        {/* Date & Signature */}
        <div className="flex items-end justify-between pt-3 border-t text-[11px] text-slate-600">
          <div>
            <p>{letterLang === 'ta' ? 'இடம்: ' : 'Place: '} {activeOutput.place}</p>
            <p>{letterLang === 'ta' ? 'நாள்: ' : 'Date: '} {activeOutput.date}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 italic">
              {letterLang === 'ta' ? 'இப்படிக்கு தங்கள் உண்மையுள்ள,' : 'Yours faithfully,'}
            </p>
            <p className="font-bold text-slate-900 mt-2">({data.applicantName})</p>
          </div>
        </div>
      </div>

      {/* Edit Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSaveEdits();
            } else {
              setIsEditing(true);
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-sm min-h-[38px]"
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{isEditing ? t('saveEditsBtn') : t('editDraftBtn')}</span>
        </button>

        <span className="text-[11px] text-slate-400">
          {letterLang === 'ta' ? 'தமிழ் வடிவம்' : 'English Format'}
        </span>
      </div>

      {/* Floating Bottom Continue CTA */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={onNext}
          className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span>{language === 'ta' ? 'இறுதி PDF உருவாக்கவும்' : 'Proceed to Generate PDF'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
