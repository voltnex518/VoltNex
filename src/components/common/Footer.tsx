import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Newsletter / Community Section */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Maker Dispatch
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                Stay Ahead in Embedded & Robotics Engineering
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Get new open-source schematics, firmware architectures, and hardware blueprints delivered directly to your inbox.
              </p>
            </div>

            <div className="w-full md:w-auto">
              {newsletterSubmitted ? (
                <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-4 py-2.5 rounded-xl text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>You're subscribed! Welcome to the VoltNex community.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="engineer@domain.com"
                      required
                      className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
              {newsletterError && (
                <p className="text-xs text-rose-400 mt-1.5 ml-1">{newsletterError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-slate-700/60 bg-white p-0.5 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="VoltNex Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-display text-white">
                {settings?.site_name || 'VoltNex Labs'}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings?.description ||
                'An open-access platform empowering makers, hardware hobbyists, and robotics engineers with verified circuit blueprints and firmware source code.'}
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Creator:</span>
                <span>{settings?.creator_name || 'Pradeep'}</span>
              </div>
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <a
                  href={`https://instagram.com/${(settings?.creator_instagram || '@voltn.ex').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition"
                >
                  {settings?.creator_instagram || '@voltn.ex'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a
                  href={`mailto:${settings?.contact_email || 'voltnex518@gmail.com'}`}
                  className="hover:text-cyan-400 transition"
                >
                  {settings?.contact_email || 'voltnex518@gmail.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/projects" className="hover:text-white transition">
                  Projects Library
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-white transition">
                  Tutorials & Guides
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition">
                  Source Code & Schematics
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About VoltNex
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Hardware Focus
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/projects?category=${cat.slug}`}
                    className="hover:text-white transition flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Safety */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/terms#safety-disclaimer" className="hover:text-white transition">
                  Electronics Safety Notice
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-cyan-400 transition inline-flex items-center gap-1">
                  <span>Owner Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 VoltNex Labs. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed & Built for makers worldwide. Power Ideas. Build the Future.
          </p>
        </div>
      </div>
    </footer>
  );
};
