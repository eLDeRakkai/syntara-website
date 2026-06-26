'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import {
  PenLine, Search, LayoutTemplate, BookOpen, ChevronRight,
  ArrowRight, Zap, CheckCircle, ClipboardList,
} from 'lucide-react';

type ModeId = 'lengkapi-kalimat' | 'analisis-text' | 'lengkapi-text' | 'assessment';
type Difficulty = 'easy' | 'medium' | 'hard';
type TipePermainan = 'pilih-konjungsi' | 'tebak-jenis';

const MODES = [
  {
    id: 'lengkapi-kalimat' as ModeId,
    icon: PenLine,
    label: 'Lengkapi Kalimat',
    shortDesc: 'Pilih konjungsi yang tepat untuk melengkapi kalimat rumpang.',
    gradient: 'from-cyan-500 to-sky-600',
    iconBg: 'bg-cyan-600',
    iconShadow: 'shadow-cyan-200',
    accent: 'cyan',
    badge: 'Pilihan Ganda',
    badgeCls: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
    activeBorder: 'border-cyan-400',
    activeRing: 'ring-2 ring-cyan-100',
    activeBg: 'bg-cyan-50/40',
  },
  {
    id: 'analisis-text' as ModeId,
    icon: Search,
    label: 'Analisis Text',
    shortDesc: 'Temukan kalimat dengan penggunaan konjungsi yang salah dalam teks.',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-600',
    iconShadow: 'shadow-blue-200',
    accent: 'blue',
    badge: 'Identifikasi',
    badgeCls: 'bg-blue-50 text-blue-600 border border-blue-100',
    activeBorder: 'border-blue-400',
    activeRing: 'ring-2 ring-blue-100',
    activeBg: 'bg-blue-50/40',
  },
  {
    id: 'lengkapi-text' as ModeId,
    icon: LayoutTemplate,
    label: 'Lengkapi Text',
    shortDesc: 'Tarik dan letakkan konjungsi yang tepat ke dalam paragraf.',
    gradient: 'from-sky-500 to-blue-600',
    iconBg: 'bg-sky-500',
    iconShadow: 'shadow-sky-200',
    accent: 'sky',
    badge: 'Drag & Drop',
    badgeCls: 'bg-sky-50 text-sky-600 border border-sky-100',
    activeBorder: 'border-sky-400',
    activeRing: 'ring-2 ring-sky-100',
    activeBg: 'bg-sky-50/40',
  },
  {
    id: 'assessment' as ModeId,
    icon: ClipboardList,
    label: 'Assessment',
    shortDesc: 'Uji pemahamanmu dengan soal campuran semua tipe konjungsi.',
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
  { key: 'easy',   label: 'Mudah',   desc: '15 soal campuran', emoji: '🌱' },
  { key: 'medium', label: 'Sedang', desc: '25 soal campuran', emoji: '⚡' },
  { key: 'hard',   label: 'Sulit',   desc: '35 soal campuran', emoji: '🔥' },
];

const TIPE_PERMAINAN_OPTIONS: { key: TipePermainan; label: string; desc: string; emoji: string }[] = [
  { key: 'pilih-konjungsi', label: 'Pilih Konjungsi', desc: 'Isi bagian rumpang', emoji: '🧩' },
  { key: 'tebak-jenis', label: 'Tebak Jenis', desc: 'Tentukan fungsi kata', emoji: '🤔' },
];

// ─── Jumlah Soal Picker ────────────────────────────────────────────────────────

function JumlahSoalPicker({
  jumlahSoal,
  setJumlahSoal,
  accentColor,
}: {
  jumlahSoal: string;
  setJumlahSoal: (v: string) => void;
  accentColor: string;
}) {
  const activeCls = `bg-${accentColor}-600 text-white border-${accentColor}-600 shadow-${accentColor}-100`;

  return (
    <div>
      <p className="text-xs font-semibold theme-text-strong mb-2">Jumlah Soal</p>
      <div className="flex items-center gap-2 flex-wrap">
        {['5', '10', '15', '20'].map((opt) => (
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
      </div>
    </div>
  );
}

// ─── Tipe / Difficulty Picker ────────────────────────────────────────────────────

function OptionCardPicker<T extends string>({
  selected,
  setSelected,
  options,
  accentColor,
  cols = 3
}: {
  selected: T;
  setSelected: (v: T) => void;
  options: { key: T; label: string; desc: string; emoji: string }[];
  accentColor: string;
  cols?: number;
}) {
  return (
    <div className={`grid grid-cols-${cols} gap-3`}>
      {options.map((d) => {
        const sel = selected === d.key;
        let cls = 'border-zinc-200 hover:border-zinc-300 theme-text-muted';
        if (sel) {
          if (accentColor === 'cyan') cls = 'border-cyan-500 bg-cyan-50 text-cyan-700';
          else if (accentColor === 'blue') cls = 'border-blue-500 bg-blue-50 text-blue-700';
          else if (accentColor === 'sky') cls = 'border-sky-500 bg-sky-50 text-sky-700';
          else if (accentColor === 'indigo') cls = 'border-indigo-500 bg-indigo-50 text-indigo-700';
        }
        return (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${cls}`}
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

export default function KonjungsiPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);

  // Settings: Lengkapi Kalimat
  const [tipePermainanLK, setTipePermainanLK] = useState<TipePermainan>('pilih-konjungsi');
  const [jumlahSoalLK, setJumlahSoalLK] = useState('10');

  // Settings: Analisis Text & Lengkapi Text
  const [difficultyAT, setDifficultyAT] = useState<Difficulty>('medium');
  const [difficultyLT, setDifficultyLT] = useState<Difficulty>('medium');

  // Settings: Assessment
  const [assessmentDifficulty, setAssessmentDifficulty] = useState<Difficulty>('medium');

  const canStart = selectedMode !== null;

  const handleStart = () => {
    if (!selectedMode) return;
    let params = '';
    if (selectedMode === 'lengkapi-kalimat') {
      params = `?tipe=${tipePermainanLK}&jumlah=${jumlahSoalLK}`;
    } else if (selectedMode === 'analisis-text') {
      params = `?difficulty=${difficultyAT}`;
    } else if (selectedMode === 'lengkapi-text') {
      params = `?difficulty=${difficultyLT}`;
    } else if (selectedMode === 'assessment') {
      params = `?difficulty=${assessmentDifficulty}`;
    }
    router.push(`/indonesia/konjungsi/${selectedMode}${params}`);
  };

  const activeMode = MODES.find((m) => m.id === selectedMode);

  return (
    <div className="flex min-h-screen font-sans theme-app">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-7">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs theme-text-muted">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Indonesia</span>
              <ChevronRight className="w-3 h-3" />
              <span className="theme-text-strong font-medium">Konjungsi</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold theme-text-strong">Quiz Konjungsi</h1>
              <p className="text-sm theme-text-muted mt-1">Pilih mode permainan dan atur preferensimu untuk mengasah pemahaman kata hubung.</p>
            </div>

            {/* ─── Mode Cards ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
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
                  {/* ── Lengkapi Kalimat settings ── */}
                  {selectedMode === 'lengkapi-kalimat' && (
                    <>
                      <div>
                        <p className="text-xs font-semibold theme-text-strong mb-3">Tipe Permainan</p>
                        <OptionCardPicker
                          selected={tipePermainanLK}
                          setSelected={setTipePermainanLK}
                          options={TIPE_PERMAINAN_OPTIONS}
                          accentColor="cyan"
                          cols={2}
                        />
                        <p className="text-xs theme-text-muted mt-4 leading-relaxed">
                          {tipePermainanLK === 'pilih-konjungsi'
                            ? 'Pilih konjungsi yang tepat untuk melengkapi bagian rumpang pada kalimat.'
                            : 'Analisis kalimat dan tebak apa fungsi dari konjungsi yang dicetak tebal.'}
                        </p>
                      </div>
                      <div className="border-t border-zinc-100 pt-5">
                        <JumlahSoalPicker
                          jumlahSoal={jumlahSoalLK}
                          setJumlahSoal={setJumlahSoalLK}
                          accentColor="cyan"
                        />
                      </div>
                    </>
                  )}

                  {/* ── Analisis Text settings ── */}
                  {selectedMode === 'analisis-text' && (
                    <div>
                      <p className="text-xs font-semibold text-zinc-700 mb-3">Tingkat Kesulitan</p>
                      <OptionCardPicker
                        selected={difficultyAT}
                        setSelected={setDifficultyAT}
                        options={DIFFICULTY_OPTIONS}
                        accentColor="blue"
                      />
                      <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                        Baca teks dengan saksama, klik kalimat yang penggunaan konjungsinya <strong>salah</strong>, lalu tekan Periksa.
                      </p>
                    </div>
                  )}

                  {/* ── Lengkapi Text settings ── */}
                  {selectedMode === 'lengkapi-text' && (
                    <div>
                      <p className="text-xs font-semibold text-zinc-700 mb-3">Tingkat Kesulitan</p>
                      <OptionCardPicker
                        selected={difficultyLT}
                        setSelected={setDifficultyLT}
                        options={DIFFICULTY_OPTIONS}
                        accentColor="sky"
                      />
                      <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                        Tarik kata hubung yang tepat dari kotak pilihan ke dalam area rumpang di teks.
                      </p>
                    </div>
                  )}

                  {/* ── Assessment settings ── */}
                  {selectedMode === 'assessment' && (
                    <div>
                      <p className="text-xs font-semibold theme-text-strong mb-1">Tingkat Assessment</p>
                      <p className="text-xs theme-text-muted mb-4 leading-relaxed">
                        Assessment menggabungkan semua tipe soal dalam satu sesi ujian komprehensif.
                      </p>
                      <OptionCardPicker
                        selected={assessmentDifficulty}
                        setSelected={setAssessmentDifficulty}
                        options={ASSESSMENT_DIFFICULTY}
                        accentColor="indigo"
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 font-medium">
                          <PenLine className="w-3 h-3" /> Lengkapi Kalimat
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                          <Search className="w-3 h-3" /> Analisis Text
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 font-medium">
                          <LayoutTemplate className="w-3 h-3" /> Lengkapi Text
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Start Button ─── */}
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                canStart
                  ? `bg-gradient-to-r ${activeMode?.gradient ?? 'from-blue-600 to-indigo-600'} text-white shadow-lg hover:shadow-xl hover:scale-[1.01]`
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
