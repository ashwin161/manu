import React from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { TN_DEPARTMENTS } from '@/src/data/tnDepartments';
import { HelpCircle, Building2, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

interface Step2Props {
  data: any;
  onChange: (field: string, val: any) => void;
  onNext: () => void;
}

export const Step2Recipient: React.FC<Step2Props> = ({ data, onChange, onNext }) => {
  const { t, language } = useLanguage();

  const isUnknown = data.isUnknownAuthority;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step2Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step2Subtitle')}
        </p>
      </div>

      {/* "I don't know who to address" Banner / Toggle */}
      <button
        type="button"
        onClick={() => onChange('isUnknownAuthority', !isUnknown)}
        className={`w-full p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
          isUnknown
            ? 'bg-emerald-50 border-emerald-500 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUnknown ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}>
          <HelpCircle className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              {t('dontKnowAuthority')}
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isUnknown ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
            }`}>
              {isUnknown ? 'Selected' : 'Tap to Enable'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {t('dontKnowAuthorityHint')}
          </p>
        </div>
      </button>

      {/* Department Selector (Disabled or Secondary if "I don't know" is chosen) */}
      {!isUnknown ? (
        <div className="space-y-3.5 p-4 bg-white rounded-xl border border-slate-200">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('selectDeptLabel')}</span>
            </label>
            <select
              value={data.department}
              onChange={(e) => onChange('department', e.target.value)}
              className="mobile-input text-xs font-medium"
            >
              {TN_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {language === 'ta' ? dept.nameTamil : dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('recipientDesignationLabel')}</span>
            </label>
            <input
              type="text"
              value={data.recipientDesignation}
              onChange={(e) => onChange('recipientDesignation', e.target.value)}
              placeholder={t('recipientDesignationPlaceholder')}
              className="mobile-input text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'ta'
              ? 'அடுத்த படியில் உங்கள் பிரச்சனையை விவரித்தவுடன், உரிய அரசுத் துறையை Gemini AI தேர்வு செய்யும்.'
              : 'Gemini AI will automatically select the right department after you describe your issue in the next step.'}
          </span>
        </div>
      )}

      {/* Floating Bottom Continue CTA */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={onNext}
          className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
