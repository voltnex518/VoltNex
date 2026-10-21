import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Zap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';

export const AdminLoginPage: React.FC = () => {
  const { signIn, resetPassword, isDemoMode, user, isAdmin } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('voltnex518@gmail.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (user && isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setResetSent(null);

    if (!email.trim()) {
      setLoginError('Email address is required.');
      return;
    }

    if (!isDemoMode && !password) {
      setLoginError('Password is required for production authentication.');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (result.error) {
      setLoginError(result.error);
    } else {
      success('Authentication Successful', 'Welcome to the VoltNex Owner Dashboard.');
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email.trim()) {
      setLoginError('Please enter your email to receive a password recovery link.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (res.error) {
      setLoginError(res.error);
    } else {
      setResetSent(res.message || 'Password reset email sent.');
      setShowResetForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Circuit Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap className="w-6 h-6 fill-white" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            VoltNex Owner Portal
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Administrative Access & Database Management
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Local Offline Demonstration Mode</span>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">
              Supabase credentials are not configured in your <code className="text-white">.env</code> file. You can sign in with the owner email <strong className="text-white">voltnex518@gmail.com</strong> (no live password required) to explore and test all CRUD features locally.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="mt-6 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl">
          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 font-medium">{loginError}</div>
            </div>
          )}

          {resetSent && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <div className="flex-1 font-medium">{resetSent}</div>
            </div>
          )}

          {!showResetForm ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Owner Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="voltnex518@gmail.com"
                    className="w-full bg-slate-900/80 text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    Master Password
                  </label>
                  {!isDemoMode && (
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isDemoMode ? "Optional in demo mode" : "••••••••••••"}
                    className="w-full bg-slate-900/80 text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  className="w-full"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-xs text-slate-300 leading-relaxed mb-4">
                Enter your administrative email to receive a secure password recovery token from Supabase Auth.
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="voltnex518@gmail.com"
                  className="w-full bg-slate-900/80 text-sm text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowResetForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1"
                  isLoading={isSubmitting}
                  leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700/80 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
