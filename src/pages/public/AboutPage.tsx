import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Mail,
  ArrowRight,
  Code2,
  Terminal,
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { useData } from '../../context/DataContext';

export const AboutPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200/60">
            <Zap className="w-3.5 h-3.5" />
            <span>Open Engineering Manifesto</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
            About VoltNex Labs
          </h1>
          <p className="text-lg text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
            Power Ideas. Build the Future. Bridging the gap between theoretical schematics and physical, working hardware.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-subtle space-y-6">
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Why VoltNex Labs Was Founded
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-sans">
            In modern maker education, finding reliable, production-tested hardware projects is surprisingly difficult. Many online tutorials feature untested breadboard sketches with missing decoupling capacitors, unhandled I2C bus locks, or floating input pins that fail the moment they are packaged into real products.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-sans">
            <strong>VoltNex Labs</strong> was created to eliminate guesswork. Every blueprint hosted on this platform includes verified Bill of Materials, exact pinout maps, oscillated timing parameters, and clean C/C++ firmware with structured state machines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Verified Hardware</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Circuits verified on physical silicon before being published.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Production Firmware</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                FreeRTOS queues, watchdog loops, and non-blocking ISR structures.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">100% Free & Open</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All schematics, 3D CAD files, and firmware are freely downloadable.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Profile */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-cyan-400/50">
            <img src="/logo.png" alt="VoltNex Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3 flex-1 text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Founder & Chief Architect
            </span>
            <h2 className="text-2xl font-bold font-display text-white">
              {settings?.creator_name || 'Pradeep'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Electronics engineer and robotics enthusiast passionate about hands-on maker learning. When not designing circuits or tuning motor PID controllers, I build open-source tools to help makers everywhere turn their ideas into working hardware.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href={`https://instagram.com/${(settings?.creator_instagram || '@pradeep_ln22').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white text-xs font-semibold transition"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>{settings?.creator_instagram || '@pradeep_ln22'}</span>
              </a>
              <a
                href={`mailto:${settings?.contact_email || 'voltnex518@gmail.com'}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{settings?.contact_email || 'voltnex518@gmail.com'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="text-xl font-bold font-display text-slate-900">
            Ready to start building?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
            >
              <span>Explore Blueprints</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
