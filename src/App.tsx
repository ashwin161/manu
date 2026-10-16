import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/src/context/AuthContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { Navbar } from '@/src/components/Navbar';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { LandingPage } from '@/src/pages/LandingPage';
import { LoginPage } from '@/src/pages/LoginPage';
import { SignupPage } from '@/src/pages/SignupPage';
import { DashboardPage } from '@/src/pages/DashboardPage';
import { CreatePetitionPage } from '@/src/pages/CreatePetitionPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-ui antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePetitionPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
