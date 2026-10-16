import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signup, loginAsDemo } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isTa = language === 'ta';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(isTa ? 'அனைத்து விவரங்களையும் நிரப்பவும்.' : 'Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError(isTa ? 'கடவுச்சொற்கள் பொருந்தவில்லை.' : 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await signup(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || (isTa ? 'பதிவு செய்வதில் பிழை ஏற்பட்டது.' : 'Sign up failed. Please check details.'));
    } finally {
      setSubmitting(false);
    }
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
            {isTa ? 'புதிய மனுதாரர் பதிவு' : 'Citizen Registration'}
          </h2>
          <p className="text-xs text-neutral-600">
            {isTa 
              ? 'தமிழ்நாடு அரசு துறை மனுக்களை உருவாக்க கணக்கை தொடங்குங்கள்' 
              : 'Create an official citizen record for administrative grievances'}
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
              {isTa ? 'மின்னஞ்சல் முகவரி' : 'Citizen Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@domain.com"
              required
              className="gov-input w-full px-3.5 py-2.5 text-xs text-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              {isTa ? 'கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)' : 'Create Passcode (Min 6 chars)'}
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              {isTa ? 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்' : 'Confirm Passcode'}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>{submitting ? (isTa ? 'பதிவு செய்கிறது...' : 'Registering...') : (isTa ? 'கணக்கை தொடங்குக' : 'Create Citizen Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => { loginAsDemo(); navigate('/dashboard'); }}
            className="w-full py-2.5 px-4 gov-btn-secondary text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>⚡ {isTa ? 'சோதனை பயனர் மூலம் விரைவு அணுகல்' : 'Instant Demo Citizen Access'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600">
          <p>
            {isTa ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already registered?'}{' '}
            <Link to="/auth/login" className="font-bold text-black underline underline-offset-2 hover:text-neutral-700">
              {isTa ? 'உள்நுழைக' : 'Sign In Here'}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
