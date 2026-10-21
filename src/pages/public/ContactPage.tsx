import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';

export const ContactPage: React.FC = () => {
  const { settings, submitContactForm } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Your name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const res = await submitContactForm({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setSubmitError(res.error || 'Failed to submit message. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold mb-3 border border-blue-200/60">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect with VoltNex Labs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Have a question regarding circuit schematics, collaboration on open firmware, or want to report a component correction? Send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Direct Channels
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Email Inquiries</span>
                    <a
                      href={`mailto:${settings?.contact_email || 'voltnex518@gmail.com'}`}
                      className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition break-all"
                    >
                      {settings?.contact_email || 'voltnex518@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600 flex-shrink-0">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Instagram DM</span>
                    <a
                      href={`https://instagram.com/${(settings?.creator_instagram || '@pradeep_ln22').replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-800 hover:text-pink-600 transition"
                    >
                      {settings?.creator_instagram || '@pradeep_ln22'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 text-white rounded-3xl p-6 shadow-md text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-sm text-cyan-300">Creator's Note</h4>
              <p className="text-slate-300">
                Messages sent through this form are logged directly to the VoltNex owner inbox and answered personally by Pradeep.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-subtle">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Delivered!</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. We will review your inquiry and get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Pradeep Kumar"
                        className={`w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border ${
                          errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        } focus:bg-white focus:outline-none focus:border-blue-500 transition`}
                      />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border ${
                          errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        } focus:bg-white focus:outline-none focus:border-blue-500 transition`}
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Question on ESP32 e-Paper deep sleep code"
                      className={`w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border ${
                        errors.subject ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      } focus:bg-white focus:outline-none focus:border-blue-500 transition`}
                    />
                    {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your question or suggestion in detail..."
                      className={`w-full bg-slate-50 text-sm p-4 rounded-xl border ${
                        errors.message ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      } focus:bg-white focus:outline-none focus:border-blue-500 transition`}
                    />
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="md"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
