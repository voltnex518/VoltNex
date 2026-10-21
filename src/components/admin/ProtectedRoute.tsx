import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm font-mono text-slate-400">Verifying security token...</p>
      </div>
    );
  }

  // Not signed in -> redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Signed in, but database profile role is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md w-full bg-slate-900 border border-rose-900/40 p-8 rounded-3xl shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-display text-white">403 — Unauthorized Access</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are authenticated as <span className="font-mono text-slate-200">{user.email}</span>, but this account has not been designated with an <code className="text-amber-400">admin</code> role in the database <code className="text-amber-400">profiles</code> table.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => signOut()}
            >
              Sign Out & Switch Account
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = '/')}
            >
              Back to Public Site
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
