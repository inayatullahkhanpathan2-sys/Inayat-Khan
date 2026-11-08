import React, { useState } from 'react';
import { X, BookOpen, Check, Music2, Sparkles, Sliders } from 'lucide-react';
import { POETRY_PRESETS } from '../utils/presetData';
import { PoetryPresetItem } from '../types';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PoetryPresetItem) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [filterLang, setFilterLang] = useState<'All' | 'Urdu' | 'Roman Urdu' | 'English'>('All');

  if (!isOpen) return null;

  const filtered =
    filterLang === 'All'
      ? POETRY_PRESETS
      : POETRY_PRESETS.filter((p) => p.language === filterLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Curated Poetry & Couplets</h2>
              <p className="text-xs text-neutral-400">Classic Shayari & Aesthetic Verses for 9:16 Videos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex gap-2">
          {(['All', 'Urdu', 'Roman Urdu', 'English'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLang(lang)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors ${
                filterLang === lang
                  ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Preset Cards List */}
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.map((preset) => (
            <div
              key={preset.id}
              className="group relative rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-rose-400">{preset.title}</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">{preset.poet}</span>
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">
                      {preset.language}
                    </span>
                  </div>

                  <div
                    dir={preset.language === 'Urdu' ? 'rtl' : 'ltr'}
                    className={`mt-2.5 text-neutral-100 ${
                      preset.language === 'Urdu'
                        ? 'font-nastaliq text-lg leading-loose'
                        : 'font-serif text-sm italic leading-relaxed'
                    }`}
                  >
                    {preset.lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Music2 className="h-3 w-3 text-amber-400" />
                      {preset.suggestedMusic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sliders className="h-3 w-3 text-emerald-400" />
                      {preset.suggestedMotion}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="rounded-xl bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-rose-600 active:scale-95 shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
