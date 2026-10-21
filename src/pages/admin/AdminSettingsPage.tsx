import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useData();
  const { success, error: toastError } = useToast();

  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorInstagram, setCreatorInstagram] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [announcementBanner, setAnnouncementBanner] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.site_name || 'VoltNex Labs');
      setTagline(settings.tagline || 'Power Ideas. Build the Future.');
      setDescription(settings.description || '');
      setCreatorName(settings.creator_name || 'Pradeep');
      setCreatorInstagram(settings.creator_instagram || '@pradeep_ln22');
      setContactEmail(settings.contact_email || 'voltnex518@gmail.com');
      setAnnouncementBanner(settings.announcement_banner || '');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) {
      toastError('Validation Error', 'Site name cannot be empty.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      toastError('Validation Error', 'Valid contact email is required.');
      return;
    }

    setIsSaving(true);
    const res = await updateSettings({
      site_name: siteName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      creator_name: creatorName.trim(),
      creator_instagram: creatorInstagram.trim(),
      contact_email: contactEmail.trim(),
      announcement_banner: announcementBanner.trim(),
    });
    setIsSaving(false);

    if (res.success) {
      success('Settings Updated', 'Platform global configurations saved.');
    } else {
      toastError('Update Error', res.error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
          Platform Configuration & Identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update brand name, creator contact info, announcement ribbons, and metadata.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Platform Name *
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                required
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Tagline *
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Global Platform Description (SEO & Footer)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 text-sm p-4 rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Announcement Ribbon Banner (Displays at top of public site)
              </label>
              <input
                type="text"
                value={announcementBanner}
                onChange={(e) => setAnnouncementBanner(e.target.value)}
                placeholder="Leave blank to hide ribbon banner"
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Creator & Contact Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3">
            Creator Details & Public Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Creator Full Name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={creatorInstagram}
                onChange={(e) => setCreatorInstagram(e.target.value)}
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Contact Inquiries Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
