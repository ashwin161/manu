import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { 
  getUserProfile, 
  getLocalDraft, 
  saveLocalDraft, 
  clearLocalDraft,
  PetitionDocument 
} from '@/src/utils/storage';
import { TN_DEPARTMENTS } from '@/src/data/tnDepartments';
import { Step1AboutYou } from './Step1AboutYou';
import { Step2Recipient } from './Step2Recipient';
import { Step3ProblemDescription } from './Step3ProblemDescription';
import { Step4AIAnalysis } from './Step4AIAnalysis';
import { Step5DraftReview } from './Step5DraftReview';
import { Step6ExportPDF } from './Step6ExportPDF';
import { ArrowLeft, X, Languages } from 'lucide-react';

export const WizardContainer: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedDept = (location.state as any)?.preselectedDept;

  // Initialize draft data
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState(() => {
    const profile = getUserProfile();
    const existingDraft = getLocalDraft();

    return existingDraft || {
      applicantName: profile.fullName || 'K. Murugan',
      applicantPhone: profile.phone || '9876543210',
      applicantAddress: profile.address || '14/2, 4th Cross Street, KK Nagar, Madurai',
      district: profile.district || 'Madurai',
      taluk: profile.taluk || '',
      pincode: profile.pincode || '625020',
      department: preselectedDept || TN_DEPARTMENTS[0].name,
      recipientDesignation: '',
      isUnknownAuthority: false,
      tanglishInput: '',
    };
  });

  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [generatedPetition, setGeneratedPetition] = useState<PetitionDocument | null>(null);

  // Auto-save draft on changes (before final step)
  useEffect(() => {
    if (step < 6) {
      saveLocalDraft(formData);
    }
  }, [formData, step]);

  const handleUpdateField = (field: string, val: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    if (window.confirm(language === 'ta' ? 'மனு வரைவை உள்ளூரில் சேமித்து முகப்புக்கு செல்லவா?' : 'Save draft locally and return home?')) {
      navigate('/');
    }
  };

  // Step names for progress indicator
  const stepTitlesEn = ['Personal', 'Recipient', 'Problem', 'AI Check', 'Draft', 'PDF'];
  const stepTitlesTa = ['தகவல்கள்', 'அதிகாரி', 'பிரச்சனை', 'சரிபார்ப்பு', 'மனு வரைவு', 'PDF'];

  return (
    <div className="flex-1 flex flex-col bg-transparent select-none">
      {/* Wizard Step Top Bar */}
      <div className="bg-white/75 backdrop-blur-xl border-b border-white/70 px-4 py-3 shrink-0 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-800 p-1 -ml-1 min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backBtn')}</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-extrabold text-emerald-800">
              {t('stepIndicator').replace('{step}', String(step))}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLanguage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold transition-all min-h-[32px] flex items-center gap-1"
            >
              <Languages className="w-3 h-3 text-emerald-700" />
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 p-1 min-h-[32px]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Step Visual Progress Tracker Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`flex-1 h-full transition-all duration-300 ${
                s <= step ? 'civic-gradient-accent' : 'bg-slate-200'
              } ${s > 1 ? 'border-l border-white' : ''}`}
            />
          ))}
        </div>

        {/* Micro Step Labels */}
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1 px-0.5">
          <span>{language === 'ta' ? stepTitlesTa[step - 1] : stepTitlesEn[step - 1]}</span>
          <span className="text-emerald-700 font-mono font-bold">{Math.round((step / 6) * 100)}%</span>
        </div>
      </div>

      {/* Step Body Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        {step === 1 && (
          <Step1AboutYou
            data={formData}
            onChange={handleUpdateField}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Recipient
            data={formData}
            onChange={handleUpdateField}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3ProblemDescription
            data={formData}
            onChange={handleUpdateField}
            onNext={() => {
              // Reset analysis if problem changed
              setAiAnalysis(null);
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <Step4AIAnalysis
            data={formData}
            analysis={aiAnalysis}
            onUpdateAnalysis={setAiAnalysis}
            onUpdateData={handleUpdateField}
            onNext={() => setStep(5)}
            onBackToRecipient={() => setStep(2)}
          />
        )}

        {step === 5 && (
          <Step5DraftReview
            data={formData}
            petition={generatedPetition}
            onUpdatePetition={setGeneratedPetition}
            onNext={() => setStep(6)}
          />
        )}

        {step === 6 && generatedPetition && (
          <Step6ExportPDF petition={generatedPetition} />
        )}
      </div>
    </div>
  );
};
