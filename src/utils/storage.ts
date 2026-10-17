export interface PetitionDocument {
  id: string;
  createdAt: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  applicantAddress: string;
  district: string;
  taluk?: string;
  pincode?: string;
  department: string;
  recipientDesignation?: string;
  recipientOffice?: string;
  tanglishInput: string;
  category?: string;
  referenceNumber: string;
  aiVerification?: {
    identifiedProblem: string;
    category: string;
    locality: string;
    recommendedDepartment: string;
    recommendedDesignation: string;
    reason: string;
    isAppropriate: boolean;
    userAccepted: boolean;
  };
  tamilOutput: {
    header: string;
    department: string;
    recipient: string;
    applicant: string;
    subject: string;
    reference: string;
    body: string;
    reliefRequested?: string;
    date: string;
    place: string;
    closing: string;
  };
  englishOutput: {
    header: string;
    department: string;
    recipient: string;
    applicant: string;
    subject: string;
    reference: string;
    body: string;
    reliefRequested?: string;
    date: string;
    place: string;
    closing: string;
  };
  preferredLang?: 'ta' | 'en';
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  pincode: string;
}

const STORAGE_KEYS = {
  PETITIONS: 'manu_local_petitions_v1',
  DRAFT: 'manu_active_wizard_draft_v1',
  PROFILE: 'manu_user_profile_v1',
  ANONYMIZED_PATTERNS: 'manu_anonymized_knowledge_v1',
};

export const getLocalPetitions = (): PetitionDocument[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PETITIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local petitions', e);
    return [];
  }
};

export const saveLocalPetition = (petition: PetitionDocument): void => {
  try {
    const existing = getLocalPetitions();
    const updated = [petition, ...existing.filter(p => p.id !== petition.id)];
    localStorage.setItem(STORAGE_KEYS.PETITIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save local petition', e);
  }
};

export const deleteLocalPetition = (id: string): void => {
  try {
    const existing = getLocalPetitions();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PETITIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete local petition', e);
  }
};

export const getLocalDraft = (): any | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveLocalDraft = (draftData: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftData));
  } catch (e) {
    console.error('Failed to save draft', e);
  }
};

export const clearLocalDraft = (): void => {
  localStorage.removeItem(STORAGE_KEYS.DRAFT);
};

export const getUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      district: 'Madurai',
      taluk: '',
      pincode: '',
    };
  } catch (e) {
    return {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      district: 'Madurai',
      taluk: '',
      pincode: '',
    };
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

/**
 * Record an anonymized, privacy-safe learning pattern.
 * No citizen personal data (name, phone, street) is ever recorded.
 */
export const recordAnonymizedPattern = (pattern: {
  category: string;
  district: string;
  recommendedDepartment: string;
  userAccepted: boolean;
}): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANONYMIZED_PATTERNS);
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      ...pattern,
      timestamp: new Date().toISOString(),
    });
    // Keep max 50 recent records
    const trimmed = list.slice(-50);
    localStorage.setItem(STORAGE_KEYS.ANONYMIZED_PATTERNS, JSON.stringify(trimmed));
  } catch (e) {
    // Non-blocking
  }
};

export const exportAllDataAsJSON = (): void => {
  const data = {
    app: "Manu - Tamil Nadu Citizen Petition Assistant",
    exportedAt: new Date().toISOString(),
    petitions: getLocalPetitions(),
    profile: getUserProfile(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `manu-petitions-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const clearAllLocalData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PETITIONS);
  localStorage.removeItem(STORAGE_KEYS.DRAFT);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ANONYMIZED_PATTERNS);
};
