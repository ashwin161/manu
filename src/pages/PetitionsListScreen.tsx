import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/src/context/LanguageContext';
import { getLocalPetitions, deleteLocalPetition, PetitionDocument } from '@/src/utils/storage';
import { downloadPetitionPDF, sharePetition } from '@/src/utils/pdfGenerator';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Share2, 
  Trash2, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Building,
  ChevronRight,
  X
} from 'lucide-react';

export const PetitionsListScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [petitions, setPetitions] = useState<PetitionDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPetition, setSelectedPetition] = useState<PetitionDocument | null>(null);

  useEffect(() => {
    const list = getLocalPetitions();
    setPetitions(list);

    // If navigated from home with a selectedId
    const selectedId = (location.state as any)?.selectedId;
    if (selectedId) {
      const match = list.find(p => p.id === selectedId);
      if (match) setSelectedPetition(match);
    }
  }, [location.state]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(language === 'ta' ? 'இந்த மனுவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete this petition?')) {
      deleteLocalPetition(id);
      setPetitions(getLocalPetitions());
      if (selectedPetition?.id === id) {
        setSelectedPetition(null);
      }
    }
  };

  const filteredPetitions = petitions.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.referenceNumber.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      (p.tamilOutput.subject || '').toLowerCase().includes(q) ||
      (p.englishOutput.subject || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 p-4 space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display-serif text-lg font-bold text-slate-900">
            {t('navPetitions')}
          </h2>
          <p className="text-xs text-slate-500">
            {petitions.length} {language === 'ta' ? 'உள்ளூர் மனுக்கள்' : 'saved locally'}
          </p>
        </div>

        <button
          onClick={() => navigate('/wizard')}
          className="flex items-center gap-1.5 civic-gradient-header text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform min-h-[36px]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t('navNew')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === 'ta' ? 'மனு எண் அல்லது துறை கொண்டு தேடுங்கள்...' : 'Search by reference, dept, or district...'}
          className="mobile-input pl-9 text-xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Petitions List */}
      {filteredPetitions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">
            {searchTerm ? (language === 'ta' ? 'மனுக்கள் ஏதும் பொருந்தவில்லை' : 'No matching petitions found') : t('noRecentPetitions')}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {language === 'ta'
              ? 'உங்கள் குறைபாடுகளை மனுவாக மாற்றி அரசுக்கு சமர்ப்பிக்க இப்போதே தொடங்குங்கள்.'
              : 'Create court-ready petitions in minutes and keep offline copies on your phone.'}
          </p>
          <button
            onClick={() => navigate('/wizard')}
            className="mt-2 inline-flex items-center gap-1.5 civic-gradient-header text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('createNewPetition')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredPetitions.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPetition(p)}
              className="mobile-card-interactive p-4 cursor-pointer space-y-2 border border-slate-200 hover:border-emerald-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {p.referenceNumber}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {language === 'ta' ? p.tamilOutput.subject : p.englishOutput.subject}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {p.department}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {p.district}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  {language === 'ta' ? 'காண்க & பதிவிறக்குக' : 'View / Export'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Petition Inspection Drawer / Modal */}
      {selectedPetition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedPetition.referenceNumber}
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1 truncate max-w-[280px]">
                  {selectedPetition.department}
                </p>
              </div>

              <button
                onClick={() => setSelectedPetition(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs text-slate-700 font-serif leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="border-b pb-2 font-sans font-semibold text-slate-900 text-[11px]">
                {language === 'ta' ? selectedPetition.tamilOutput.subject : selectedPetition.englishOutput.subject}
              </div>
              <p className="whitespace-pre-line text-[11px]">
                {language === 'ta' ? selectedPetition.tamilOutput.body : selectedPetition.englishOutput.body}
              </p>
            </div>

            {/* Export & Share Options */}
            <div className="space-y-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => downloadPetitionPDF(selectedPetition, 'ta')}
                  className="p-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>தமிழ் PDF</span>
                </button>

                <button
                  onClick={() => downloadPetitionPDF(selectedPetition, 'en')}
                  className="p-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>English PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sharePetition(selectedPetition, 'ta')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('shareBtn')}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
