import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    brandTitle: "Manu",
    brandSubtitle: "Tamil Nadu Civic Drafting",
    home: "Home",
    dashboard: "My Petitions",
    newPetition: "New Petition",
    login: "Citizen Login",
    signup: "Register",
    logout: "Sign Out",
    demoLogin: "Demo Citizen",

    // Hero & Landing
    heroBadge: "Tamil Nadu Secretariat & Collectorate Aligned • Gemini 3.8 Flash",
    heroTitlePart1: "Speak Tanglish.",
    heroTitlePart2: "Get Court-Ready Tamil Petitions.",
    heroSubtitle: "Speak or type your local issues casually in Tanglish. We turn them into formal administrative petitions with official TN Secretariat references and dual English letters.",
    startPetitionBtn: "Draft Your Petition Now",
    exploreDeptsBtn: "Explore 42+ TN Departments",
    districtsBadge: "All 38 TN Districts",
    dualFormatBadge: "Dual Format (தமிழ் & English)",
    eSevaiBadge: "CM Cell & Collectorate Ready",
    
    // Live Sample
    liveSampleTitle: "Live Tanglish Transformation",
    interactiveSample: "Interactive Demo",
    spokenTanglishHeader: "Spoken Informal Tanglish (Voice / Text)",
    aiBridgeLabel: "Instant Tamil Nadu Legal Drafting",
    outputCardTitle: "Official Secretariat Grievance Petition",
    viewFullA4Btn: "View Full A4 Sheet",

    // Departments
    readyDepartmentsTitle: "Popular Departments",
    viewAllDepts: "View All Departments",
    
    // Create Workspace
    workspaceTitle: "Court-Ready Petition Workspace",
    workspaceSubtitle: "Transform colloquial grievance into an official administrative letterhead",
    applicantDetails: "Applicant & Grievance Details",
    applicantNameLabel: "Applicant Full Name",
    phoneLabel: "Mobile Number",
    districtLabel: "Select District",
    deptLabel: "Select Department",
    addressLabel: "Residential Address (Street, Taluk, District - PIN)",
    tanglishInputLabel: "Tanglish Issue Description",
    voiceDictationLabel: "Voice Dictation",
    quickScenariosLabel: "Quick 1-Click Tanglish Scenarios",
    generateBtn: "Transform to Court-Ready Petition",
    generatingBtn: "Drafting Official Petition via Gemini AI...",
    
    // Output Panel
    tamilTab: "தமிழ் மனு (Official Tamil)",
    englishTab: "English Petition",
    copyBtn: "Copy Text",
    copiedFeedback: "Copied!",
    printBtn: "Print / A4 PDF",
    saveToDashboardBtn: "Save to My Petitions",
    savedSuccess: "Petition saved successfully to your dashboard!",
    readAloudBtn: "Listen (Speech)",

    // Dashboard
    dashboardTitle: "Citizen Petition Archive",
    dashboardSubtitle: "Track and download your administrative grievances",
    totalPetitions: "Total Petitions",
    searchPlaceholder: "Search petitions by department, keyword, or locality...",
    allDepts: "All Departments",
    noPetitions: "No petitions drafted yet",
    noPetitionsSubtitle: "Speak or type your grievance in casual Tanglish to create your first official petition.",
    viewA4Draft: "View A4 Draft",
    deletePetition: "Delete",
  },
  ta: {
    // Brand & Header
    brandTitle: "மனு (Manu)",
    brandSubtitle: "தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு வரைவாளர்",
    home: "முகப்பு",
    dashboard: "என் மனுக்கள்",
    newPetition: "+ புதிய மனு",
    login: "குடிமக்கள் உள்நுழைவு",
    signup: "பதிவு செய்க",
    logout: "வெளியேறு",
    demoLogin: "முன்மாதிரி குடிமகன்",

    // Hero & Landing
    heroBadge: "தமிழ்நாடு தலைமைச் செயலகம் & ஆட்சியர் குறைதீர்ப்பு நெறிமுறை • Gemini 3.8 Flash",
    heroTitlePart1: "Tanglish-ல் பேசுங்கள்.",
    heroTitlePart2: "அதிகாரப்பூர்வ அரசு மனுவை உடனே பெறுங்கள்.",
    heroSubtitle: "உங்கள் தெரு மற்றும் ஊர் பிரச்சனைகளை இயல்பாக Tanglish அல்லது தமிழில் சொல்லுங்கள். தலைமைச் செயலகம் மற்றும் மாவட்ட ஆட்சியர் ஏற்கும் முறையான மனுவாக நொடியில் மாற்றுகிறோம்.",
    startPetitionBtn: "இப்போதே மனு எழுத தொடங்குங்கள்",
    exploreDeptsBtn: "42+ அரசுத் துறைகளை காண்க",
    districtsBadge: "38 தமிழக மாவட்டங்கள் தயார்",
    dualFormatBadge: "இருமொழி மனு (தமிழ் & English)",
    eSevaiBadge: "முதல்வர் தனிப்பிரிவு & ஆட்சியர் குறைதீர்ப்பு",

    // Live Sample
    liveSampleTitle: "நேரடி Tanglish மாற்ற மாதிரி",
    interactiveSample: "நேரடி செயல்முறை",
    spokenTanglishHeader: "பொதுமக்கள் இயல்பாக பேசிய Tanglish",
    aiBridgeLabel: "செயற்கை நுண்ணறிவு சட்ட வரைவு",
    outputCardTitle: "தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு",
    viewFullA4Btn: "முழு A4 மனுவை காண்க",

    // Departments
    readyDepartmentsTitle: "முக்கிய அரசுத் துறைகள்",
    viewAllDepts: "அனைத்து துறைகளும்",

    // Create Workspace
    workspaceTitle: "அதிகாரப்பூர்வ மனு எழுதும் களம்",
    workspaceSubtitle: "இயல்பான பேச்சு மொழியை அரசு முத்திரையுடன் கூடிய விண்ணப்பமாக மாற்றும் தளம்",
    applicantDetails: "மனுதாரர் & பிரச்சனை விவரங்கள்",
    applicantNameLabel: "மனுதாரர் பெயர்",
    phoneLabel: "தொடர்பு தொலைபேசி எண்",
    districtLabel: "மாவட்டம் தேர்ந்தெடுக்கவும்",
    deptLabel: "சம்பந்தப்பட்ட அரசுத் துறை",
    addressLabel: "முழு இருப்பிட முகவரி (கதவு எண், தெரு, தாலுகா - அஞ்சல் குறியீடு)",
    tanglishInputLabel: "பிரச்சனையின் முழு விவரம் (Tanglish / தமிழ்)",
    voiceDictationLabel: "குரல் வழி தட்டச்சு",
    quickScenariosLabel: "உடனடி மாதிரி பிரச்சனைகள்",
    generateBtn: "அரசு மனுவாக உடனே மாற்று",
    generatingBtn: "மனு உருவாக்கம் நடைபெறுகிறது...",

    // Output Panel
    tamilTab: "தமிழ் மனு",
    englishTab: "ஆங்கில மனு (English)",
    copyBtn: "நகலெடு",
    copiedFeedback: "நகலெடுக்கப்பட்டது!",
    printBtn: "அச்சிடு / A4 PDF",
    saveToDashboardBtn: "மனுவை சேமிக்க",
    savedSuccess: "மனு வெற்றிகரமாக உங்கள் பட்டியலில் சேமிக்கப்பட்டது!",
    readAloudBtn: "வாசித்து கேட்க",

    // Dashboard
    dashboardTitle: "மனுக்கள் காப்பகம்",
    dashboardSubtitle: "நீங்கள் தயாரித்த அனைத்து அரசு மனுக்களின் தொகுப்பு",
    totalPetitions: "மொத்த மனுக்கள்",
    searchPlaceholder: "துறை, ஊர் அல்லது குறிப்பு எண் கொண்டு தேடுங்கள்...",
    allDepts: "அனைத்து துறைகள்",
    noPetitions: "இன்னும் மனுக்கள் உருவாக்கப்படவில்லை",
    noPetitionsSubtitle: "உங்கள் முதல் மனுவை உருவாக்க 'புதிய மனு' பொத்தானை அழுத்தவும்.",
    viewA4Draft: "மனுவை காண்க",
    deletePetition: "நீக்கு",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('manu_language_pref') as Language) || 'ta';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('manu_language_pref', lang);
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
