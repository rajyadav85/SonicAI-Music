import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    signup,
    loginAsGuest,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isNotRegisteredError, setIsNotRegisteredError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (mode) => {
    setAuthModalMode(mode);
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setIsNotRegisteredError(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setIsNotRegisteredError(false);
    setShowPassword(false);
    closeAuthModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsNotRegisteredError(false);
    setIsLoading(true);

    setTimeout(() => {
      let res;
      if (authModalMode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg('Please enter a valid email address');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        res = signup(name, email, password);
      } else {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both your email and password');
          setIsLoading(false);
          return;
        }
        res = login(email, password);
      }

      setIsLoading(false);
      if (res && !res.success) {
        setErrorMsg(res.message);
        if (res.notRegistered) {
          setIsNotRegisteredError(true);
        }
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Decorative Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#a7a7a7] hover:text-white hover:bg-[#282828] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 mb-3 shadow-lg shadow-purple-900/40">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {authModalMode === 'login' ? 'Welcome Back' : 'Create Free Account'}
            </h2>
            <p className="text-xs text-[#a7a7a7] mt-1">
              {authModalMode === 'login'
                ? 'Sign in with your registered account to continue'
                : 'Sign up to create your personalized music profile'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#242424] p-1 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'signup'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner with Quick Action */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex flex-col gap-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-semibold leading-tight">{errorMsg}</span>
              </div>
              {isNotRegisteredError && (
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="mt-1 text-left text-xs text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
                >
                  👉 Click here to Sign Up now
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" key={authModalMode}>
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#b3b3b3] mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-[#757575] pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#242424] border border-white/5 text-sm text-white placeholder-[#757575] focus:outline-none focus:border-purple-500 focus:bg-[#282828] transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#b3b3b3] mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#757575] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#242424] border border-white/5 text-sm text-white placeholder-[#757575] focus:outline-none focus:border-purple-500 focus:bg-[#282828] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b3b3b3] mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#757575] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#242424] border border-white/5 text-sm text-white placeholder-[#757575] focus:outline-none focus:border-purple-500 focus:bg-[#282828] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#757575] hover:text-white transition p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Log In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-[#181818] text-[11px] uppercase tracking-wider text-[#757575] font-semibold">
              Or Instant Access
            </span>
          </div>

          {/* Quick 1-Click Demo Guest Login */}
          <button
            type="button"
            onClick={loginAsGuest}
            className="w-full h-10 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] border border-white/10 text-white text-xs font-bold transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>1-Click Demo Verified Account (demo@aimusic.com)</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="bg-[#141414] px-6 py-4 text-center border-t border-white/5">
          <p className="text-xs text-[#a7a7a7]">
            {authModalMode === 'login' ? "Don't have an account yet? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => handleTabSwitch(authModalMode === 'login' ? 'signup' : 'login')}
              className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
            >
              {authModalMode === 'login' ? 'Sign up free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
