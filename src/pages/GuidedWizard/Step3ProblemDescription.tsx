import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { Mic, MicOff, ArrowRight, Sparkles, Volume2 } from 'lucide-react';

interface Step3Props {
  data: any;
  onChange: (field: string, val: string) => void;
  onNext: () => void;
}

export const Step3ProblemDescription: React.FC<Step3Props> = ({ data, onChange, onNext }) => {
  const { t, language } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          onChange('tanglishInput', (data.tanglishInput ? data.tanglishInput + ' ' : '') + transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, data.tanglishInput, onChange]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert(language === 'ta' ? 'உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.' : 'Speech recognition not supported on this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sampleCues = [
    {
      label: t('cueLight'),
      text: 'Madurai KK Nagar 4th street-la street light eriyala, transformer pakathula wire loose-aa irukku. 3 naala complaint panniyum aalu varala, accident aagidum bayama irukku.'
    },
    {
      label: t('cueWater'),
      text: 'எங்கள் தெருவில் கடந்த 5 நாட்களாக குடிநீர் விநியோகம் முற்றிலும் நின்றுவிட்டது. குடிநீர் குழாயில் உடைப்பு ஏற்பட்டு சாக்கடை நீர் கலக்கிறது, உடனடியாக சீரமைக்க வேண்டுகிறேன்.'
    },
    {
      label: t('cuePothole'),
      text: 'Main road-la periya kuzhi irukku. Mazhai thanni thengi bike accidents aagudhu, school bus poga mudiyala. Udane thar salai pottu thara vendugiren.'
    },
    {
      label: t('cueRation'),
      text: 'வட்ட வழங்கல் அலுவலகத்தில் குடும்ப அட்டை முகவரி மாற்ற விண்ணப்பித்து 40 நாட்கள் ஆகியும் பரிசீலனை செய்யப்படவில்லை. உரிய நடவடிக்கை கோருகிறேன்.'
    }
  ];

  const isValid = (data.tanglishInput || '').trim().length >= 10;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display-serif text-lg font-bold text-slate-900">
          {t('step3Title')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t('step3Subtitle')}
        </p>
      </div>

      {/* Main Textarea with Voice Dictation */}
      <div className="relative">
        <textarea
          rows={6}
          value={data.tanglishInput}
          onChange={(e) => onChange('tanglishInput', e.target.value)}
          placeholder={t('problemPlaceholder')}
          className="mobile-input text-sm leading-relaxed pb-12"
        />

        {/* Voice Trigger & Character count pinned inside bottom of textarea */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={toggleVoice}
            className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isListening ? (language === 'ta' ? 'கேட்கிறது...' : 'Listening...') : t('voiceInput')}</span>
          </button>

          <span className="text-[10px] text-slate-400 font-mono font-medium">
            {(data.tanglishInput || '').length} {t('charCount')}
          </span>
        </div>
      </div>

      {/* Quick Prompt Cues */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {t('quickPromptCues')}
        </span>
        <div className="space-y-1.5">
          {sampleCues.map((cue, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange('tanglishInput', cue.text)}
              className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-xs text-slate-700 flex items-center justify-between active:scale-[0.99] transition-all"
            >
              <span className="truncate pr-2 font-medium">{cue.label}</span>
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            </button>
          ))}
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
