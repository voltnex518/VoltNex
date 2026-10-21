import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Home, Cpu, BookOpen } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Visual 404 with lightning icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-md">
          <Zap className="w-12 h-12" />
          <span className="absolute -top-2 -right-2 bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Circuit Trace Disconnected
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page, blueprint, or resource you are seeking does not exist on this branch. Check the address or jump back into active projects.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return Home
          </Button>
        </div>

        {/* Shortcuts */}
        <div className="pt-6 border-t border-slate-200/80">
          <span className="text-xs font-mono text-slate-400 block mb-3">Popular Directories</span>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-blue-600">
            <Link to="/projects" className="hover:underline flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Projects Library</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/tutorials" className="hover:underline flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tutorials</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
