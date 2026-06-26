'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { detektifData, type DetektifSoal } from '@/shared/data/kata-baku-data';
import {
  Search, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, Trophy, ArrowLeft,
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'playing' | 'results';

const PARAGRAF_COUNT: Record<Difficulty, number> = { easy: 2, medium: 3, hard: 4 };

const DIFF_LABEL: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFF_CLS: Record<Difficulty, string> = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard:   'bg-red-100 text-red-700',
};

// ─── Tokenizer ────────────────────────────────────────────────────────────────

function tokenize(text: string): { word: string; punctuation: string }[] {
  const regex = /([A-Za-zÀ-ÿ']+)([^A-Za-zÀ-ÿ']*)/g;
  const tokens: { word: string; punctuation: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    tokens.push({ word: m[1], punctuation: m[2] });
  }
  return tokens;
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  soal,
  difficulty,
  onFinish,
  onBack,
}: {
  soal: DetektifSoal;
  difficulty: Difficulty;
  onFinish: (selected: string[]) => void;
  onBack: () => void;
}) {
  const paragrafToShow = soal.paragraf.slice(0, PARAGRAF_COUNT[difficulty]);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const toggleWord = (word: string) => {
    if (checked) return;
    setSelected((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const getWordState = (word: string) => {
    const clean = word.replace(/[^A-Za-zÀ-ÿ']/g, '');
    const isAnswer = soal.kataJawaban.some((j) => j.toLowerCase() === clean.toLowerCase());
    const isSel = selected.some((s) => s.toLowerCase() === clean.toLowerCase());
    if (!checked) return isSel ? 'selected' : 'normal';
    if (isAnswer && isSel) return 'correct';
    if (isAnswer && !isSel) return 'missed';
    if (!isAnswer && isSel) return 'wrong';
    return 'normal';
  };

  const wordStyle: Record<string, string> = {
    normal:   'text-zinc-700 cursor-pointer hover:text-emerald-600 hover:underline decoration-dashed underline-offset-2',
    selected: 'bg-amber-100 text-amber-800 px-1 rounded cursor-pointer underline decoration-amber-400',
    correct:  'bg-emerald-100 text-emerald-700 px-1 rounded font-semibold',
    missed:   'bg-red-100 text-red-500 px-1 rounded underline decoration-red-400',
    wrong:    'bg-zinc-100 text-zinc-400 px-1 rounded line-through',
  };

  const correctCount = checked
    ? selected.filter((s) => soal.kataJawaban.some((j) => j.toLowerCase() === s.toLowerCase())).length
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Menu
        </button>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFF_CLS[difficulty]}`}>
          {DIFF_LABEL[difficulty]}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Detektif Kata</p>
          <p className="text-xs text-zinc-400">Klik kata yang tidak baku dalam teks</p>
        </div>
      </div>

      {/* Text card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7">
        <p className="text-xs text-emerald-600 font-semibold mb-1 uppercase tracking-wider">{soal.judul}</p>
        <p className="text-xs text-zinc-400 mb-5">
          Klik kata yang kamu curigai <strong>tidak baku</strong>.
          {selected.length > 0 && !checked && (
            <span className="ml-2 text-amber-600 font-semibold">{selected.length} kata dipilih</span>
          )}
        </p>
        <div className="space-y-4">
          {paragrafToShow.map((par, pi) => {
            const tokens = tokenize(par);
            return (
              <p key={pi} className="text-sm text-zinc-700 leading-7">
                {tokens.map((tok, ti) => {
                  const state = getWordState(tok.word);
                  return (
                    <span key={ti}>
                      <span
                        className={`transition-all duration-150 ${wordStyle[state]}`}
                        onClick={() => toggleWord(tok.word)}
                      >
                        {tok.word}
                      </span>
                      <span>{tok.punctuation}</span>
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {checked && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-sm font-semibold text-zinc-800">
              {correctCount} dari {soal.kataJawaban.length} kata tidak baku ditemukan
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Kata tidak baku: <strong className="text-red-500">{soal.kataJawaban.join(', ')}</strong>
          </p>
          <div className="flex gap-2 text-[11px] mt-2">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">🟢 Benar</span>
            <span className="px-2 py-1 bg-red-100 text-red-500 rounded-lg">🔴 Terlewat</span>
            <span className="px-2 py-1 bg-zinc-100 text-zinc-400 rounded-lg">⚫ Salah pilih</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            id="btn-periksa-detektif"
            onClick={() => setChecked(true)}
            disabled={selected.length === 0}
            className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            id="btn-selesai-detektif"
            onClick={() => onFinish(selected)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            Lihat Hasil <Trophy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  soal,
  selected,
  difficulty,
  onRestart,
  onBack,
}: {
  soal: DetektifSoal;
  selected: string[];
  difficulty: Difficulty;
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = selected.filter((s) =>
    soal.kataJawaban.some((j) => j.toLowerCase() === s.toLowerCase())
  ).length;
  const pct = Math.round((correct / soal.kataJawaban.length) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">
          {correct} dari {soal.kataJawaban.length} kata tidak baku ditemukan
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {soal.kataJawaban.map((k) => {
            const found = selected.some((s) => s.toLowerCase() === k.toLowerCase());
            return (
              <span key={k} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${found ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'}`}>
                {found ? '✓' : '✗'} {k}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3">
        <button id="btn-ulangi-detektif" onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-emerald-300 hover:text-emerald-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button id="btn-back-menu-detektif" onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function DetektifInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as Difficulty;

  const soal: DetektifSoal = useMemo(() => {
    const needed = PARAGRAF_COUNT[difficulty];
    const valid = detektifData.filter((s) => s.paragraf.length >= needed);
    return valid[Math.floor(Math.random() * valid.length)] ?? detektifData[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<Phase>('playing');
  const [finalSelected, setFinalSelected] = useState<string[]>([]);

  const handleBack = () => router.push('/indonesia/kata-baku');

  return (
    <>
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Kata Baku</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Detektif Kata</span>
      </div>
      {phase === 'playing' && (
        <PlayingScreen
          soal={soal}
          difficulty={difficulty}
          onFinish={(sel) => { setFinalSelected(sel); setPhase('results'); }}
          onBack={handleBack}
        />
      )}
      {phase === 'results' && (
        <ResultsScreen
          soal={soal}
          selected={finalSelected}
          difficulty={difficulty}
          onRestart={() => { setFinalSelected([]); setPhase('playing'); }}
          onBack={handleBack}
        />
      )}
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DetektifPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat teks...</div>}>
            <DetektifInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
