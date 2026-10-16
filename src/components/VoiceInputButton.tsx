import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  currentValue: string;
}

export const VoiceInputButton: React.FC<VoiceInputProps> = ({ onTranscript, currentValue }) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ta-IN';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscript) {
        onTranscript((currentValue ? currentValue + ' ' : '') + finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      if (event.error === 'not-allowed') {
        setStatusMessage(
          language === 'ta'
            ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டுள்ளது.'
            : 'Microphone permission blocked. Please allow mic.'
        );
      } else {
        setStatusMessage(`Mic: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentValue, onTranscript, language]);

  const toggleListening = () => {
    setStatusMessage(null);
    if (!recognitionRef.current) {
      alert(
        language === 'ta'
          ? 'இந்த உலாவியில் பேச்சு அறிதல் வசதி இல்லை. நீங்கள் நேரடியாக தட்டச்சு செய்யலாம்.'
          : 'Speech recognition is not supported on this browser. You can type directly.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setStatusMessage(
          language === 'ta'
            ? 'கேட்கிறது... தமிழில் அல்லது Tanglish-ல் பேசவும்'
            : 'Listening live... Speak in Tanglish or Tamil'
        );
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold transition-colors select-none border ${
            isListening
              ? 'bg-black text-white border-black'
              : 'bg-white hover:bg-neutral-100 text-black border-neutral-400 hover:border-black'
          }`}
          title="Dictate grievance in Tanglish or Tamil"
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5 text-white" />
              <span>{language === 'ta' ? 'பதிவாகிறது [நிறுத்த]' : 'RECORDING [STOP]'}</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-black" />
              <span>{language === 'ta' ? 'குரல் வழி பதிவு (Tamil/Tanglish)' : 'Voice Dictation (Tamil/Tanglish)'}</span>
            </>
          )}
        </button>

        {isListening && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-black text-[11px] font-mono text-black font-bold">
            <span className="w-2 h-2 bg-black inline-block animate-ping"></span>
            <span>LIVE AUDIO</span>
          </div>
        )}
      </div>

      {statusMessage && (
        <span className="text-[11px] font-mono text-neutral-600 px-0.5">
          {statusMessage}
        </span>
      )}
    </div>
  );
};
