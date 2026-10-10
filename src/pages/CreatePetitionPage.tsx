import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { savePetitionToFirestore } from '@/lib/firebase';

interface OutputFormat {
  header: string;
  department: string;
  recipient: string;
  applicant: string;
  subject: string;
  reference?: string;
  body: string;
  date: string;
  place: string;
  closing: string;
  [key: string]: unknown;
}

export const CreatePetitionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Inputs
  const [applicantName, setApplicantName] = useState('K. Murugan');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020');
  const [department, setDepartment] = useState('TANGEDCO (Electricity & Grid Grievance)');
  const [tanglishInput, setTanglishInput] = useState(
    'Madurai KK Nagar street light eriyala, transformer pakathula wire loose-aa irukku. 3 naala complaint panniyum aalu varala, accident aagidum bayama irukku...'
  );

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'tamil' | 'english'>('tamil');

  // Outputs (initialized with the mock format)
  const [tamilOutput, setTamilOutput] = useState<OutputFormat>({
    header: 'தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு',
    department: 'TANGEDCO • Assistant Executive Engineer, K.K. Nagar Division',
    recipient: 'உதவி செயற்பொறியாளர் (AEE),\nநகரிய உபகோட்டம்,\nகே.கே. நகர் மின் பகிர்மான வட்டம், மதுரை - 625020.',
    applicant: 'திரு. K. Murugan,\n14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020\nதொலைபேசி: 9876543210',
    subject: 'பொருள்: கே.கே. நகர் பிரதான சாலையில் ஆபத்தான மின்கம்பி பழுதுநீக்கம் மற்றும் தெருவிளக்கு சீரமைத்தல் கோருதல் - தொடர்பாக.',
    reference: 'மனு குறிப்பு எண்: SEC-TN-2026-4819',
    body: 'மதிப்பிற்குரிய ஐயா / அம்மா,\n\nவணக்கம். நான் மேற்கண்ட முகவரியில் வசித்து வரும் குடிமகன் ஆவேன்.\n\nஎங்கள் பகுதியில் (கே.கே. நகர் பிரதான சாலை மற்றும் மின்மாற்றி அருகே) கடந்த 3 நாட்களாக தெருவிளக்குகள் எரியாமல் இருள் சூழ்ந்து காணப்படுகிறது. மேலும், மின்மாற்றி அருகே மின்கம்பிகள் மிகத் தாழ்வாகவும் தளர்வாகவும் தொங்கிக் கொண்டிருப்பதால் அவ்வழியே செல்லும் பள்ளி குழந்தைகள் மற்றும் பொதுமக்களுக்கு மிகக் கடுமையான மின்கசிவு விபத்து அபாயம் நிலவுகிறது.\n\nஇதுகுறித்து களப்பணியாளர்களிடம் வாய்மொழியாக தெரிவித்தும் இதுவரை எவ்வித சீரமைப்பு நடவடிக்கையும் மேற்கொள்ளப்படவில்லை.\n\nஆகவே, பொதுமக்களின் பாதுகாப்பு மற்றும் உயிர்பாதுகாப்பை கருதி, தாங்கள் உடனடியாக சம்பவ இடத்தை நேரில் ஆய்வு செய்து, பழுதடைந்து தொங்கும் மின்கம்பிகளை சீரமைத்து, தெருவிளக்கை உடனடியாக எரிய வைக்க ஆவன செய்யுமாறு மிக பணிவுடன் வேண்டுகிறேன்.',
    date: '10/10/2026',
    place: 'மதுரை',
    closing: 'இப்படிக்கு தங்கள் உண்மையுள்ள,\n\n\n(மனுதாரர் கையொப்பம்)'
  });

  const [englishOutput, setEnglishOutput] = useState<OutputFormat>({
    header: 'GOVERNMENT OF TAMIL NADU - OFFICIAL GRIEVANCE PETITION',
    department: 'TANGEDCO • Assistant Executive Engineer, K.K. Nagar Division',
    recipient: 'The Assistant Executive Engineer (AEE),\nUrban Sub-Division,\nTANGEDCO Distribution Circle, K.K. Nagar, Madurai - 625020.',
    applicant: 'Mr. K. Murugan,\n14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020\nPhone: +91 9876543210',
    subject: 'Subject: Urgent rectification of hazardous hanging power cables and repair of street lights at K.K. Nagar Main Road - Reg.',
    reference: 'Petition Ref: SEC-TN-2026-4819',
    body: 'Respected Sir/Madam,\n\nI am a permanent resident residing at the above-mentioned address.\n\nI wish to bring to your urgent personal attention that the streetlights along K.K. Nagar Main Road have been non-functional for the past 3 consecutive days. Compounding this, high-voltage electrical lines adjacent to the local distribution transformer are sagging loosely near pedestrian walkways, posing an imminent and severe electrocution hazard to school students and daily commuters.\n\nDespite repeated local notifications over the past 3 days, no technical personnel have visited the site to effect repairs.\n\nIn view of the grave safety risk to human life, I earnestly petition your esteemed office to dispatch a technical squad immediately to secure the hanging electrical cables and restore street lighting at the earliest.',
    date: '10/10/2026',
    place: 'Madurai',
    closing: 'Yours faithfully,\n\n\n[Applicant Signature]'
  });

  // Handle Form Submission -> calls /api/generate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantName,
          applicantPhone: phone,
          applicantAddress: address,
          department,
          tanglishInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tamilOutput) setTamilOutput(data.tamilOutput);
        if (data.englishOutput) setEnglishOutput(data.englishOutput);
      } else {
        // Fallback update dynamically with current form inputs
        setTamilOutput((prev) => ({
          ...prev,
          department,
          applicant: `${applicantName},\n${address}\nதொலைபேசி: ${phone}`,
          subject: `பொருள்: ${department} சார்ந்த அவசர குறைதீர்ப்பு கோருதல் - தொடர்பாக.`,
        }));
        setEnglishOutput((prev) => ({
          ...prev,
          department,
          applicant: `${applicantName},\n${address}\nPhone: ${phone}`,
          subject: `Subject: Urgent redressal petition regarding ${department} - Reg.`,
        }));
      }
    } catch (err) {
      console.warn("Using client mock generation pipeline:", err);
      // Ensure instant feedback even if offline
      setTamilOutput((prev) => ({
        ...prev,
        department,
        applicant: `${applicantName},\n${address}\nதொலைபேசி: ${phone}`,
      }));
    } finally {
      setGenerating(false);
    }
  };

  // Handle Save to Firestore
  const handleSaveToDashboard = async () => {
    if (!user) {
      alert("Please login to save petitions.");
      return;
    }

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
      console.error("Failed to save petition:", err);
      alert("Error saving petition to Firestore.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Copy
  const handleCopyText = () => {
    const activeData = activeTab === 'tamil' ? tamilOutput : englishOutput;
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
      `${activeTab === 'tamil' ? 'இடம்' : 'Place'}: ${activeData.place}`,
      `${activeTab === 'tamil' ? 'நாள்' : 'Date'}: ${activeData.date}`,
      '',
      activeData.closing,
    ].join('\n');

    navigator.clipboard.writeText(fullText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Handle Download PDF (standard print dialog formatted for A4)
  const handleDownloadPDF = () => {
    window.print();
  };

  const currentOutput = activeTab === 'tamil' ? tamilOutput : englishOutput;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Petition Workspace
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Split-screen drafting: Convert casual Tanglish into official Secretariat-compliant petitions.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold self-start"
        >
          ← Back to Dashboard
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center justify-between">
          <span>✓ Petition saved successfully to Firestore (`petitions` collection)!</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold underline ml-4"
          >
            View in Dashboard
          </button>
        </div>
      )}

      {/* Responsive Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Input Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="border-b border-gray-100 pb-3 mb-5">
            <h2 className="text-base font-bold text-gray-800">
              Citizen &amp; Grievance Input
            </h2>
            <p className="text-xs text-gray-500">
              Provide applicant details and speak or type in casual Tanglish.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Applicant Name
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. K. Murugan / செல்வன்"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Target Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="TANGEDCO (Electricity & Grid Grievance)">
                    TANGEDCO (Electricity &amp; Power)
                  </option>
                  <option value="City Municipal Corporation (Roads & Health)">
                    City Municipal Corporation
                  </option>
                  <option value="Revenue & Land Administration (Patta / Chitta)">
                    Revenue &amp; Land Administration
                  </option>
                  <option value="TN Police Department (CSR Complaint)">
                    TN Police (CSR Complaint)
                  </option>
                  <option value="TWAD Board (Drinking Water & Drainage)">
                    TWAD Board (Water Supply)
                  </option>
                  <option value="Civil Supplies & Consumer Protection">
                    Civil Supplies (Ration Card)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Residential Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street Name, Taluk, District, PIN"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tanglish Issue Description
                </label>
                <span className="text-[11px] text-indigo-600 font-medium">Casual / Spoken</span>
              </div>
              <textarea
                rows={6}
                required
                value={tanglishInput}
                onChange={(e) => setTanglishInput(e.target.value)}
                placeholder="Type your complaint in casual Tanglish here... e.g. Madurai KK Nagar street light eriyala, wire loose-aa irukku..."
                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed"
              />
              <p className="text-[11px] text-gray-500 mt-1 italic">
                Tip: Speak or type informal sentences like "water pressure romba kammi, 4 naala lorry varala".
              </p>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Transforming via API Route...</span>
                </>
              ) : (
                <>
                  <span>Submit &amp; Generate Draft</span>
                  <span className="text-xs bg-indigo-500 py-0.5 px-1.5 rounded">/api/generate</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Output A4 Sheet (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Top Bar with Language Tabs & Action Buttons */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {/* Tabs for Tamil and English */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('tamil')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  activeTab === 'tamil'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tamil மனு (தமிழ்)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('english')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  activeTab === 'english'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English Letter
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition"
              >
                {copyFeedback ? '✓ Copied!' : 'Copy Text'}
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition"
              >
                Download PDF
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveToDashboard}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <span>Save to Dashboard</span>
                )}
              </button>
            </div>
          </div>

          {/* Structured A4 Sheet Div */}
          <div 
            id="petition-a4-sheet"
            className="bg-white border border-gray-300 rounded-lg p-8 sm:p-12 shadow-md min-h-[750px] flex flex-col justify-between font-serif text-gray-900 print:border-none print:shadow-none print:p-0"
            style={{
              aspectRatio: '210 / 297', // A4 aspect ratio
            }}
          >
            <div>
              {/* Official Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-1 font-semibold">
                  {activeTab === 'tamil' ? 'தமிழ்நாடு அரசு' : 'GOVERNMENT OF TAMIL NADU'}
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  {currentOutput.header}
                </h3>
                <div className="text-xs text-gray-600 mt-1 font-sans">
                  {currentOutput.department}
                </div>
                {currentOutput.reference && (
                  <div className="text-[11px] font-mono text-gray-700 mt-1.5 font-semibold">
                    {currentOutput.reference}
                  </div>
                )}
              </div>

              {/* To & From Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6 font-sans">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="font-bold text-gray-800 block mb-1">
                    {activeTab === 'tamil' ? 'அனுப்புநர் (From):' : 'From:'}
                  </span>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {currentOutput.applicant}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="font-bold text-gray-800 block mb-1">
                    {activeTab === 'tamil' ? 'பெறுநர் (To):' : 'To:'}
                  </span>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {currentOutput.recipient}
                  </p>
                </div>
              </div>

              {/* Subject (பொருள்) */}
              <div className="mb-5 pb-2">
                <p className="text-xs sm:text-sm font-bold text-gray-900 border-l-4 border-indigo-600 pl-3 leading-snug">
                  {currentOutput.subject}
                </p>
              </div>

              {/* Body */}
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line text-justify mb-8 font-serif">
                {currentOutput.body}
              </div>
            </div>

            {/* Footer with Place, Date & Signature */}
            <div className="pt-6 border-t border-gray-200 text-xs font-sans mt-auto">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-gray-600">
                      {activeTab === 'tamil' ? 'இடம்' : 'Place'}:
                    </span>{' '}
                    <span>{currentOutput.place}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      {activeTab === 'tamil' ? 'நாள்' : 'Date'}:
                    </span>{' '}
                    <span>{currentOutput.date}</span>
                  </div>
                </div>

                <div className="text-right whitespace-pre-line font-medium text-gray-800 leading-relaxed">
                  {currentOutput.closing}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
