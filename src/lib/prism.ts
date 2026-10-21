import Prism from 'prismjs';

// Import essential languages for electronics & robotics
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

export function highlightCode(code: string, language: string): string {
  const normalizedLang = language.toLowerCase().trim();
  
  // Map common hardware extensions to Prism grammars
  let grammar = Prism.languages[normalizedLang];
  if (!grammar) {
    if (normalizedLang === 'ino' || normalizedLang === 'arduino') {
      grammar = Prism.languages.cpp;
    } else if (normalizedLang === 'py') {
      grammar = Prism.languages.python;
    } else if (normalizedLang === 'sh' || normalizedLang === 'shell') {
      grammar = Prism.languages.bash;
    } else if (normalizedLang === 'h' || normalizedLang === 'hpp') {
      grammar = Prism.languages.cpp;
    } else {
      grammar = Prism.languages.clike || Prism.languages.javascript;
    }
  }

  try {
    return Prism.highlight(code, grammar || Prism.languages.extend('clike', {}), normalizedLang);
  } catch {
    // Graceful fallback to raw escaped code
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
