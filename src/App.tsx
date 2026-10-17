import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { MobileAppShell } from '@/src/components/MobileAppShell';
import { SplashScreen } from '@/src/pages/SplashScreen';
import { LocationPermissionScreen } from '@/src/pages/LocationPermissionScreen';
import { HomeScreen } from '@/src/pages/HomeScreen';
import { WizardContainer } from '@/src/pages/GuidedWizard/WizardContainer';
import { PetitionsListScreen } from '@/src/pages/PetitionsListScreen';
import { SettingsScreen } from '@/src/pages/SettingsScreen';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <MobileAppShell>
      <Routes>
        <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/splash" replace />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/auth" element={<SplashScreen />} />
        <Route path="/location" element={<LocationPermissionScreen />} />
        <Route path="/wizard" element={<WizardContainer />} />
        <Route path="/create" element={<WizardContainer />} />
        <Route path="/petitions" element={<PetitionsListScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileAppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
