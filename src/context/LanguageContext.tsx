import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App & Identity
    appName: "Manu",
    appTamilName: "மனு",
    appTagline: "Citizen Petition Assistant",
    govHeader: "Government of Tamil Nadu",
    govTamilHeader: "தமிழ்நாடு அரசு",
    taglineSubtitle: "Create • Verify • Generate • Submit",
    getStarted: "Get Started",
    continueWithGoogle: "Continue with Google",
    guestMode: "Continue as Citizen Guest",
    loginSubtitle: "Sign in securely to manage your local petition records and autofill your identity.",
    
    // Location Permission
    locationTitle: "Locality Permission",
    locationDesc: "Your location helps us identify your district and taluk to recommend the exact jurisdiction and administrative officers.",
    allowLocationBtn: "Enable Location Detection",
    skipLocationBtn: "Enter Manually",
    detectingLocation: "Detecting your locality in Tamil Nadu...",
    locationDetected: "Location detected",
    locationManualNotice: "Location permission denied. You can manually select your district anytime.",

    // Nav & Bottom Bar
    navHome: "Home",
    navPetitions: "Petitions",
    navNew: "New Petition",
    navProfile: "Profile",
    navSettings: "Settings",

    // Home Screen
    welcomeGreeting: "Vanakkam",
    yourLocation: "Your Locality",
    createNewPetition: "Create New Petition",
    startPetitionDesc: "Transform your daily grievances into court-ready official petitions.",
    startBtn: "Start Petition",
    recentActivity: "Recent Petitions",
    noRecentPetitions: "No petitions drafted yet.",
    viewAllPetitions: "View All Petitions",
    savedDrafts: "Local Drafts",

    // Step Progress
    stepIndicator: "Step {step} of 6",
    backBtn: "Back",
    continueBtn: "Continue",

    // Step 1: About You
    step1Title: "About You",
    step1Subtitle: "Your verified contact information for official government records.",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. K. Murugan",
    phoneNumber: "Mobile Number",
    phoneNumberPlaceholder: "10-digit mobile number",
    emailAddress: "Email Address",
    residentialAddress: "Door No, Street Name & Locality",
    residentialAddressPlaceholder: "e.g. 14/2, 4th Cross Street, KK Nagar",
    district: "District",
    taluk: "Taluk / Municipal Zone",
    talukPlaceholder: "e.g. Madurai South",
    pincode: "Postal PIN Code",
    pincodePlaceholder: "e.g. 625020",

    // Step 2: Who is this for?
    step2Title: "Who Is This Petition For?",
    step2Subtitle: "Specify the department or official you wish to address.",
    dontKnowAuthority: "I don't know who to address",
    dontKnowAuthorityHint: "Gemini AI will analyze your problem description in Step 4 and automatically assign the competent department.",
    selectDeptLabel: "Select Department / Board",
    recipientDesignationLabel: "Recipient Designation (Optional)",
    recipientDesignationPlaceholder: "e.g. The Executive Engineer / Tahsildar",

    // Step 3: What is your problem?
    step3Title: "What Is Your Problem?",
    step3Subtitle: "Explain your issue naturally in Tanglish, Tamil, or English. No government jargon needed.",
    problemPlaceholder: "Explain naturally, e.g.: Madurai KK Nagar 4th street-la street light eriyala, 2 weeks-aa complaint panniyum aalu varala. Night time-la accidents aaguthu, udane sari panna vendugiren...",
    voiceInput: "Tap to Speak (Tamil / Tanglish)",
    voiceListening: "Listening... Speak naturally in Tamil or Tanglish",
    voiceStopped: "Tap microphone to record voice",
    charCount: "characters",
    quickPromptCues: "Common Examples:",
    cuePothole: "Road damaged & large potholes",
    cueWater: "Drinking water supply interrupted",
    cueLight: "Street light repaired & wire loose",
    cueRation: "Ration shop delay / card issue",

    // Step 4: AI Analysis & Verification
    step4Title: "AI Authority Verification",
    step4Subtitle: "Checking problem category, jurisdiction, and recipient suitability.",
    analyzingText: "Gemini AI is analyzing your issue facts and jurisdiction...",
    analysisProblemIdentified: "Identified Problem:",
    analysisCategory: "Category:",
    analysisLocality: "Locality:",
    selectedRecipientLabel: "Your Selected Recipient:",
    recommendedRecipientLabel: "AI Recommended Authority:",
    recommendationReason: "Why this recommendation:",
    recipientMatchSuccess: "The selected recipient is appropriate for this grievance category.",
    recipientMismatchNotice: "The selected recipient may not be the most relevant authority for this issue.",
    acceptRecommendationBtn: "Use Recommended Authority",
    keepMyRecipientBtn: "Keep My Selected Recipient",
    editRecipientBtn: "Change Authority",

    // Step 5: Draft Review & Language Switcher
    step5Title: "Review Your Petition",
    step5Subtitle: "Review and edit the formal legal petition before generating the final PDF.",
    petitionLanguageSwitch: "Petition Letter Language:",
    langTamilBtn: "தமிழ் (Official Tamil)",
    langEnglishBtn: "English (Formal English)",
    editDraftBtn: "Edit Letter Text",
    saveEditsBtn: "Save Changes",
    aiPolishTools: "AI Quick Refinements:",
    polishFormal: "Make More Formal",
    polishConcise: "Make Concise",
    polishUrgent: "Emphasize Urgency / Safety",
    polishingWait: "Polishing petition with Gemini AI...",

    // Step 6: PDF Generation & Export
    step6Title: "Your Official Petition PDF",
    step6Subtitle: "Formatted strictly to Tamil Nadu Secretariat and Collectorate standards.",
    downloadPdfBtn: "Download PDF",
    printBtn: "Print / Save as PDF",
    shareBtn: "Share Document",
    saveToDeviceBtn: "Saved to Local Archive",
    exportBilingual: "Bilingual Package (Tamil + English)",
    readyForSubmission: "Court-Ready & CM Special Cell Compliant",

    // Settings & Privacy
    settingsTitle: "Privacy & Data Settings",
    settingsSubtitle: "Your petition content is stored strictly on your local device.",
    localRecordsCount: "Stored Local Petitions:",
    exportJsonBtn: "Export My Petitions (JSON Backup)",
    clearAllDataBtn: "Wipe Local Data & Cache",
    clearDataConfirm: "Are you sure? This will delete all locally stored petitions and drafts on this device.",
    dataClearedSuccess: "All local petition data has been wiped.",
    privacyNote: "Manu does not transmit or monetize your private grievance text to external training sets. AI processing is performed securely via server-side Google GenAI.",
    logoutBtn: "Sign Out",
  },
  ta: {
    // App & Identity
    appName: "மனு",
    appTamilName: "மனு (Manu)",
    appTagline: "குடிமக்கள் மனு உதவியாளர்",
    govHeader: "தமிழ்நாடு அரசு",
    govTamilHeader: "தமிழ்நாடு அரசு",
    taglineSubtitle: "உருவாக்கு • சரிபார் • பதிவிறக்கு • சமர்ப்பி",
    getStarted: "தொடங்குங்கள்",
    continueWithGoogle: "கூகுள் மூலம் தொடரவும்",
    guestMode: "விருந்தினர் குடிமகனாக தொடர்க",
    loginSubtitle: "உங்கள் மனுக்களை உள்ளூரில் நிர்வகிக்க மற்றும் தகவல்களை நிரப்ப பாதுகாப்பாக இணையுங்கள்.",

    // Location Permission
    locationTitle: "இருப்பிட அனுமதி",
    locationDesc: "உங்கள் மாவட்டம் மற்றும் தாலுகாவை கண்டறிந்து உரிய அரசு அதிகாரியை பரிந்துரைக்க இருப்பிட அனுமதி உதவுகிறது.",
    allowLocationBtn: "இருப்பிடத்தை கண்டறிய அனுமதி",
    skipLocationBtn: "கைமுறையாக உள்ளிடவும்",
    detectingLocation: "உங்கள் தமிழக இருப்பிடம் கண்டறியப்படுகிறது...",
    locationDetected: "இருப்பிடம் கண்டறியப்பட்டது",
    locationManualNotice: "இருப்பிட அனுமதி மறுக்கப்பட்டது. நீங்கள் நேரடியாக மாவட்டத்தை தேர்ந்தெடுக்கலாம்.",

    // Nav & Bottom Bar
    navHome: "முகப்பு",
    navPetitions: "மனுக்கள்",
    navNew: "+ புதிய மனு",
    navProfile: "சுயவிவரம்",
    navSettings: "அமைப்புகள்",

    // Home Screen
    welcomeGreeting: "வணக்கம்",
    yourLocation: "உங்கள் பகுதி",
    createNewPetition: "புதிய மனு எழுதுங்கள்",
    startPetitionDesc: "உங்கள் ஊர் பிரச்சனைகளை அரசு ஏற்கும் முறையான மனுவாக நொடியில் மாற்றவும்.",
    startBtn: "மனு தொடங்கு",
    recentActivity: "சமீபத்திய மனுக்கள்",
    noRecentPetitions: "இதுவரை மனுக்கள் உருவாக்கப்படவில்லை.",
    viewAllPetitions: "அனைத்து மனுக்களையும் காண்க",
    savedDrafts: "உள்ளூர் வரைவுகள்",

    // Step Progress
    stepIndicator: "படி {step} / 6",
    backBtn: "பின்செல்",
    continueBtn: "தொடர்க",

    // Step 1: About You
    step1Title: "உங்களைப் பற்றி",
    step1Subtitle: "அரசு ஆவணங்களில் இடம்பெற வேண்டிய மனுதாரர் தொடர்பு விவரங்கள்.",
    fullName: "முழுப் பெயர்",
    fullNamePlaceholder: "எ.கா. கா. முருகன்",
    phoneNumber: "கைபேசி எண்",
    phoneNumberPlaceholder: "10-இலக்க கைபேசி எண்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    residentialAddress: "கதவு எண், தெரு மற்றும் பகுதி",
    residentialAddressPlaceholder: "எ.கா. 14/2, 4-வது குறுக்குத் தெரு, கே.கே. நகர்",
    district: "மாவட்டம்",
    taluk: "வட்டம் / தாலுகா / மண்டலம்",
    talukPlaceholder: "எ.கா. மதுரை தெற்கு",
    pincode: "அஞ்சல் குறியீட்டு எண்",
    pincodePlaceholder: "எ.கா. 625020",

    // Step 2: Who is this for?
    step2Title: "மனு யாருக்கானது?",
    step2Subtitle: "நீங்கள் மனு அளிக்க விரும்பும் அரசுத் துறை அல்லது அதிகாரியை குறிப்பிடவும்.",
    dontKnowAuthority: "யாருக்கு மனு அளிக்க வேண்டும் என்று தெரியவில்லை",
    dontKnowAuthorityHint: "பிரச்சனையின் தன்மையை ஆய்வு செய்து சரியான துறை மற்றும் அதிகாரியை AI தானே பரிந்துரைக்கும்.",
    selectDeptLabel: "அரசுத் துறை / வாரியம்",
    recipientDesignationLabel: "அதிகாரியின் பதவிப் பெயர் (விருப்பத்திற்குரியது)",
    recipientDesignationPlaceholder: "எ.கா. உதவி செயற்பொறியாளர் / வட்டாட்சியர்",

    // Step 3: What is your problem?
    step3Title: "உங்கள் பிரச்சனை என்ன?",
    step3Subtitle: "உங்கள் குறைபாட்டை Tanglish அல்லது எளிய தமிழில் விளக்குங்கள். அரசு கடித நடை தேவையில்லை.",
    problemPlaceholder: "இயல்பாக சொல்லுங்கள்: மதுரை கேகே நகர் 4வது தெருவில் தெருவிளக்கு எரியவில்லை, கம்பியில் வயர் தொங்குகிறது. புகார் அளித்தும் நடவடிக்கை இல்லை, விபத்து ஏற்படும் அபாயம் உள்ளது...",
    voiceInput: "பேசி உள்ளிடவும் (குரல் வழி)",
    voiceListening: "கேட்கிறது... தமிழில் அல்லது Tanglish-ல் இயல்பாக பேசுங்கள்",
    voiceStopped: "மைக் குறியீட்டை அழுத்தி பேசவும்",
    charCount: "எழுத்துக்கள்",
    quickPromptCues: "மாதிரி பிரச்சனைகள்:",
    cuePothole: "சாலை பழுதடைந்து குண்டும் குழியுமாக உள்ளது",
    cueWater: "குடிநீர் விநியோகம் தடைபட்டுள்ளது",
    cueLight: "தெருவிளக்கு பழுது & மின்கம்பி தொங்குகிறது",
    cueRation: "ரேஷன் கடை பொருள் விநியோக தாமதம்",

    // Step 4: AI Analysis & Verification
    step4Title: "AI அதிகார வரம்பு சரிபார்ப்பு",
    step4Subtitle: "பிரச்சனை வகை, ஊர் வரம்பு மற்றும் அதிகாரியின் பொருத்தம் ஆய்வு செய்யப்படுகிறது.",
    analyzingText: "பிரச்சனை விவரங்களையும் துறை வரம்பையும் Gemini AI ஆய்வு செய்கிறது...",
    analysisProblemIdentified: "கண்டறியப்பட்ட பிரச்சனை:",
    analysisCategory: "துறை வகை:",
    analysisLocality: "இருப்பிடம்:",
    selectedRecipientLabel: "நீங்கள் தேர்வு செய்த அதிகாரி:",
    recommendedRecipientLabel: "AI பரிந்துரைக்கும் தகுதியான அதிகாரி:",
    recommendationReason: "பரிந்துரைக்கான காரணம்:",
    recipientMatchSuccess: "நீங்கள் தேர்வு செய்த அதிகாரி இந்த பிரச்சனைக்கு முற்றிலும் பொருத்தமானவர்.",
    recipientMismatchNotice: "நீங்கள் தேர்வு செய்த அதிகாரி இந்த பிரச்சனைக்கு நேரடி பொறுப்புடையவர் அல்ல.",
    acceptRecommendationBtn: "பரிந்துரைக்கப்பட்ட அதிகாரியை ஏற்கவும்",
    keepMyRecipientBtn: "நான் தேர்வு செய்த அதிகாரியையே வைக்கவும்",
    editRecipientBtn: "அதிகாரியை மாற்று",

    // Step 5: Draft Review & Language Switcher
    step5Title: "மனுவை சரிபார்க்கவும்",
    step5Subtitle: "இறுதி PDF உருவாக்குவதற்கு முன் அரசு மனுவின் விவரங்களை சரிபார்த்து திருத்தவும்.",
    petitionLanguageSwitch: "மனு கடித மொழி:",
    langTamilBtn: "தமிழ் மனு (Official Tamil)",
    langEnglishBtn: "ஆங்கில மனு (Formal English)",
    editDraftBtn: "மனு உரையை திருத்தவும்",
    saveEditsBtn: "மாற்றங்களை சேமிக்க",
    aiPolishTools: "AI விரைவு மெருகூட்டல்:",
    polishFormal: "சட்ட நடை அதிகப்படுத்து",
    polishConcise: "சுருக்கமாக்கு",
    polishUrgent: "அவசரம் / அபாயத்தை முன்னிலைப்படுத்து",
    polishingWait: "மனுவை Gemini AI மெருகூட்டுகிறது...",

    // Step 6: PDF Generation & Export
    step6Title: "உங்கள் அதிகாரப்பூர்வ மனு PDF",
    step6Subtitle: "தமிழ்நாடு தலைமைச் செயலகம் மற்றும் மாவட்ட ஆட்சியர் அலுவலக நெறிமுறைப்படி உருவானது.",
    downloadPdfBtn: "PDF பதிவிறக்கம்",
    printBtn: "அச்சிடு / PDF சேமி",
    shareBtn: "பகிர்வு செய்க",
    saveToDeviceBtn: "உள்ளூர் காப்பகத்தில் சேமிக்கப்பட்டது",
    exportBilingual: "இருமொழி தொகுப்பு (தமிழ் + ஆங்கிலம்)",
    readyForSubmission: "முதல்வர் தனிப்பிரிவு & ஆட்சியர் அலுவலகத்தில் சமர்ப்பிக்க தயார்",

    // Settings & Privacy
    settingsTitle: "தனியுரிமை & அமைப்புகள்",
    settingsSubtitle: "உங்கள் மனு விவரங்கள் உங்கள் தொலைபேசி/உலாவியில் மட்டுமே ரகசியமாக சேமிக்கப்படுகிறது.",
    localRecordsCount: "சேமிக்கப்பட்ட மனுக்கள்:",
    exportJsonBtn: "மனுக்களை காப்புப் பிரதி எடுக்க (JSON Export)",
    clearAllDataBtn: "உள்ளூர் தரவுகளை அழிக்க",
    clearDataConfirm: "நிச்சயமாகவா? இந்த சாதனத்தில் உள்ள அனைத்து மனுக்களும் நிரந்தரமாக நீக்கப்படும்.",
    dataClearedSuccess: "அனைத்து உள்ளூர் தரவுகளும் அழிக்கப்பட்டன.",
    privacyNote: "மனு தளம் உங்கள் அந்தரங்க தகவல்களை பொது AI பயிற்சிக்கு அனுப்பாது. Google GenAI மூலம் தனிப்பட்ட முறையில் மட்டுமே செயலாக்கப்படுகிறது.",
    logoutBtn: "வெளியேறு",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('manu_mobile_lang') as Language) || 'ta';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('manu_mobile_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ta' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
