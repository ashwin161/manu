import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { savePetitionToFirestore } from '@/lib/firebase';
import { TN_DEPARTMENTS, TN_DISTRICTS } from '@/src/data/tnDepartments';
import { VoiceInputButton } from '@/src/components/VoiceInputButton';
import { 
  Copy, 
  Download, 
  Save, 
  Volume2, 
  Check, 
  ArrowLeft, 
  RotateCcw,
  CheckCircle2,
  FileText,
  Landmark,
  Scale,
  Printer
} from 'lucide-react';

interface OutputFormat {
  header: string;
  department: string;
  recipient: string;
  applicant: string;
  subject: string;
  reference?: string;
  body: string;
  reliefRequested?: string;
  date: string;
  place: string;
  closing: string;
  [key: string]: unknown;
}

export const CreatePetitionPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isTa = language === 'ta';

  // Initial values from state
  const passedDept = (location.state as any)?.selectedDepartment || TN_DEPARTMENTS[0].name;
  const passedDist = (location.state as any)?.selectedDistrict || 'Madurai';

  // Form Inputs
  const [district, setDistrict] = useState(passedDist);
  const [department, setDepartment] = useState(passedDept);
  const [applicantName, setApplicantName] = useState('K. Murugan');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020');
  const [tanglishInput, setTanglishInput] = useState('');

  // UX & Focus States
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Action States
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'tamil' | 'english'>('tamil');

  // Outputs
  const [tamilOutput, setTamilOutput] = useState<OutputFormat | null>(null);
  const [englishOutput, setEnglishOutput] = useState<OutputFormat | null>(null);

  const handleSelectSample = (sampleText: string, deptName: string) => {
    setTanglishInput(sampleText);
    setDepartment(deptName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tanglishInput.trim().length < 10 || !department) return;

    setGenerating(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          applicantPhone: phone,
          applicantAddress: address,
          department,
          district,
          tanglishInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tamilOutput) setTamilOutput(data.tamilOutput);
        if (data.englishOutput) setEnglishOutput(data.englishOutput);
        setHasGenerated(true);
      } else {
        throw new Error('API response failed, using built-in generator');
      }
    } catch (err) {
      console.warn("Client fallback draft:", err);
      // Fallback generator ensures client never blocks
      const refNum = `SEC-TN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const currentDate = new Date().toLocaleDateString('en-GB');

      setTamilOutput({
        header: 'தமிழ்நாடு அரசு - பொதுக் குறைதீர்ப்பு மனு',
        department: `${department} - ${district} மாவட்டம்`,
        recipient: `உயர்திரு. உதவி செயற்பொறியாளர் / துறை அதிகாரி அவர்கள்,\n${department},\n${district} மாவட்டம்.`,
        applicant: `${applicantName},\n${address}.\nகைபேசி எண்: ${phone}`,
        subject: `பொருள்: ${district} பகுதியில் பொது நலன் கருதி உடனடி சீரமைப்பு மற்றும் துரித நடவடிக்கை மேற்கொள்ளக் கோருதல் - தொடர்பாக.`,
        reference: `மனு எண்: ${refNum}`,
        body: `வணக்கம்.\n\nமேற்கண்ட முகவரியில் வசிக்கும் நான் தங்களின் மேலான கவனத்திற்கு கொண்டுவருவது யாதெனில்:\n\nஎங்கள் பகுதியில் ${tanglishInput}.\n\nஇப்பிரச்சனையால் அப்பகுதி மக்கள், முதியோர்கள் மற்றும் குழந்தைகள் பெரும் சிரமத்திற்கு உள்ளாகியுள்ளனர். எனவே, பொதுமக்கள் நலன் கருதி தாங்கள் இவ்விவகாரத்தில் தனிக் கவனம் செலுத்தி, உடனடியாக ஆய்வு செய்து உரிய சீரமைப்பு நடவடிக்கைகளை போர்க்கால அடிப்படையில் எடுக்குமாறு பணிவன்புடன் வேண்டுகிறேன்.`,
        reliefRequested: 'பொதுமக்கள் பாதுகாப்பு மற்றும் நலன் கருதி உரிய அதிகாரிகளை அனுப்பி உடனடி சீரமைப்பு செய்தல்.',
        date: currentDate,
        place: district,
        closing: 'இப்படிக்கு தங்கள் உண்மையுள்ள,\n\n\n( ' + applicantName + ' )\nமனுதாரர் கையொப்பம்',
      });

      setEnglishOutput({
        header: 'GOVERNMENT OF TAMIL NADU - CITIZEN GRIEVANCE PETITION',
        department: `${department} - ${district} District`,
        recipient: `To,\nThe Competent Authority / Executive Officer,\n${department},\n${district} District, Tamil Nadu.`,
        applicant: `From:\n${applicantName},\n${address}.\nPhone: ${phone}`,
        subject: `Sub: Urgent grievance redressal and remedial measures requested regarding citizen issues in ${district} - Reg.`,
        reference: `Petition Docket No: ${refNum}`,
        body: `Respected Sir/Madam,\n\nI, the undersigned citizen residing at the above address, bring to your urgent attention the following grievance:\n\n${tanglishInput}\n\nDue to this prevailing condition, local residents, senior citizens, and children are facing significant hardship and safety hazards. Despite previous notifications, the situation remains unaddressed.\n\nTherefore, I humbly implore the competent authorities to inspect the site immediately and take swift remedial measures in the public interest.`,
        reliefRequested: 'Immediate on-site inspection and remedial action.',
        date: currentDate,
        place: district,
        closing: 'Yours faithfully,\n\n\n( ' + applicantName + ' )\nPetitioner Signature',
      });

      setHasGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!user) {
      alert(isTa ? "மனுவை சேமிக்க உள்நுழையவும்." : "Please login to save petition.");
      return;
    }

    if (!tamilOutput || !englishOutput) return;

    try {
      setSaving(true);
      await savePetitionToFirestore({
        userId: user.uid,
        department,
        tanglishInput,
        applicantName,
        applicantPhone: phone,
        applicantAddress: address,
        tamilOutput,
        englishOutput,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Save error:", err);
      alert(isTa ? "மனுவை சேமிப்பதில் பிழை ஏற்பட்டது." : "Error saving petition.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = () => {
    const activeData = activeTab === 'tamil' ? tamilOutput : englishOutput;
    if (!activeData) return;

    const fullText = [
      activeData.header,
      activeData.reference,
      '',
      activeTab === 'tamil' ? 'பெறுநர்:' : 'To:',
      activeData.recipient,
      '',
      activeTab === 'tamil' ? 'அனுப்புநர்:' : 'From:',
      activeData.applicant,
      '',
      activeData.subject,
      '',
      activeData.body,
      '',
      activeTab === 'tamil' ? `தேதி: ${activeData.date} | இடம்: ${activeData.place}` : `Date: ${activeData.date} | Place: ${activeData.place}`,
      '',
      activeData.closing,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(fullText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleSpeakAloud = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const activeData = activeTab === 'tamil' ? tamilOutput : englishOutput;
    if (!activeData) return;

    const utterance = new SpeechSynthesisUtterance(`${activeData.subject}. ${activeData.body}`);
    utterance.lang = activeTab === 'tamil' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const currentOutput = activeTab === 'tamil' ? tamilOutput : englishOutput;
  const isSubmitDisabled = tanglishInput.trim().length < 10 || !department || generating;

  return (
    <div id="petition-workspace-container" className="min-h-screen bg-[#fcfcfc] py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Workspace Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print border-b border-black pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white hover:bg-neutral-100 text-black border border-black shadow-2xs transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black"></span>
              <h1 className="text-xl font-bold font-display-serif text-black tracking-tight">
                {isTa ? 'அரசு மனு வரைவுப் பிரிவு' : 'Administrative Petition Drafting Suite'}
              </h1>
            </div>
            <p className="text-xs font-mono text-neutral-600 mt-0.5">
              {isTa ? 'தமிழ்நாடு அரசு தலைமைச் செயலகம் மற்றும் மாவட்ட ஆட்சியர் குறைதீர்ப்பு நெறிமுறை' : 'Official Tamil Nadu Secretariat & District Collectorate Grievance Protocol'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setApplicantName('K. Murugan');
            setPhone('9876543210');
            setAddress('14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020');
            setTanglishInput(
              'Madurai KK Nagar street light eriyala, transformer pakathula wire loose-aa irukku. 3 naala complaint panniyum aalu varala, accident aagidum bayama irukku...'
            );
          }}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-400 text-xs font-mono font-bold text-black transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
          <span>{isTa ? 'மாதிரி விவரங்கள் நிரப்புக' : 'Load Sample Case'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-neutral-100 border-2 border-black text-black text-xs sm:text-sm flex items-center justify-between no-print font-mono">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{t('savedSuccess')}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="font-bold underline text-black ml-4 hover:text-neutral-700"
          >
            {isTa ? 'காப்பகத்தில் காண்க →' : 'View in Dashboard →'}
          </button>
        </div>
      )}

      {/* Main Split-Screen Architecture */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Institutional Drafting Input Form */}
        <div id="petition-workspace-left" className="lg:col-span-5 bg-white border border-neutral-300 p-6 sm:p-7 shadow-xs space-y-5 transition-all duration-300">
          
          <div className="border-b border-neutral-200 pb-3">
            <h2 className="text-sm font-bold font-state-crest text-black uppercase tracking-wider">
              {isTa ? 'மனுதாரர் & குறைதீர்ப்பு விவரங்கள்' : 'PETITIONER & GRIEVANCE PARTICULARS'}
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5 font-legal-tamil">
              {isTa ? 'அரசுப் பதிவேட்டிற்கான விவரங்களை துல்லியமாக நிரப்பவும்' : 'Provide administrative jurisdiction and colloquial facts'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1-Click Tanglish Case Presets */}
            <div className={`space-y-1.5 transition-opacity duration-300 ${isSpotlightActive ? 'opacity-40' : 'opacity-100'}`}>
              <span className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block">
                {isTa ? 'உடனடி மாதிரி பிரச்சனைகள்' : '1-Click Presets'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TN_DEPARTMENTS.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectSample(d.sampleTanglish, d.name)}
                    className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 transition"
                  >
                    {isTa ? d.nameTamil.split(' ')[0] : d.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Administrative District & Department Selectors */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity duration-300 ${isSpotlightActive ? 'opacity-40' : 'opacity-100'}`}>
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-black mb-1">
                  {t('districtLabel')}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 gov-input text-xs font-medium text-black"
                >
                  {TN_DISTRICTS.map((dist) => (
                    <option key={dist.en} value={dist.en}>
                      {dist.en} ({dist.ta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-black mb-1">
                  {t('deptLabel')}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 gov-input text-xs font-medium text-black"
                >
                  {TN_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {isTa ? dept.nameTamil : dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Applicant Name & Phone */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity duration-300 ${isSpotlightActive ? 'opacity-40' : 'opacity-100'}`}>
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-black mb-1">
                  {t('applicantNameLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="K. Murugan / முருகன்"
                  className="w-full px-3 py-2 gov-input text-xs font-medium text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-black mb-1">
                  {t('phoneLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 gov-input text-xs font-medium text-black"
                />
              </div>
            </div>

            {/* Full Residential Address */}
            <div className={`transition-opacity duration-300 ${isSpotlightActive ? 'opacity-40' : 'opacity-100'}`}>
              <label className="block text-xs font-bold font-mono uppercase text-black mb-1">
                {t('addressLabel')}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020"
                className="w-full px-3 py-2 gov-input text-xs font-medium text-black"
              />
            </div>

            {/* SPOTLIGHT INPUT: Tanglish Issue Description */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-mono uppercase tracking-wide text-black">
                  {t('tanglishInputLabel')}
                </label>
                <VoiceInputButton
                  currentValue={tanglishInput}
                  onTranscript={(text) => {
                    setTanglishInput(text);
                  }}
                />
              </div>

              <div className="relative">
                <textarea
                  rows={6}
                  required
                  value={tanglishInput}
                  onFocus={() => setIsSpotlightActive(true)}
                  onBlur={() => setIsSpotlightActive(false)}
                  onChange={(e) => setTanglishInput(e.target.value)}
                  placeholder="Type or speak in casual Tanglish or colloquial Tamil... e.g. Madurai KK Nagar street light 15 naala eriyala sir, transformer pakathula wire loose-aa irukku, accident bayama irukku..."
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed font-mono text-black bg-white border transition-all duration-150 focus:outline-none ${
                    isSpotlightActive
                      ? 'border-black ring-1 ring-black shadow-xs opacity-100'
                      : 'border-neutral-300 hover:border-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-neutral-600 pt-0.5">
                <span className={tanglishInput.length >= 10 ? 'text-black font-semibold' : 'text-neutral-400'}>
                  {tanglishInput.length >= 10
                    ? `✓ ${isTa ? 'வரைவுக்கு தயாராக உள்ளது' : 'Ready for drafting'}`
                    : `${isTa ? 'குறைந்தது 10 எழுத்துக்கள் தேவை' : 'Minimum 10 characters required'}`}
                </span>
                <span className="font-mono text-black font-bold">{tanglishInput.length} chars</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 ${
                isSubmitDisabled
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                  : 'gov-btn-primary shadow-xs'
              }`}
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('generatingBtn')}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{t('generateBtn')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Official Physical Legal A4 Document Paper */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Progressive Disclosure Controls (Visible when petition exists) */}
          <div className={`transition-all duration-300 ${hasGenerated ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white border border-neutral-300 p-3 flex flex-wrap items-center justify-between gap-2.5 no-print shadow-2xs">
              
              {/* Language Selection Tabs */}
              <div className="inline-flex border border-black p-0.5 bg-white text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('tamil')}
                  className={`px-3 py-1 font-mono transition-colors ${
                    activeTab === 'tamil' ? 'bg-black text-white font-bold' : 'text-neutral-700'
                  }`}
                >
                  {t('tamilTab')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('english')}
                  className={`px-3 py-1 font-mono transition-colors ${
                    activeTab === 'english' ? 'bg-black text-white font-bold' : 'text-neutral-700'
                  }`}
                >
                  {t('englishTab')}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakAloud}
                  className={`p-2 border text-xs font-semibold transition ${
                    speaking 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white hover:bg-neutral-100 text-black border-neutral-300'
                  }`}
                  title={speaking ? 'Stop Reading' : t('readAloudBtn')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="gov-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 font-mono"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>{t('copiedFeedback')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('copyBtn')}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="gov-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 font-mono"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printBtn')}</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveToDashboard}
                  className="gov-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 font-mono"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : t('saveToDashboardBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Physical Legal A4 Document (Court-Ready Black & White) */}
          <div
            id="petition-a4-sheet"
            className="legal-a4-sheet p-10 sm:p-14 min-h-[820px] flex flex-col justify-between text-black bg-white border border-neutral-400"
          >
            {/* Blank State with Centered Gazette Icon before Generation */}
            {!hasGenerated || !currentOutput ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-28 select-none">
                <div className="w-16 h-16 bg-neutral-100 text-neutral-500 flex items-center justify-center mb-4 border border-neutral-300">
                  <Landmark className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold font-display-serif text-black">
                  {isTa ? 'அதிகாரப்பூர்வ அரசு மனு இங்கு தோன்றும்' : 'Official Secretariat Petition Will Appear Here'}
                </h3>
                <p className="text-xs text-neutral-500 font-legal-tamil max-w-sm mt-1 leading-relaxed">
                  {isTa 
                    ? 'இடதுபுற படிவத்தில் தகவல்களை உள்ளிட்டு "அரசு மனுவாக உடனே மாற்று" பொத்தானை அழுத்தவும்.'
                    : 'Submit petitioner facts on the left to generate an authoritative, court-ready memorandum.'}
                </p>
              </div>
            ) : (
              /* Populated Formal Legal A4 Document */
              <div className="space-y-6">
                
                {/* Official Gazette Header */}
                <div className="text-center border-b-2 border-black pb-5 mb-6 space-y-1">
                  <div className="font-state-crest font-bold text-xs tracking-widest text-neutral-600">
                    {activeTab === 'tamil' ? 'தமிழ்நாடு அரசு · GOVERNMENT OF TAMIL NADU' : 'GOVERNMENT OF TAMIL NADU'}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-display-serif text-black tracking-tight">
                    {currentOutput.header}
                  </h3>
                  <p className="text-xs font-mono text-neutral-600">
                    {currentOutput.department}
                  </p>
                  {currentOutput.reference && (
                    <div className="inline-block mt-2 font-mono text-xs font-bold border border-black px-3 py-0.5">
                      {currentOutput.reference}
                    </div>
                  )}
                </div>

                {/* To / From Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6">
                  <div className="border border-neutral-300 p-4 bg-white">
                    <span className="font-bold font-mono text-black uppercase block mb-1">
                      {activeTab === 'tamil' ? 'அனுப்புநர் (From):' : 'From:'}
                    </span>
                    <p className="whitespace-pre-line text-black leading-relaxed font-legal-tamil">
                      {currentOutput.applicant}
                    </p>
                  </div>

                  <div className="border border-neutral-300 p-4 bg-white">
                    <span className="font-bold font-mono text-black uppercase block mb-1">
                      {activeTab === 'tamil' ? 'பெறுநர் (To):' : 'To:'}
                    </span>
                    <p className="whitespace-pre-line text-black leading-relaxed font-legal-tamil">
                      {currentOutput.recipient}
                    </p>
                  </div>
                </div>

                {/* Subject Block (பொருள்) */}
                <div className="border-b border-black pb-3">
                  <div className={`text-xs sm:text-sm font-bold text-black leading-snug ${activeTab === 'tamil' ? 'font-legal-tamil' : 'font-legal-english'}`}>
                    {currentOutput.subject}
                  </div>
                </div>

                {/* Petition Body */}
                <div className={`text-xs sm:text-sm text-black leading-relaxed whitespace-pre-line space-y-3 ${activeTab === 'tamil' ? 'font-legal-tamil' : 'font-legal-english'}`}>
                  {currentOutput.body}
                </div>

                {/* Prayer / Relief Section */}
                {currentOutput.reliefRequested && (
                  <div className="border-t border-neutral-300 pt-3 text-xs">
                    <span className="font-bold font-mono text-black uppercase block mb-1">
                      {activeTab === 'tamil' ? 'கோரிக்கை (Relief Requested):' : 'Specific Relief Sought:'}
                    </span>
                    <p className={`text-neutral-800 ${activeTab === 'tamil' ? 'font-legal-tamil' : 'font-legal-english'}`}>
                      {currentOutput.reliefRequested}
                    </p>
                  </div>
                )}

                {/* Official Sign-off and Date / Place */}
                <div className="pt-8 flex justify-between items-end border-t border-black">
                  <div className="text-xs font-mono text-black space-y-1">
                    <div>தேதி (Date): <span className="font-bold">{currentOutput.date}</span></div>
                    <div>இடம் (Place): <span className="font-bold">{currentOutput.place}</span></div>
                    <div className="text-[10px] text-neutral-500 pt-1">
                      OFFICIALLY FILED VIA MANU CITIZEN PORTAL
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-legal-tamil font-bold">
                      இப்படிக்கு தங்கள் உண்மையுள்ள,
                    </div>
                    <div className="pt-8 text-xs font-mono text-neutral-700 underline">
                      ( {applicantName} )
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      மனுதாரர் கையொப்பம் / Signature
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
