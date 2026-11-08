import React from 'react';
import { Film, Sparkles, Wand2, Music2, BookOpen } from 'lucide-react';
import { PoetifyLogo } from './PoetifyLogo';

interface NavbarProps {
  onOpenAIGenerator: () => void;
  onOpenPresets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIGenerator, onOpenPresets }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <PoetifyLogo size="md" showSubtitle={true} />

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs font-medium text-neutral-200 transition-all hover:bg-neutral-800 hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Classic Presets</span>
          </button>

          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-rose-950/40 transition-all hover:brightness-110 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-200 animate-pulse" />
            <span>AI Poetry Writer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
