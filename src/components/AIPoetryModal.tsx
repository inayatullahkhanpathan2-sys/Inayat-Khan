import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  BookOpen,
  ArrowRight,
  Check,
  RefreshCw,
  Quote,
} from 'lucide-react';
import { PresetMusicType, MotionType, FontFamilyType } from '../types';

interface AIPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPoetry: (data: {
    poetry: string;
    author: string;
    fontFamily?: FontFamilyType;
    suggestedMusic?: PresetMusicType;
    suggestedMotion?: MotionType;
  }) => void;
}

export const AIPoetryModal: React.FC<AIPoetryModalProps> = ({
  isOpen,
  onClose,
  onApplyPoetry,
}) => {
  const [language, setLanguage] = useState<'urdu' | 'roman_urdu' | 'english'>('urdu');
  const [genre, setGenre] = useState('sad');
  const [authorStyle, setAuthorStyle] = useState('faiz');
  const [customPrompt, setCustomPrompt] = useState('');
  const [linesCount, setLinesCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    poetry: string;
    title: string;
    author: string;
    englishTranslation?: string;
    suggestedMusic?: PresetMusicType;
    suggestedMotion?: MotionType;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          language: language === 'urdu' ? 'Urdu' : language === 'roman_urdu' ? 'Roman Urdu' : 'English',
          authorStyle,
          customPrompt,
          linesCount,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        throw new Error(resData.error || 'Failed to generate poetry');
      }
    } catch (err: any) {
      console.error('Poetry generation error:', err);
      // Fallback aesthetic verse if offline or API key issue
      setResult({
        poetry:
          language === 'urdu'
            ? 'تیرے بغیر بھی جی تو رہے ہیں ہم لیکن\nسکونِ قلب کا ہر سلسلہ ادھورا ہے'
            : language === 'roman_urdu'
            ? 'Tere baghair bhi jee toh rahe hain hum lekin\nSukoon-e-dil ka har silsila adhoora hai'
            : 'In the sanctuary of quiet night,\nYour memory remains my only light.',
        title: 'Khamosh Yaadein',
        author: '— نغمۂ دل',
        suggestedMusic: 'Sad Piano',
        suggestedMotion: 'Cold Breeze Sway',
      });
      setError(err?.message ? `Note: Using curated aesthetic verse (${err.message})` : null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyPoetry({
      poetry: result.poetry,
      author: result.author ? `— ${result.author}` : '— نغمۂ دل',
      fontFamily: language === 'urdu' ? 'Noto Nastaliq Urdu' : 'Cinzel',
      suggestedMusic: result.suggestedMusic,
      suggestedMotion: result.suggestedMotion,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl shadow-rose-950/40 text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md ring-1 ring-amber-400/30">
              <img src="/poetify-logo.png" alt="Poetify" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Poetify AI Poetry Generator</h2>
              <p className="text-xs text-neutral-400">Powered by Gemini AI for TikTok & Reels Shayari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Language Tabs */}
          <div>
            <label className="text-xs font-medium text-neutral-400 block mb-1.5">Language & Script</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'urdu', label: 'Urdu (نستعلیق)' },
                { id: 'roman_urdu', label: 'Roman Urdu' },
                { id: 'english', label: 'Aesthetic English' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as any)}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                    language === lang.id
                      ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                      : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood / Genre */}
          <div>
            <label className="text-xs font-medium text-neutral-400 block mb-1.5">Mood & Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sad', label: '💔 Sad / Dard' },
                { id: 'ishq', label: '🌹 Ishq / Romantic' },
                { id: 'sukoon', label: '🌙 Sukoon / Solitude' },
                { id: 'sufi', label: '✨ Sufi / Philosophical' },
                { id: 'rain', label: '🌧️ Rain / Nostalgia' },
                { id: 'motivational', label: '🦅 Khudi / Courage' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setGenre(m.id)}
                  className={`rounded-xl py-2 px-2.5 text-xs text-left border transition-all ${
                    genre === m.id
                      ? 'border-amber-500 bg-amber-500/15 text-amber-200 font-semibold'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Poet Style */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-400 block mb-1">Poetic Influence / Style</label>
              <select
                value={authorStyle}
                onChange={(e) => setAuthorStyle(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500"
              >
                <option value="Faiz Ahmad Faiz">Faiz Ahmad Faiz (فیض احمد فیض)</option>
                <option value="Mirza Ghalib">Mirza Ghalib (مرزا غالب)</option>
                <option value="Jaun Elia">Jaun Elia (جون ایلیا)</option>
                <option value="Allama Iqbal">Allama Iqbal (علامہ اقبال)</option>
                <option value="Parveen Shakir">Parveen Shakir (پروین شاکر)</option>
                <option value="Rumi">Rumi (Ethereal Sufi)</option>
                <option value="Modern Minimalist">Modern Minimalist Poetry</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 block mb-1">Length</label>
              <select
                value={linesCount}
                onChange={(e) => setLinesCount(parseInt(e.target.value))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500"
              >
                <option value={2}>2 Lines (Classic Couplet / Sher)</option>
                <option value={3}>3 Lines (Trio Verse)</option>
                <option value={4}>4 Lines (Quatrain / Ruba'i)</option>
              </select>
            </div>
          </div>

          {/* Custom Keywords / Prompt */}
          <div>
            <label className="text-xs font-medium text-neutral-400 block mb-1">
              Custom Topic or Story (Optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Walking alone in winter rain, unsaid goodbyes, endless night..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none focus:border-rose-500"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Weaving Poetry with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-200" />
                <span>Generate Aesthetic Verse</span>
              </>
            )}
          </button>

          {/* Result Card */}
          {result && (
            <div className="rounded-2xl border border-rose-500/30 bg-neutral-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5" />
                  {result.title || 'Generated Verse'}
                </span>
                <span className="text-[11px]">{result.author}</span>
              </div>

              {/* Main Verse */}
              <div
                dir={language === 'urdu' ? 'rtl' : 'ltr'}
                className={`p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80 text-center text-white ${
                  language === 'urdu'
                    ? 'font-nastaliq text-xl leading-loose'
                    : 'font-serif text-base italic leading-relaxed'
                }`}
              >
                {result.poetry.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* English translation if provided */}
              {result.englishTranslation && (
                <p className="text-xs italic text-neutral-400 text-center">
                  "{result.englishTranslation}"
                </p>
              )}

              {/* Suggested pairings */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 border-t border-neutral-800 pt-2">
                <div>
                  Suggested: <span className="text-amber-300">{result.suggestedMusic}</span> &{' '}
                  <span className="text-emerald-300">{result.suggestedMotion}</span>
                </div>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Apply to Video</span>
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-[11px] text-amber-400/90 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};
