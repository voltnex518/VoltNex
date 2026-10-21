import React from 'react';
import { ShieldAlert, Scale } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-subtle space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold mb-3 border border-blue-200/60">
              <Scale className="w-3.5 h-3.5" />
              <span>Terms of Use & Disclaimer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Terms of Use & Safety Disclaimer
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Effective Date: March 2026 • VoltNex Labs
            </p>
          </div>

          {/* Safety Disclaimer Callout */}
          <div id="safety-disclaimer" className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>CRITICAL ELECTRONICS & HARDWARE SAFETY NOTICE</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
              Building physical electronics involves soldering irons reaching 350°C+, electrochemical lithium-ion batteries susceptible to thermal runaway if shorted, and mains AC potentials that carry electrocution hazards. You are solely responsible for ensuring adequate fused isolation, personal protective equipment (PPE), and bench fire safety when executing blueprints on VoltNex Labs.
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-bold font-display text-slate-900">
              1. Open Source Licensing
            </h2>
            <p>
              Unless explicitly specified otherwise within a repository header, firmware source code (.ino, .c, .cpp, .py) published by VoltNex Labs is distributed under the <strong>MIT License</strong>. You are permitted to inspect, modify, and integrate code into personal and educational builds with proper creator attribution to Pradeep / VoltNex Labs.
            </p>

            <h2 className="text-xl font-bold font-display text-slate-900">
              2. No Warranty of Commercial Fitness
            </h2>
            <p>
              All schematics, pinout guides, and firmware routines are provided on an "as-is" and "as-available" basis. VoltNex Labs makes no warranties that hardware designs will comply with CE, FCC, or regional electromagnetic compatibility regulations without supplemental shielding.
            </p>

            <h2 className="text-xl font-bold font-display text-slate-900">
              3. Prohibited Misuse
            </h2>
            <p>
              You agree not to utilize VoltNex blueprints or downloadable firmware for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Weaponized payloads, projectile launchers, or unlawful signal jamming apparatus.</li>
              <li>Unauthorized RF transmissions outside of allocated ISM sub-GHz bands.</li>
              <li>Automated scraping or denial of service against the platform.</li>
            </ul>

            <h2 className="text-xl font-bold font-display text-slate-900">
              4. Questions & Inquiries
            </h2>
            <p>
              For licensing inquiries or commercial consultation, contact{' '}
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
