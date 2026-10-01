import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { checkSetupStatus, loginAdmin, setupOwnerAccount } from '../../services/authClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function determineMode() {
      setLoadingStatus(true);
      const status = await checkSetupStatus();
      setIsSetupMode(status.needsSetup);
      setLoadingStatus(false);
    }
    determineMode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (isSetupMode) {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-type.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isSetupMode) {
        await setupOwnerAccount(email, password);
      } else {
        await loginAdmin(email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-white dark:bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#a3a3a3]">
            Verifying Admin Security...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 md:pt-36 md:pb-24 bg-white dark:bg-[#0d0d0d] flex flex-col justify-center px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        
        {/* Back Link */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Website</span>
        </button>

        {/* Card Frame */}
        <div className="bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Header Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              {isSetupMode ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-white dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#333] text-[#666666] dark:text-[#a3a3a3]">
              {isSetupMode ? 'Initial Setup' : 'Admin Access'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-2">
            {isSetupMode ? 'Create Owner Account' : 'Sign In to Blog Dashboard'}
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#a3a3a3] mb-6 leading-relaxed">
            {isSetupMode
              ? 'Welcome, Fiorella! Set up your primary administrator credentials to manage and publish SEO insights securely.'
              : 'Enter your administrator credentials to access the article management dashboard.'}
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#ededed] mb-1.5">
                Owner Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] dark:text-[#a3a3a3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fiorellacorazon1@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs sm:text-sm font-medium text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#ededed] mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#666666] dark:text-[#a3a3a3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs sm:text-sm font-medium text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isSetupMode && (
                <span className="block text-[11px] text-[#666666] dark:text-[#a3a3a3] mt-1 font-normal">
                  Minimum 8 characters. Stored securely with cryptographic salted PBKDF2 hash.
                </span>
              )}
            </div>

            {isSetupMode && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#ededed] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#666666] dark:text-[#a3a3a3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs sm:text-sm font-medium text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{isSetupMode ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isSetupMode ? 'Register Owner Account' : 'Sign In to Dashboard'}</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-[#e5e5e5] dark:border-[#262626] text-[11px] text-[#666666] dark:text-[#a3a3a3] text-center">
            <span>Encrypted with SHA-512 & HMACSigned Sessions</span>
          </div>

        </div>

      </div>
    </div>
  );
};
