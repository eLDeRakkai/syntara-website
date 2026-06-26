'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { membandingkanData, analisisData } from '@/shared/data/kata-baku-data';
import {
  Scale, Search, PenLine, BookOpen, ChevronRight,
  ArrowRight, Zap, CheckCircle, ClipboardList,
} from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type ModeId = 'membandingkan' | 'detektif' | 'analisis' | 'assessment';
type Difficulty = 'easy' | 'medium' | 'hard';

const MODES = [
  {
    id: 'membandingkan' as ModeId,
    icon: Scale,
    label: 'Membandingkan Kata',
    shortDesc: 'Pilih mana kata yang baku dari beberapa pilihan.',
    gradient: 'from-indigo-500 to-violet-600',
    iconBg: 'bg-indigo-600',
    iconShadow: 'shadow-indigo-200',
    accent: 'indigo',
    badge: 'Pilihan Ganda',
    badgeCls: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    activeBorder: 'border-indigo-400',
    activeRing: 'ring-2 ring-indigo-100',
    activeBg: 'bg-indigo-50/40',
  },
  {
    id: 'detektif' as ModeId,
    icon: Search,
    label: 'Detektif Kata',
    shortDesc: 'Temukan kata tidak baku yang tersembunyi dalam teks.',
    gradient: 'from-sky-500 to-cyan-600',
    iconBg: 'bg-sky-600',
    iconShadow: 'shadow-sky-200',
    accent: 'sky',
    badge: 'Berbasis Teks',
    badgeCls: 'bg-sky-50 text-sky-600 border border-sky-100',
    activeBorder: 'border-sky-400',
    activeRing: 'ring-2 ring-sky-100',
    activeBg: 'bg-sky-50/40',
  },
  {
    id: 'analisis' as ModeId,
    icon: PenLine,
    label: 'Analisis Kalimat',
    shortDesc: 'Temukan kata salah dan tuliskan bentuk bakunya.',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-600',
    iconShadow: 'shadow-violet-200',
    accent: 'violet',
    badge: 'Tulis Jawaban',
    badgeCls: 'bg-violet-50 text-violet-600 border border-violet-100',
    activeBorder: 'border-violet-400',
    activeRing: 'ring-2 ring-violet-100',
    activeBg: 'bg-violet-50/40',
  },
  {
    id: 'assessment' as ModeId,
    icon: ClipboardList,
    label: 'Assessment',
    shortDesc: 'Uji pemahamanmu secara menyeluruh dengan soal campuran.',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-500',
    iconShadow: 'shadow-rose-200',
    accent: 'rose',
    badge: 'Soal Campuran',
    badgeCls: 'bg-rose-50 text-rose-600 border border-rose-100',
    activeBorder: 'border-rose-400',
    activeRing: 'ring-2 ring-rose-100',
    activeBg: 'bg-rose-50/40',
  },
];

const DIFFICULTY_OPTIONS: { key: Difficulty; label: string; desc: string; emoji: string }[] = [
  { key: 'easy',   label: 'Mudah',   desc: '2 paragraf', emoji: '🌱' },
  { key: 'medium', label: 'Sedang', desc: '3 paragraf', emoji: '⚡' },
  { key: 'hard',   label: 'Sulit',   desc: '4 paragraf', emoji: '🔥' },
];

const ASSESSMENT_DIFFICULTY: { key: Difficulty; label: string; desc: string; emoji: string }[] = [
  { key: 'easy',   label: 'Mudah',   desc: '10 soal campuran', emoji: '🌱' },
  { key: 'medium', label: 'Sedang', desc: '20 soal campuran', emoji: '⚡' },
  { key: 'hard',   label: 'Sulit',   desc: '30 soal campuran', emoji: '🔥' },
];

// ─── Letter Picker ─────────────────────────────────────────────────────────────

function LetterPicker({
  selectedLetters,
  setSelectedLetters,
  availableSource,
  accentColor,
}: {
  selectedLetters: string[];
  setSelectedLetters: (v: string[]) => void;
  availableSource: { huruf: string }[];
  accentColor: string;
}) {
  const toggle = (l: string) =>
    setSelectedLetters(
      selectedLetters.includes(l) ? selectedLetters.filter((x) => x !== l) : [...selectedLetters, l]
    );

  const selectedBgMap: Record<string, string> = {
    indigo: 'bg-indigo-600 text-white',
    violet: 'bg-violet-600 text-white',
  };
  const selectedBg = selectedBgMap[accentColor] ?? 'bg-indigo-600 text-white';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold theme-text-strong">Filter Huruf A–Z</p>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedLetters([...ALPHABET])}
            className={`text-[10px] font-semibold cursor-pointer hover:underline text-${accentColor}-600`}
          >Semua</button>
          <button
            onClick={() => setSelectedLetters([])}
            className="text-[10px] font-semibold cursor-pointer hover:underline theme-text-muted hover:text-red-500"
          >Hapus</button>
        </div>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
        {ALPHABET.map((l) => {
          const available = availableSource.some((s) => s.huruf === l);
          const sel = selectedLetters.includes(l);
          return (
            <button
              key={l}
              id={`btn-huruf-${accentColor}-${l}`}
              onClick={() => available && toggle(l)}
              disabled={!available}
              className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !available
                  ? 'theme-panel-alt text-zinc-400 cursor-not-allowed'
                  : sel
                  ? selectedBg
                  : 'theme-panel-alt theme-text-muted hover:bg-zinc-200'
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Jumlah Soal Picker ────────────────────────────────────────────────────────

function JumlahSoalPicker({
  jumlahSoal,
  setJumlahSoal,
  totalAvailable,
  accentColor,
}: {
  jumlahSoal: string;
  setJumlahSoal: (v: string) => void;
  totalAvailable: number;
  accentColor: string;
}) {
  const activeCls =
    accentColor === 'indigo'
      ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100'
      : 'bg-violet-600 text-white border-violet-600 shadow-violet-100';

  return (
    <div>
      <p className="text-xs font-semibold theme-text-strong mb-2">
        Jumlah Soal
        <span className="ml-2 font-normal theme-text-muted">({totalAvailable} tersedia)</span>
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {['5', '10', '15', 'Semua'].map((opt) => (
          <button
            key={opt}
            id={`btn-jumlah-${accentColor}-${opt}`}
            onClick={() => setJumlahSoal(opt)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
              jumlahSoal === opt ? activeCls : 'theme-panel theme-text-strong border-zinc-200 hover:border-zinc-300'
            }`}
          >
            {opt}
          </button>
        ))}
        <input
          type="number"
          min="1"
          max={totalAvailable}
          placeholder="Angka sendiri"
          value={['5', '10', '15', 'Semua'].includes(jumlahSoal) ? '' : jumlahSoal}
          onChange={(e) => setJumlahSoal(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 w-28 theme-text-strong theme-input placeholder:text-zinc-300"
        />
      </div>
    </div>
  );
}

// ─── Difficulty Picker ─────────────────────────────────────────────────────────

function DifficultyPicker({
  difficulty,
  setDifficulty,
  options,
  accentColor,
}: {
  difficulty: Difficulty;
  setDifficulty: (v: Difficulty) => void;
  options: { key: Difficulty; label: string; desc: string; emoji: string }[];
  accentColor: 'sky' | 'rose';
}) {
  const colorMap = {
    sky: {
      easy:   { sel: 'border-sky-500 bg-sky-50 text-sky-700', idle: 'border-zinc-200 hover:border-sky-300 theme-text-muted' },
      medium: { sel: 'border-indigo-500 bg-indigo-50 text-indigo-700', idle: 'border-zinc-200 hover:border-indigo-300 theme-text-muted' },
      hard:   { sel: 'border-violet-500 bg-violet-50 text-violet-700', idle: 'border-zinc-200 hover:border-violet-300 theme-text-muted' },
    },
    rose: {
      easy:   { sel: 'border-sky-500 bg-sky-50 text-sky-700', idle: 'border-zinc-200 hover:border-sky-300 theme-text-muted' },
      medium: { sel: 'border-indigo-500 bg-indigo-50 text-indigo-700', idle: 'border-zinc-200 hover:border-indigo-300 theme-text-muted' },
      hard:   { sel: 'border-rose-500 bg-rose-50 text-rose-700', idle: 'border-zinc-200 hover:border-rose-300 theme-text-muted' },
    },
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((d) => {
        const sel = difficulty === d.key;
        const cls = colorMap[accentColor][d.key];
        return (
          <button
            key={d.key}
            id={`btn-difficulty-${accentColor}-${d.key}`}
            onClick={() => setDifficulty(d.key)}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${sel ? cls.sel : cls.idle}`}
          >
            <span className="text-lg leading-none">{d.emoji}</span>
            <span>{d.label}</span>
            <span className="text-[10px] font-normal opacity-70">{d.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function KataBakuPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);

  // Settings: Membandingkan & Analisis
  const [letters_M, setLetters_M] = useState<string[]>(['A', 'B', 'C']);
  const [jumlah_M,   setJumlah_M]  = useState('10');
  const [letters_A,  setLetters_A]  = useState<string[]>(['A', 'B', 'C']);
  const [jumlah_A,   setJumlah_A]   = useState('10');

  // Settings: Detektif
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Settings: Assessment
  const [assessmentDifficulty, setAssessmentDifficulty] = useState<Difficulty>('medium');

  const available_M = useMemo(
    () => membandingkanData.filter((s) => letters_M.includes(s.huruf)).length,
    [letters_M]
  );
  const available_A = useMemo(
    () => analisisData.filter((s) => letters_A.includes(s.huruf)).length,
    [letters_A]
  );

  const canStart = selectedMode !== null && (
    (selectedMode === 'membandingkan' && letters_M.length > 0 && available_M > 0) ||
    (selectedMode === 'detektif') ||
    (selectedMode === 'analisis' && letters_A.length > 0 && available_A > 0) ||
    (selectedMode === 'assessment')
  );

  const handleStart = () => {
    if (!selectedMode) return;
    let params = '';
    if (selectedMode === 'membandingkan') {
      params = `?jumlah=${jumlah_M}&huruf=${letters_M.join(',')}`;
    } else if (selectedMode === 'detektif') {
      params = `?difficulty=${difficulty}`;
    } else if (selectedMode === 'analisis') {
      params = `?jumlah=${jumlah_A}&huruf=${letters_A.join(',')}`;
    } else if (selectedMode === 'assessment') {
      params = `?difficulty=${assessmentDifficulty}`;
    }
    router.push(`/indonesia/kata-baku/${selectedMode}${params}`);
  };

  const activeMode = MODES.find((m) => m.id === selectedMode);

  return (
    <div className="flex min-h-screen font-sans theme-app">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-stable">
          <div className="max-w-3xl mx-auto space-y-7">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs theme-text-muted">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Indonesia</span>
              <ChevronRight className="w-3 h-3" />
              <span className="theme-text-strong font-medium">Kata Baku</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold theme-text-strong">Quiz Kata Baku</h1>
              <p className="text-sm theme-text-muted mt-1">Pilih mode dan atur preferensimu, lalu langsung mulai.</p>
            </div>

            {/* ─── Mode Cards ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    id={`btn-mode-${mode.id}`}
                    onClick={() => setSelectedMode(isSelected ? null : mode.id)}
                    className={`relative text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer group overflow-hidden ${
                      isSelected
                        ? `${mode.activeBorder} ${mode.activeRing} ${mode.activeBg} shadow-md`
                        : 'theme-panel border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Top gradient strip */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${mode.gradient} ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'} transition-opacity`} />

                    <div className="flex items-start justify-between mb-3 mt-0.5">
                      <div className={`w-9 h-9 rounded-xl ${mode.iconBg} flex items-center justify-center shadow-sm ${mode.iconShadow}`}>
                        <Icon className="w-4.5 h-4.5 text-white" />
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 animate-in fade-in shrink-0" />
                      )}
                    </div>

                    <p className="text-xs font-bold theme-text-strong mb-0.5 leading-snug">{mode.label}</p>
                    <p className="text-[10px] theme-text-muted leading-relaxed hidden sm:block">{mode.shortDesc}</p>

                    <span className={`inline-block mt-2.5 text-[9px] font-semibold px-2 py-0.5 rounded-full ${mode.badgeCls}`}>
                      {mode.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ─── Settings Panel ─── */}
            {selectedMode && (
              <div className={`theme-panel border-2 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                activeMode?.activeBorder ?? 'border-zinc-200'
              }`}>
                {/* Panel header */}
                <div className={`px-6 py-4 bg-gradient-to-r ${activeMode?.gradient} flex items-center gap-3`}>
                  {activeMode && <activeMode.icon className="w-4 h-4 text-white/80" />}
                  <p className="text-sm font-bold text-white">{activeMode?.label}</p>
                  <span className="ml-auto text-xs text-white/70">Atur preferensi</span>
                </div>

                <div className="p-6 space-y-6">
                  {/* ── Membandingkan settings ── */}
                  {selectedMode === 'membandingkan' && (
                    <>
                      <JumlahSoalPicker
                        jumlahSoal={jumlah_M}
                        setJumlahSoal={setJumlah_M}
                        totalAvailable={available_M}
                        accentColor="indigo"
                      />
                      <div className="border-t border-zinc-100 pt-5">
                        <LetterPicker
                          selectedLetters={letters_M}
                          setSelectedLetters={setLetters_M}
                          availableSource={membandingkanData}
                          accentColor="indigo"
                        />
                      </div>
                    </>
                  )}

                  {/* ── Detektif settings ── */}
                  {selectedMode === 'detektif' && (
                    <div>
                      <p className="text-xs font-semibold theme-text-strong mb-3">Tingkat Kesulitan</p>
                      <DifficultyPicker
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                        options={DIFFICULTY_OPTIONS}
                        accentColor="sky"
                      />
                      <p className="text-xs theme-text-muted mt-4 leading-relaxed">
                        Baca teks, klik kata yang dicurigai tidak baku, lalu tekan <strong>Periksa</strong>.
                      </p>
                    </div>
                  )}

                  {/* ── Analisis settings ── */}
                  {selectedMode === 'analisis' && (
                    <>
                      <JumlahSoalPicker
                        jumlahSoal={jumlah_A}
                        setJumlahSoal={setJumlah_A}
                        totalAvailable={available_A}
                        accentColor="violet"
                      />
                      <div className="border-t border-zinc-100 pt-5">
                        <LetterPicker
                          selectedLetters={letters_A}
                          setSelectedLetters={setLetters_A}
                          availableSource={analisisData}
                          accentColor="violet"
                        />
                      </div>
                    </>
                  )}

                  {/* ── Assessment settings ── */}
                  {selectedMode === 'assessment' && (
                    <div>
                      <p className="text-xs font-semibold theme-text-strong mb-1">Tingkat Assessment</p>
                      <p className="text-xs theme-text-muted mb-4 leading-relaxed">
                        Assessment menggabungkan semua tipe soal — pilihan ganda, detektif teks, dan analisis kalimat — dalam satu sesi ujian komprehensif.
                      </p>
                      <DifficultyPicker
                        difficulty={assessmentDifficulty}
                        setDifficulty={setAssessmentDifficulty}
                        options={ASSESSMENT_DIFFICULTY}
                        accentColor="rose"
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                          <Scale className="w-3 h-3" /> Pilihan Ganda
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 font-medium">
                          <Search className="w-3 h-3" /> Detektif Teks
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100 font-medium">
                          <PenLine className="w-3 h-3" /> Analisis Kalimat
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Start Button ─── */}
            <button
              id="btn-mulai-quiz"
              onClick={handleStart}
              disabled={!canStart}
              className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                canStart
                  ? `bg-gradient-to-r ${activeMode?.gradient ?? 'from-indigo-600 to-violet-600'} text-white shadow-lg hover:shadow-xl hover:scale-[1.01]`
                  : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
              }`}
            >
              {selectedMode ? 'Mulai Sekarang' : 'Pilih Mode Terlebih Dahulu'}
              {canStart && <ArrowRight className="w-4 h-4" />}
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
