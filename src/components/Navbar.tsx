import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
              M
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-tight block">Manu</span>
              <span className="text-[10px] text-gray-500 block -mt-1">Tanglish to Tamil Petition</span>
            </div>
          </Link>
        </div>

        <nav className="flex items-center space-x-3">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
              >
                Dashboard
              </Link>
              <Link 
                to="/create" 
                className="text-sm font-medium bg-indigo-600 text-white px-3.5 py-1.5 rounded-md hover:bg-indigo-700 transition"
              >
                + New Petition
              </Link>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              <span className="text-xs text-gray-500 hidden sm:inline-block max-w-[150px] truncate">
                {user.email || user.displayName}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs text-gray-600 hover:text-red-600 border border-gray-300 px-2.5 py-1 rounded hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link 
                to="/auth/signup" 
                className="text-sm font-medium bg-indigo-600 text-white px-3.5 py-1.5 rounded-md hover:bg-indigo-700 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
