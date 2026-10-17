import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, syncUserToFirestore } from '@/lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'manu_current_user_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local session first for fast boot
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.uid) {
          setUser(parsed);
        }
      } catch (e) {
        // ignore
      }
    }

    // Subscribe to real Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
        };
        setUser(u);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
        syncUserToFirestore(u).catch(() => {});
      } else {
        const existing = localStorage.getItem(LOCAL_USER_KEY);
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            // Only keep explicit guest sessions if unauthenticated with Firebase
            if (parsed.uid?.startsWith('guest-')) {
              setUser(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      const u: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      };
      setUser(u);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      await syncUserToFirestore(u);
    } catch (err: any) {
      console.error("Firebase Google Sign-In error:", err);
      let userFriendlyMsg = "Google Sign-In failed.";
      if (err.code === 'auth/operation-not-allowed') {
        userFriendlyMsg = "Google Sign-In provider is disabled in Firebase. Enable it at: Firebase Console -> Authentication -> Sign-in method -> Google -> Enable and Save.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyMsg = "Sign-in cancelled (popup was closed).";
      } else if (err.code === 'auth/unauthorized-domain') {
        userFriendlyMsg = `Domain (${window.location.hostname}) is not authorized in Firebase Console. Please add '${window.location.hostname}' to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      } else if (err.code === 'auth/popup-blocked') {
        userFriendlyMsg = "Browser popup was blocked. Please allow popups for this site.";
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      throw new Error(userFriendlyMsg);
    }
  };

  const loginAsGuest = async () => {
    const u: AppUser = {
      uid: 'guest-' + Math.random().toString(36).slice(2, 8),
      email: null,
      displayName: 'Citizen Guest',
      photoURL: null,
    };
    setUser(u);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const u: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL,
      };
      setUser(u);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      await syncUserToFirestore(u);
    } catch (err: any) {
      console.error("Firebase Auth signIn error:", err);
      throw err;
    }
  };

  const signup = async (email: string, pass: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const u: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL,
      };
      setUser(u);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      await syncUserToFirestore(u);
    } catch (err: any) {
      console.error("Firebase Auth createUser error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn("SignOut error:", err);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const loginAsDemo = () => {
    const demoUser: AppUser = {
      uid: 'demo-citizen-madurai',
      email: 'murugan.kk.nagar@tn.gov.in',
      displayName: 'K. Murugan',
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      signOut: logout, 
      signInWithGoogle, 
      loginAsGuest, 
      loginAsDemo 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
