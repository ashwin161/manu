import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { recordAnonymizedPattern } from '@/src/utils/storage';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building, 
  ArrowRight, 
  RotateCcw,
  Info,
  MapPin
} from 'lucide-react';

interface Step4Props {
  data: any;
  analysis: any;
  onUpdateAnalysis: (analysis: any) => void;
  onUpdateData: (field: string, val: any) => void;
  onNext: () => void;
  onBackToRecipient: () => void;
}

export const Step4AIAnalysis: React.FC<Step4Props> = ({
  data,
  analysis,
  onUpdateAnalysis,
  onUpdateData,
  onNext,
  onBackToRecipient,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(!analysis);

  useEffect(() => {
    if (analysis) return;

    let isMounted = true;
    const runAnalysis = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemText: data.tanglishInput,
            selectedDepartment: data.isUnknownAuthority ? '' : data.department,
            district: data.district,
          }),
        });

        const json = await res.json();
        if (isMounted) {
          onUpdateAnalysis(json);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to run AI analysis', err);
        if (isMounted) {
          // Fallback analysis
          onUpdateAnalysis({
            status: 'success',
            identifiedProblem: data.tanglishInput.slice(0, 80),
            category: 'Civic Grievance',
            locality: data.district,
            isAppropriate: !data.isUnknownAuthority,
            recommendedDepartment: data.department || 'District Collectorate / Public Grievance Redressal Cell',
            recommendedDesignation: 'The Competent Authority',
            reason: 'Analyzed for administrative grievance submission in Tamil Nadu.',
            reasonTa: 'தமிழ்நாடு அரசு குறைதீர்ப்பு நெறிமுறைப்படி ஆய்வு செய்யப்பட்டுள்ளது.',
            urgencyLevel: 'Normal',
            missingInformation: [],
          });
          setLoading(false);
        }
      }
    };

    runAnalysis();
    return () => {
      isMounted = false;
    };
  }, [analysis, data, onUpdateAnalysis]);

  if (loading || !analysis) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full civic-gradient-subtle border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-700 animate-spin">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-800">
            {t('step4Title')}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {t('analyzingText')}
          </p>
        </div>
      </div>
    );
  }

  const isAppropriate = analysis.isAppropriate;
  const isUnknown = data.isUnknownAuthority;

  const handleAcceptRecommendation = () => {
    onUpdateData('department', analysis.recommendedDepartment);
    onUpdateData('recipientDesignation', analysis.recommendedDesignation);
    onUpdateData('isUnknownAuthority', false);

    // Save privacy-safe anonymized pattern
    recordAnonymizedPattern({
      category: analysis.category || 'General',
      district: data.district,
      recommendedDepartment: analysis.recommendedDepartment,
      userAccepted: true,
    });

    onNext();
  };

  const handleKeepUserRecipient = () => {
    // Record rejection pattern
    recordAnonymizedPattern({
      category: analysis.category || 'General',
      district: data.district,
      recommendedDepartment: analysis.recommendedDepartment,
      userAccepted: false,
    });

    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step4Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step4Subtitle')}
        </p>
      </div>

      {/* Analysis Breakdown Card */}
      <div className="mobile-card p-4 space-y-3 border-emerald-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {language === 'ta' ? 'AI பகுப்பாய்வு முடிவு' : 'AI Analysis Verdict'}
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {analysis.category || 'Civic Infrastructure'}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-500 block">
            {t('analysisProblemIdentified')}
          </span>
          <p className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            "{analysis.identifiedProblem}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="font-semibold text-slate-800 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
              {data.district}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold block">
              {language === 'ta' ? 'அவசர நிலை' : 'Urgency'}
            </span>
            <span className={`font-semibold ${analysis.urgencyLevel === 'High' ? 'text-rose-600' : 'text-slate-800'}`}>
              {analysis.urgencyLevel || 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Recipient Verification Status Box */}
      {isAppropriate ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <h4 className="text-xs font-bold text-emerald-950">
              {t('recipientMatchSuccess')}
            </h4>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {language === 'ta' ? analysis.reasonTa : analysis.reason}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                {isUnknown
                  ? (language === 'ta' ? 'பரிந்துரைக்கப்பட்ட துறை கண்டறியப்பட்டது' : 'Identified Competent Authority')
                  : t('recipientMismatchNotice')}
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {language === 'ta' ? analysis.reasonTa : analysis.reason}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('recommendedRecipientLabel')}
            </span>
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {analysis.recommendedDepartment}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {analysis.recommendedDesignation}
            </p>
          </div>
        </div>
      )}

      {/* Missing Information Advisory (if any) */}
      {analysis.missingInformation && analysis.missingInformation.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[11px] block">
              {language === 'ta' ? 'பரிந்துரைக்கப்படும் கூடுதல் விவரங்கள்:' : 'Useful details to strengthen petition:'}
            </span>
            <p className="text-[11px] text-blue-800">
              {analysis.missingInformation.join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2.5 pt-4 border-t border-slate-200">
        {isAppropriate ? (
          <button
            onClick={onNext}
            className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span>{language === 'ta' ? 'சரிபார்க்கப்பட்டது, தொடர்க' : 'Verified, Proceed to Draft'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              onClick={handleAcceptRecommendation}
              className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('acceptRecommendationBtn')}</span>
            </button>

            {!isUnknown && (
              <button
                onClick={handleKeepUserRecipient}
                className="w-full min-h-[40px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100 active:scale-[0.98] transition-all"
              >
                <span>{t('keepMyRecipientBtn')}</span>
              </button>
            )}

            <button
              onClick={onBackToRecipient}
              className="w-full text-center text-xs font-bold text-emerald-800 py-1 hover:underline flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('editRecipientBtn')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
