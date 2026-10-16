import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getUserPetitionsFromFirestore, PetitionDocument } from '@/lib/firebase';
import { 
  Plus, 
  Search, 
  Trash2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText,
  Clock,
  Landmark,
  Scale
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const isTa = language === 'ta';

  const [petitions, setPetitions] = useState<PetitionDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedPetition, setSelectedPetition] = useState<PetitionDocument | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'tamil' | 'english'>('tamil');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const fetchPetitions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserPetitionsFromFirestore(user.uid);
      setPetitions(data);
    } catch (err) {
      console.error("Failed to load petitions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, [user]);

  const handleDelete = (id?: string) => {
    if (!id) return;
    const msg = isTa 
      ? "இந்த மனுவை உங்கள் பதிவேட்டிலிருந்து நீக்க விரும்புகிறீர்களா?" 
      : "Are you sure you want to delete this petition record?";
    if (confirm(msg)) {
      const local = JSON.parse(localStorage.getItem('manu_local_petitions_db') || '[]');
      const filtered = local.filter((p: any) => p.id !== id);
      localStorage.setItem('manu_local_petitions_db', JSON.stringify(filtered));
      setPetitions((prev) => prev.filter((p) => p.id !== id));
      if (selectedPetition?.id === id) {
        setSelectedPetition(null);
      }
    }
  };

  const handleCopyModalText = () => {
    if (!selectedPetition) return;
    const target = activeModalTab === 'tamil' ? selectedPetition.tamilOutput : selectedPetition.englishOutput;
    const text = [
      target?.header,
      target?.reference,
      '',
      activeModalTab === 'tamil' ? 'பெறுநர்:' : 'To:',
      target?.recipient,
      '',
      activeModalTab === 'tamil' ? 'அனுப்புநர்:' : 'From:',
      target?.applicant,
      '',
      target?.subject,
      '',
      target?.body,
      '',
      target?.closing
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const filteredPetitions = petitions.filter((p) => {
    const matchesSearch =
      (p.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tanglishInput || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilOutput?.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.englishOutput?.subject || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDeptFilter === 'ALL' || (p.department || '').includes(selectedDeptFilter);

    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Black & White Institutional Banner */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black"></span>
            <span className="text-xs font-mono font-bold text-neutral-600 tracking-wider uppercase">
              {isTa ? 'அரசு மனுக்கள் பதிவேடு · CASE DOCKET REGISTER' : 'OFFICIAL CITIZEN CASE DOCKET REGISTER'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display-serif text-black tracking-tight mt-1">
            {t('dashboardTitle')}
          </h1>
          <p className="text-xs text-neutral-600 mt-1 font-mono">
            {isTa ? 'மனுதாரர்:' : 'Authenticated Petitioner:'}{' '}
            <span className="font-bold text-black">{user?.email || user?.displayName}</span>
            <span className="mx-2">·</span>
            <span>{t('totalPetitions')}: {petitions.length}</span>
          </p>
        </div>

        <Link
          to="/create"
          className="gov-btn-primary px-6 py-3 text-xs flex items-center justify-center gap-2 self-start sm:self-auto font-bold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newPetition')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-300 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 gov-input text-xs font-mono text-black"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs font-semibold">
          {['ALL', 'TANGEDCO', 'Corporation', 'Revenue', 'Police'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedDeptFilter(filter)}
              className={`px-3 py-1.5 transition-colors shrink-0 font-mono text-xs ${
                selectedDeptFilter === filter
                  ? 'bg-black text-white font-bold'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
              }`}
            >
              {filter === 'ALL' ? (isTa ? 'அனைத்து துறைகள்' : 'All Departments') : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Case File Grid / Empty State */}
      <div>
        {loading ? (
          <div className="py-20 text-center bg-white border border-neutral-300 p-8">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-neutral-700 mt-3 font-mono font-semibold">
              {isTa ? 'மனுக்கள் பதிவேடு திறக்கப்படுகிறது...' : 'Loading petition registry...'}
            </p>
          </div>
        ) : filteredPetitions.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-300 p-8 flex flex-col items-center">
            <div className="w-14 h-14 bg-neutral-100 text-neutral-600 flex items-center justify-center mb-3 border border-neutral-300">
              <Landmark className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold font-display-serif text-black">
              {searchQuery ? (isTa ? "பொருத்தமான மனுக்கள் இல்லை" : "No matching petition records") : t('noPetitions')}
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 leading-relaxed font-legal-tamil">
              {searchQuery
                ? (isTa ? "வேறு வார்த்தைகளை பயன்படுத்தி தேடவும்." : "Try searching by reference ID, department, or location.")
                : t('noPetitionsSubtitle')}
            </p>
            <div className="mt-5">
              <Link
                to="/create"
                className="gov-btn-primary px-6 py-2.5 text-xs inline-flex items-center gap-2 uppercase tracking-wider font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>{t('startPetitionBtn')}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPetitions.map((pet, idx) => (
              <div
                key={pet.id || idx}
                className="bg-white border border-neutral-300 p-5 flex flex-col justify-between hover:border-black transition-colors shadow-2xs group"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 border-b border-neutral-200 pb-2">
                    <span className="text-xs font-mono font-bold text-black uppercase">
                      {pet.department || 'General Grievance'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'Active Docket'}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold font-legal-tamil text-black line-clamp-2 leading-snug">
                      {pet.tamilOutput?.subject || pet.englishOutput?.subject || 'Government Grievance Petition'}
                    </h4>
                    <p className="text-xs text-neutral-700 line-clamp-3 italic bg-neutral-50 p-3 border border-neutral-200 leading-relaxed font-mono">
                      "{pet.tanglishInput}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
                    title={t('deletePetition')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPetition(pet);
                      setActiveModalTab('tamil');
                    }}
                    className="flex items-center gap-1.5 font-bold font-mono text-black hover:underline"
                  >
                    <span>{t('viewA4Draft')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to view full saved A4 petition */}
      {selectedPetition && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-black" />
                <h3 className="font-bold font-state-crest text-sm text-black">
                  OFFICIAL PETITION RECORD · DOCKET INSPECTION
                </h3>
              </div>
              <button
                onClick={() => setSelectedPetition(null)}
                className="text-xs font-mono font-bold px-3 py-1 border border-black hover:bg-neutral-100"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Modal Language Tabs */}
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div className="inline-flex border border-black p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveModalTab('tamil')}
                  className={`px-3 py-1 font-mono ${
                    activeModalTab === 'tamil' ? 'bg-black text-white' : 'text-neutral-700'
                  }`}
                >
                  தமிழ் மனு (Tamil)
                </button>
                <button
                  onClick={() => setActiveModalTab('english')}
                  className={`px-3 py-1 font-mono ${
                    activeModalTab === 'english' ? 'bg-black text-white' : 'text-neutral-700'
                  }`}
                >
                  English Letter
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyModalText}
                  className="gov-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1 font-mono"
                >
                  {copyFeedback ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copyFeedback ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="gov-btn-primary px-3 py-1.5 text-xs flex items-center gap-1 font-mono"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print A4</span>
                </button>
              </div>
            </div>

            {/* A4 Sheet Body */}
            {(() => {
              const activeData = activeModalTab === 'tamil' ? selectedPetition.tamilOutput : selectedPetition.englishOutput;
              return (
                <div className="border border-neutral-300 p-8 bg-white font-legal-tamil text-xs sm:text-sm space-y-4">
                  <div className="text-center border-b border-black pb-3 space-y-1">
                    <div className="font-state-crest text-xs tracking-widest text-neutral-600">
                      GOVERNMENT OF TAMIL NADU
                    </div>
                    <div className="font-bold text-sm text-black">
                      {activeData?.header}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {activeData?.department}
                    </div>
                    {activeData?.reference && (
                      <div className="font-mono text-xs text-black font-bold pt-1">
                        {activeData?.reference}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="font-bold uppercase text-neutral-700 block mb-1">
                        {activeModalTab === 'tamil' ? 'அனுப்புநர் (From):' : 'From:'}
                      </span>
                      <p className="whitespace-pre-line text-black pl-3 leading-snug">
                        {activeData?.applicant}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold uppercase text-neutral-700 block mb-1">
                        {activeModalTab === 'tamil' ? 'பெறுநர் (To):' : 'To:'}
                      </span>
                      <p className="whitespace-pre-line text-black pl-3 leading-snug">
                        {activeData?.recipient}
                      </p>
                    </div>

                    <div className="font-bold border-t border-neutral-200 pt-2 text-black leading-snug">
                      {activeData?.subject}
                    </div>

                    <div className="pt-2 text-neutral-900 leading-relaxed whitespace-pre-line">
                      {activeData?.body}
                    </div>

                    <div className="pt-6 flex justify-between items-end border-t border-neutral-200">
                      <div className="text-xs font-mono text-neutral-600">
                        Date: {activeData?.date || new Date().toLocaleDateString()}<br />
                        Place: {activeData?.place || 'Tamil Nadu'}
                      </div>
                      <div className="text-right">
                        <div className="font-bold whitespace-pre-line">
                          {activeData?.closing}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};
