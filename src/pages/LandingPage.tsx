import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user, loginAsDemo } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            Phase 1 • Core Architecture & Authentication
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Manu (மனு)
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Tanglish to Official Tamil Petition Generator for Tamil Nadu Government grievances.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
            >
              Go to Dashboard ({user.email || 'Citizen'})
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {!user && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={loginAsDemo}
              className="text-xs text-indigo-600 hover:text-indigo-800 underline font-medium"
            >
              Instant Test Access: Login as Demo Citizen
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left border-t border-gray-100">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 text-sm">1. Input Informal Tanglish</h3>
            <p className="text-xs text-gray-500 mt-1">
              Type or dictate grievances in casual spoken Tanglish.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 text-sm">2. Dual Formal Output</h3>
            <p className="text-xs text-gray-500 mt-1">
              Generates official Tamil Nadu Secretariat format and pristine English letters.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 text-sm">3. Save &amp; Track</h3>
            <p className="text-xs text-gray-500 mt-1">
              Petitions stored securely in Firestore with instant A4 sheet export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
