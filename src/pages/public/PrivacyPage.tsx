import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-subtle space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold mb-3 border border-blue-200/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Effective Date: March 2026 • VoltNex Labs
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-bold font-display text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              VoltNex Labs is committed to privacy. We collect minimal personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Contact Form Submissions:</strong> When you voluntarily submit a message, we store your name, email address, and inquiry text to reply to you.
              </li>
              <li>
                <strong>Newsletter Subscriptions:</strong> Your email address is stored securely if you subscribe to maker dispatches.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> Standard non-identifying server logs (IP address, user agent) collected by our hosting provider for security and DDoS mitigation.
              </li>
            </ul>

            <h2 className="text-xl font-bold font-display text-slate-900">
              2. How We Protect Your Data
            </h2>
            <p>
              All data is transmitted using encrypted HTTPS (TLS 1.3). Database access is guarded with PostgreSQL Row Level Security (RLS) policies, ensuring anonymous visitors cannot read private inbox submissions or unpublished records.
            </p>

            <h2 className="text-xl font-bold font-display text-slate-900">
              3. Third-Party Sharing
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or monetize your contact information or browsing data. Data is processed solely through our infrastructure (Supabase PostgreSQL & Cloudflare CDN).
            </p>

            <h2 className="text-xl font-bold font-display text-slate-900">
              4. Contact the Data Controller
            </h2>
            <p>
              For privacy queries or to request deletion of your submitted messages, contact Pradeep at{' '}
              <a href="mailto:voltnex518@gmail.com" className="text-blue-600 underline">
                voltnex518@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
