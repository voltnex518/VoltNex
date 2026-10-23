import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  BookOpen,
  FolderDown,
  Mail,
  Plus,
  ArrowUpRight,
  Database,
  Settings,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { testSupabaseConnection } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';

export const AdminOverviewPage: React.FC = () => {
  const { projects, tutorials, resources, circuits, messages } = useData();
  const { isDemoMode, user } = useAuth();
  const [dbStatus, setDbStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    testSupabaseConnection().then(setDbStatus);
  }, []);

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;

  const statCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      subtext: `${publishedProjects} Published • ${draftProjects} Drafts`,
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 border-blue-200/80',
      link: '/admin/projects',
    },
    {
      title: 'Circuit Blueprints',
      value: circuits.length,
      subtext: `${circuits.filter((c) => c.status === 'published').length} Published • Studio Active`,
      icon: Zap,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200/80',
      link: '/admin/circuits',
    },
    {
      title: 'Published Tutorials',
      value: tutorials.filter((t) => t.status === 'published').length,
      subtext: `${tutorials.length} total authored`,
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
      link: '/admin/tutorials',
    },
    {
      title: 'Hardware Resources',
      value: resources.length,
      subtext: 'Schematics, CAD, .ino code',
      icon: FolderDown,
      color: 'text-purple-600 bg-purple-50 border-purple-200/80',
      link: '/admin/resources',
    },
    {
      title: 'Inquiries & Feedback',
      value: messages.length,
      subtext: `${unreadMessages} unread messages`,
      icon: Mail,
      color: unreadMessages > 0 ? 'text-rose-600 bg-rose-50 border-rose-200/80' : 'text-slate-600 bg-slate-50 border-slate-200',
      link: '/admin/messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Platform Command Center
            </h1>
            {isDemoMode ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase border border-amber-300">
                Demo Auth
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase border border-emerald-300">
                Live Supabase
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{user?.email || 'voltnex518@gmail.com'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/projects/new">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Blueprint
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Backend Status Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              dbStatus?.ok ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Database & Storage Integration Status
            </h4>
            <p className="text-xs text-slate-700 mt-0.5">
              {dbStatus ? dbStatus.message : 'Checking connection...'}
            </p>
          </div>
        </div>

        {isDemoMode && (
          <div className="text-xs font-mono bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">
            See README.md to configure Supabase URL & Key
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-elevated hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-500 block">
                    {card.title}
                  </span>
                  <div className="text-2xl font-black font-display text-slate-900 mt-1">
                    {card.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-blue-600 font-medium">
                <span>{card.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Shortcuts & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-display text-slate-900">
              Recent Blueprint Updates
            </h3>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>{p.difficulty}</span>
                    <span>•</span>
                    <span>{p.estimated_time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={p.status} />
                  <Link
                    to={`/admin/projects/edit/${p.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Creator Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/projects/new"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Draft New Project Blueprint</span>
                </div>
                <Plus className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/resources"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-100 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <FolderDown className="w-4 h-4 text-cyan-600" />
                  <span>Upload Hardware Firmware / CAD</span>
                </div>
                <Plus className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-100 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>Manage Taxonomy Categories</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/messages"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span>View Visitor Inquiries</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                  {unreadMessages}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
