import React, { useState } from 'react';
import { Check, Copy, Code2, Terminal } from 'lucide-react';
import { highlightCode } from '../../lib/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'cpp',
  filename,
  title,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const lineCount = code.trim().split('\n').length;
  const highlightedHtml = highlightCode(code, language);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0B132B] shadow-2xl my-4 text-slate-100">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#070D1F] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {filename ? (
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
              <Code2 className="w-3.5 h-3.5" />
              <span>{filename}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>{title || language.toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {lineCount} lines • {language.toUpperCase()}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-mono transition-all duration-200 ${
              copied
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
            }`}
            aria-label="Copy code snippet to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code viewport with line numbers & syntax styling */}
      <div className="relative overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-relaxed">
        <pre className="!bg-transparent !p-0 !m-0">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};
