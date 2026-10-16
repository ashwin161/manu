import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { TN_DEPARTMENTS, TN_DISTRICTS } from '@/src/data/tnDepartments';
import { 
  ArrowRight, 
  MapPin, 
  Scale, 
  Building2, 
  Check, 
  Landmark, 
  Printer, 
  FileText,
  Shield,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [selectedQuickDistrict, setSelectedQuickDistrict] = useState('Madurai');

  const handleStartPetition = (deptName?: string) => {
    if (!user) {
      loginAsDemo();
    }
    navigate('/create', { 
      state: { 
        selectedDepartment: deptName || TN_DEPARTMENTS[0].name,
        selectedDistrict: selectedQuickDistrict
      } 
    });
  };

  const isTa = language === 'ta';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Official State Gazette Banner */}
      <section className="bg-white border-2 border-black p-8 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Top Header Crest Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif text-xl font-bold">
              ம
            </div>
            <div>
              <div className="font-state-crest font-bold text-xs tracking-widest text-black">
                GOVERNMENT OF TAMIL NADU
              </div>
              <div className="font-legal-tamil text-xs font-semibold text-neutral-700">
                தமிழ்நாடு அரசு தலைமைச் செயலகம் · முதல்வர் சிறப்பு குறைதீர்ப்புப் பிரிவு
              </div>
            </div>
          </div>
          
          <div className="font-mono text-xs text-neutral-600 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-black"></span>
            <span>GAZETTE COMPLIANT · FORMAT REF: GO-MS-42</span>
          </div>
        </div>

        {/* Main Title & Statement */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-black font-display-serif tracking-tight leading-[1.15]">
            {isTa 
              ? 'இயல்பான பேச்சுமொழியை சட்டபூர்வ அரசு மனுவாக மாற்றுங்கள்.' 
              : 'Citizen Grievance Redressal & Administrative Petition Drafter.'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 font-legal-tamil leading-relaxed max-w-3xl">
            {isTa
              ? 'உங்கள் பகுதி பிரச்சனைகளை Tanglish அல்லது சாதாரண தமிழில் கூறுங்கள். மாவட்ட ஆட்சியர் அலுவலகம், தலைமைச் செயலகம் மற்றும் முதல்வரின் தனிப்பிரிவு ஏற்கும் முறையான சட்ட மனுவாகவும், இருமொழி ஆவணமாகவும் உடனடியாக தயார் செய்யப்படுகிறது.'
              : 'Dictate or write raw citizen complaints in casual Tanglish. Manu synthesizes informal grievances into legally formatted, court-ready petitions adhering to Tamil Nadu Secretariat and District Collectorate standards.'}
          </p>

          {/* District Selection Bar & Primary Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center border border-black bg-white px-3 py-2 text-xs">
              <MapPin className="w-4 h-4 text-black mr-2 shrink-0" />
              <label htmlFor="quick-district" className="sr-only">District</label>
              <select
                id="quick-district"
                value={selectedQuickDistrict}
                onChange={(e) => setSelectedQuickDistrict(e.target.value)}
                className="bg-transparent text-black font-bold focus:outline-none cursor-pointer pr-4"
              >
                {TN_DISTRICTS.map((dist) => (
                  <option key={dist.en} value={dist.en}>
                    {dist.en} ({dist.ta})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleStartPetition()}
              className="gov-btn-primary px-7 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
            >
              <span>{isTa ? 'புதிய மனு தயார் செய்ய' : 'Draft Official Petition'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSampleModalOpen(true)}
              className="gov-btn-secondary px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>{isTa ? 'மாதிரி A4 மனுவை காண்க' : 'Inspect Sample A4'}</span>
            </button>
          </div>

          {/* Unboxed Metadata Line with typographic separators */}
          <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 font-mono">
            <span>38 TN Administrative Districts</span>
            <span>·</span>
            <span>Dual Official Filing (தமிழ் &amp; English)</span>
            <span>·</span>
            <span>Secretariat &amp; Collectorate Standards</span>
            <span>·</span>
            <span>Court-Ready A4 Print</span>
          </div>
        </div>

      </section>

      {/* Exemplar Transformation Showcase (Tanglish -> Official Tamil Petition) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display-serif text-black">
              {isTa ? 'பேச்சுமொழி டு அதிகாரப்பூர்வ மனு மாதிரி' : 'Transformation Proof: Tanglish to Formal Tamil Petition'}
            </h2>
            <p className="text-xs text-neutral-600">
              {isTa ? 'எளிய மக்கள் மொழியிலிருந்து அரசு ஏற்கும் சட்ட நடையிலான மனு' : 'From conversational vernacular to accepted governmental administrative format'}
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest hidden sm:inline">
            BEFORE &amp; AFTER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Informal Input Box */}
          <div className="bg-neutral-100 border border-neutral-300 p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-600 border-b border-neutral-300 pb-2 mb-3">
                <span className="uppercase font-bold text-neutral-800">1. Citizen Tanglish Input (குடிமக்கள் உள்ளீடு)</span>
                <span>Casual Speech</span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-neutral-800 leading-relaxed bg-white p-4 border border-neutral-300">
                "Madurai KK Nagar 4th cross street-la street light 15 naala eriyala sir. Transformer pakathula wire romba loose-aa thonguthu, mazhai vandha shock adikkum bayama irukku. 3 vaati complain panniyum aalu varala. Udanadiya repair panni safety panna vendugiren."
              </p>
            </div>
            
            <div className="text-[11px] text-neutral-500 font-mono pt-2">
              Status: Raw Citizen Grievance · Department: TANGEDCO · Location: Madurai
            </div>
          </div>

          {/* Official Formal Result */}
          <div className="bg-white border-2 border-black p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono text-black border-b border-black pb-2 mb-3">
              <span className="uppercase font-bold">2. Court-Ready Official Tamil Petition (சட்டபூர்வ மனு)</span>
              <span className="font-bold">A4 SECRETARIAT FORMAT</span>
            </div>

            <div className="font-legal-tamil text-xs sm:text-sm text-black space-y-2 bg-[#fdfdfd] p-4 border border-neutral-300">
              <div className="font-bold text-xs uppercase tracking-wide border-b border-neutral-200 pb-1">
                பெறுநர்: உதவி செயற்பொறியாளர் அவர்கள், தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO), மதுரை.
              </div>
              <div className="font-bold pt-1">
                பொருள்: மதுரை, கே.கே.நகர் 4-வது குறுக்குத் தெருவில் பழுதடைந்த தெருவிளக்கு மற்றும் தொய்வுற்ற மின்கம்பிகளை சீரமைத்து பொதுமக்கள் பாதுகாப்பை உறுதி செய்யக் கோருதல் - தொடர்பாக.
              </div>
              <div className="text-xs text-neutral-800 pt-1 leading-relaxed">
                வணக்கம். மேற்கண்ட முகவரியில் வசிக்கும் நான் தங்களின் மேலான கவனத்திற்கு கொண்டுவருவது யாதெனில், கடந்த 15 நாட்களாக எங்கள் பகுதியில் தெருவிளக்குகள் எரியாமல் இருள் சூழ்ந்து காணப்படுகிறது. மேலும் மின்மாற்றி அருகில் மின்கம்பிகள் ஆபத்தான முறையில் தொய்வுற்று உள்ளன. எனவே அசம்பாவிதங்கள் நிகழும் முன் போர்க்கால அடிப்படையில் சீரமைப்பு பணிகளை மேற்கொள்ளுமாறு பணிவுடன் வேண்டுகிறேன்.
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-black pt-1">
              <span>சட்டப்பிரிவு &amp; அரசு நெறிமுறை 2026</span>
              <span className="font-bold">இப்படிக்கு, மனுதாரர் கையொப்பம்</span>
            </div>
          </div>

        </div>
      </section>

      {/* Administrative Department Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display-serif text-black">
              {isTa ? 'தமிழ்நாடு அரசு தலைமைத் துறைகள்' : 'Tamil Nadu Government Administrative Departments'}
            </h2>
            <p className="text-xs text-neutral-600">
              {isTa ? 'மனு அளிக்க வேண்டிய துறையைத் தேர்ந்தெடுத்து உடனடியாகத் தொடங்குங்கள்' : 'Select designated authority to initiate jurisdiction-specific petition draft'}
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest hidden sm:inline">
            38 DISTRICTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TN_DEPARTMENTS.slice(0, 6).map((dept) => (
            <div
              key={dept.id}
              onClick={() => handleStartPetition(dept.name)}
              className="bg-white border border-neutral-300 p-5 hover:border-black transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                    {dept.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="font-bold text-sm text-black font-legal-tamil group-hover:underline">
                  {dept.nameTamil}
                </h3>
                <p className="text-xs text-neutral-600 font-ui line-clamp-1">
                  {dept.name}
                </p>
                <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                  அதிகாரி: <span className="font-semibold text-neutral-700">{dept.recipientDesignationTamil}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-600">
                <span>மாதிரி மனு</span>
                <span className="font-bold text-black underline">மனு எழுத →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Legal Guarantee Notice */}
      <section className="bg-neutral-100 border border-neutral-400 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-black shrink-0" />
            <h3 className="text-base font-bold font-state-crest tracking-wider text-black">
              LEGAL INTEGRITY &amp; COURT ADMISSIBILITY STANDARDS
            </h3>
          </div>
          <p className="text-xs text-neutral-700 font-legal-tamil leading-relaxed">
            {isTa
              ? 'இந்த தளத்தில் உருவாக்கப்படும் மனுக்கள் இந்திய குடிமக்கள் குறைதீர்ப்பு நெறிமுறை மற்றும் தமிழ்நாடு அரசு நிர்வாக நடைமுறை விதிமுறைகளின்படி (Tamil Nadu Secretariat Office Manual) தலைப்பு, பெறுநர், பொருள், கோரிக்கை மற்றும் கையொப்பப் பகுதிகளுடன் துல்லியமாக கட்டமைக்கப்படுகின்றன.'
              : 'Petitions drafted through Manu strictly follow the Tamil Nadu Secretariat Office Manual formatting rules, Article 226/32 grievance petition structure, official subject indexing, prayer relief definitions, and physical print margins.'}
          </p>
        </div>

        <button
          onClick={() => handleStartPetition()}
          className="gov-btn-primary px-6 py-3 text-xs uppercase tracking-wider font-bold whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>{isTa ? 'இப்போதே மனு எழுத' : 'Draft Petition Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Sample Modal */}
      {sampleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-black" />
                <div>
                  <h3 className="font-bold font-state-crest text-sm text-black">
                    STANDARD TAMIL NADU SECRETARIAT PETITION
                  </h3>
                  <p className="text-xs font-legal-tamil text-neutral-600">
                    மாதிரி அரசு மனு ஆவணம் (A4 Print Preview)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSampleModalOpen(false)}
                className="text-xs font-mono font-bold px-3 py-1 border border-black hover:bg-neutral-100"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* A4 Document Representation in Black & White */}
            <div className="border border-neutral-300 p-8 bg-white font-legal-tamil text-xs sm:text-sm space-y-4 shadow-sm">
              <div className="text-center space-y-1 border-b border-black pb-3">
                <div className="font-state-crest text-xs tracking-widest text-neutral-700">
                  GOVERNMENT OF TAMIL NADU
                </div>
                <div className="font-bold text-base text-black">
                  பொது மக்கள் குறைதீர்ப்பு மனு
                </div>
                <div className="font-mono text-[11px] text-neutral-600">
                  மனு எண்: TN-SEC-2026-SAMPLE · தேதி: 10-10-2026 · இடம்: மதுரை
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="font-bold text-xs uppercase text-neutral-700">அனுப்புநர்:</div>
                  <div className="pl-4 text-neutral-900 leading-snug">
                    கே. முருகன், த/பெ. கந்தசாமி,<br />
                    கதவு எண் 14/2, 4-வது குறுக்குத் தெரு, கே.கே. நகர், மதுரை - 625020.<br />
                    கைபேசி: 9876543210
                  </div>
                </div>

                <div>
                  <div className="font-bold text-xs uppercase text-neutral-700">பெறுநர்:</div>
                  <div className="pl-4 text-neutral-900 leading-snug">
                    உயர் திரு. உதவி செயற்பொறியாளர் அவர்கள்,<br />
                    தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO),<br />
                    கே.கே. நகர் உபகோட்டம், மதுரை - 625020.
                  </div>
                </div>

                <div className="font-bold pt-2 border-t border-neutral-200">
                  பொருள்: கே.கே. நகர் 4-வது குறுக்குத் தெருவில் பழுதடைந்த தெருவிளக்குகள் மற்றும் தாழ்வாக தொங்கும் மின்கம்பிகளை உடனடியாக சரிசெய்து பொதுமக்களின் பாதுகாப்பை உறுதி செய்ய வேண்டுதல் - தொடர்பாக.
                </div>

                <div className="text-neutral-800 leading-relaxed space-y-2 pt-2">
                  <p>
                    மதிப்பிற்குரிய ஐயா,
                  </p>
                  <p>
                    வணக்கம். மேற்கண்ட முகவரியில் வசிக்கும் நான் மற்றும் அப்பகுதி பொதுமக்கள் தங்களின் மேலான கவனத்திற்கு கொண்டுவருவது யாதெனில்:
                  </p>
                  <p>
                    எங்கள் பகுதியில் அமைந்துள்ள தெருவிளக்குகள் கடந்த 15 நாட்களாக செயல்படாமல் பழுதடைந்து உள்ளன. இதனால் இரவு நேரங்களில் முதியோர்கள் மற்றும் குழந்தைகள் அச்சத்துடன் சென்று வர வேண்டியுள்ளது. மேலும் மின்மாற்றி அருகில் உள்ள மின்கம்பி ஆபத்தான முறையில் மிகத் தாழ்வாக தொங்குகிறது.
                  </p>
                  <p>
                    எனவே, எவ்வித அசம்பாவிதமும் நிகழும் முன், தாங்கள் இப்பிரச்சனையை சிறப்பு கவனத்தில் எடுத்துக்கொண்டு உடனடி சீரமைப்பு நடவடிக்கை எடுக்குமாறு பணிவன்புடன் கேட்டுக்கொள்கிறேன்.
                  </p>
                </div>

                <div className="pt-6 flex justify-between items-end border-t border-neutral-200">
                  <div className="text-xs text-neutral-600">
                    இணைப்புகள்: பகுதி மக்களின் கையொப்ப பட்டியல் &amp; புகைப்படங்கள்
                  </div>
                  <div className="text-right">
                    <div className="font-bold">இப்படிக்கு தங்கள் உண்மையுள்ள,</div>
                    <div className="pt-8 text-neutral-700 underline font-serif">
                      ( கே. முருகன் )
                    </div>
                    <div className="text-[11px] text-neutral-500">மனுதாரர் கையொப்பம்</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSampleModalOpen(false)}
                className="gov-btn-secondary px-4 py-2 text-xs"
              >
                மூடுக (Close)
              </button>
              <button
                onClick={() => { setSampleModalOpen(false); handleStartPetition(); }}
                className="gov-btn-primary px-5 py-2 text-xs font-bold"
              >
                இந்த முறையில் புதிய மனு தயார் செய்க →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
