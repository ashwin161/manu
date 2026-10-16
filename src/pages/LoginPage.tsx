import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { ArrowRight, ShieldCheck, Landmark } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isTa = language === 'ta';
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError(isTa ? 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் நிரப்பவும்.' : 'Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || (isTa ? 'உள்நுழைவு தோல்வியடைந்தது.' : 'Login failed. Please verify credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#fcfcfc]">
      <div className="max-w-md w-full bg-white border border-neutral-300 shadow-sm p-8 sm:p-10 space-y-6">
        
        {/* Emblem & Official Header */}
        <div className="text-center space-y-2 border-b border-neutral-200 pb-6">
          <div className="w-12 h-12 bg-black text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto border border-black shadow-xs">
            ம
          </div>
          <div className="font-state-crest text-xs tracking-widest text-neutral-500 uppercase">
            Government of Tamil Nadu
          </div>
          <h2 className="text-2xl font-bold font-display-serif text-black tracking-tight">
            {isTa ? 'குடிமக்கள் உள்நுழைவு' : 'Citizen Access Portal'}
          </h2>
          <p className="text-xs text-neutral-600">
            {isTa 
              ? 'உங்கள் மனுக்கள் மற்றும் சட்டபூர்வ ஆவணங்களை அணுகவும்' 
              : 'Sign in to draft, sign, and archive official petitions'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-neutral-100 border border-black text-xs text-black font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              {isTa ? 'மின்னஞ்சல் முகவரி' : 'Official Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@tngov.org"
              required
              className="gov-input w-full px-3.5 py-2.5 text-xs text-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              {isTa ? 'கடவுச்சொல்' : 'Secure Passcode'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="gov-input w-full px-3.5 py-2.5 text-xs text-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 gov-btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{submitting ? (isTa ? 'சரிபார்க்கிறது...' : 'Verifying...') : (isTa ? 'உள்நுழைக' : 'Sign In')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 gov-btn-secondary text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>⚡ {isTa ? 'சோதனை பயனர் மூலம் விரைவு அணுகல்' : 'Instant Demo Citizen Access'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600 space-y-2">
          <p>
            {isTa ? 'புதிய மனுதாரரா?' : "Don't have an account?"}{' '}
            <Link to="/auth/signup" className="font-bold text-black underline underline-offset-2 hover:text-neutral-700">
              {isTa ? 'புதிய கணக்கை உருவாக்கவும்' : 'Register Here'}
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Official Encrypted Citizen Grievance Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
};
