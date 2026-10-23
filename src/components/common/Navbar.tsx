import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Shield,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAdmin, isDemoMode } = useAuth();
  const { settings } = useData();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Projects', path: '/projects' },
    { name: 'Circuits', path: '/circuits' },
    { name: 'Tutorials', path: '/tutorials' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Announcement banner if set in Site Settings */}
      {settings?.announcement_banner && (
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚡ {settings.announcement_banner}</span>
          <Link
            to="/projects"
            className="underline underline-offset-2 hover:opacity-90 inline-flex items-center gap-0.5"
          >
            Explore <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 ring-1 ring-slate-200/60 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 bg-white">
              <img
                src="/logo.png"
                alt="VoltNex Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {settings?.site_name || 'VoltNex Labs'}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 hidden sm:block">
                Power Ideas. Build the Future.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search input */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-48 xl:w-64">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Dashboard / Sign In Link */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Dashboard</span>
                {isDemoMode && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-mono text-[9px] rounded uppercase font-bold">
                    Demo
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Admin Sign In"
                aria-label="Admin Sign In"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="lg:hidden py-3 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search Arduino, ESP32, Robotics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
            >
              <Shield className="w-4 h-4" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
