import React from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { TN_DISTRICTS } from '@/src/data/tnDepartments';
import { User, Phone, MapPin, Building, ArrowRight } from 'lucide-react';

interface Step1Props {
  data: any;
  onChange: (field: string, val: string) => void;
  onNext: () => void;
}

export const Step1AboutYou: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const { t, language } = useLanguage();

  const isValid = data.applicantName.trim().length >= 2 && data.applicantPhone.trim().length >= 10;

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step1Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step1Subtitle')}
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-3.5">
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('fullName')} <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            value={data.applicantName}
            onChange={(e) => onChange('applicantName', e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className="mobile-input text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('phoneNumber')} <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="tel"
            maxLength={10}
            value={data.applicantPhone}
            onChange={(e) => onChange('applicantPhone', e.target.value.replace(/\D/g, ''))}
            placeholder={t('phoneNumberPlaceholder')}
            className="mobile-input text-sm font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('residentialAddress')} <span className="text-rose-500">*</span></span>
          </label>
          <textarea
            rows={2}
            value={data.applicantAddress}
            onChange={(e) => onChange('applicantAddress', e.target.value)}
            placeholder={t('residentialAddressPlaceholder')}
            className="mobile-input text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('district')}
            </label>
            <select
              value={data.district}
              onChange={(e) => onChange('district', e.target.value)}
              className="mobile-input text-xs font-semibold"
            >
              {TN_DISTRICTS.map((dist) => (
                <option key={dist.en} value={dist.en}>
                  {language === 'ta' ? dist.ta : dist.en}
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
              value={data.taluk}
              onChange={(e) => onChange('taluk', e.target.value)}
              placeholder={t('talukPlaceholder')}
              className="mobile-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('pincode')}
          </label>
          <input
            type="text"
            maxLength={6}
            value={data.pincode}
            onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder={t('pincodePlaceholder')}
            className="mobile-input text-xs font-mono"
          />
        </div>
      </div>

      {/* Floating Bottom Continue CTA */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full min-h-[48px] rounded-xl civic-gradient-header text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
