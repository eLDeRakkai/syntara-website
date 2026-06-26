'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { analisisTextData, type AnalisisTextSoal } from '@/shared/data/konjungsi-data';
import {
  Search, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, Trophy, ArrowLeft, XCircle
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

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  soal,
  difficulty,
  onFinish,
  onBack,
}: {
  soal: AnalisisTextSoal;
  difficulty: Difficulty;
  onFinish: (selected: { pIdx: number; cIdx: number }[]) => void;
  onBack: () => void;
}) {
  const paragrafToShow = soal.paragraf.slice(0, PARAGRAF_COUNT[difficulty]);
  const [selected, setSelected] = useState<{ pIdx: number; cIdx: number }[]>([]);
  const [checked, setChecked] = useState(false);

  const toggleSentence = (pIdx: number, cIdx: number) => {
    if (checked) return;
    setSelected((prev) => {
      const exists = prev.find((s) => s.pIdx === pIdx && s.cIdx === cIdx);
      if (exists) {
        return prev.filter((s) => !(s.pIdx === pIdx && s.cIdx === cIdx));
      }
      return [...prev, { pIdx, cIdx }];
    });
  };

  const getSentenceState = (pIdx: number, cIdx: number) => {
    const sData = paragrafToShow[pIdx][cIdx];
    const isAnswer = sData.salah;
    const isSel = selected.some((s) => s.pIdx === pIdx && s.cIdx === cIdx);
    
    if (!checked) return isSel ? 'selected' : 'normal';
    if (isAnswer && isSel) return 'correct';
    if (isAnswer && !isSel) return 'missed';
    if (!isAnswer && isSel) return 'wrong';
    return 'normal';
  };

  const sentenceStyle: Record<string, string> = {
    normal:   'text-zinc-700 cursor-pointer hover:bg-blue-50/50 hover:text-blue-700 rounded transition-colors',
    selected: 'bg-blue-100 text-blue-800 rounded cursor-pointer font-medium',
    correct:  'bg-emerald-100 text-emerald-800 rounded font-semibold',
    missed:   'bg-red-100 text-red-600 rounded font-medium underline decoration-red-400 decoration-wavy underline-offset-4',
    wrong:    'bg-zinc-100 text-zinc-500 rounded line-through opacity-70',
  };

  const totalWrongSentences = useMemo(() => {
    let count = 0;
    paragrafToShow.forEach((p) => {
      p.forEach((s) => { if (s.salah) count++; });
    });
    return count;
  }, [paragrafToShow]);

  const correctCount = checked
    ? selected.filter((s) => paragrafToShow[s.pIdx][s.cIdx].salah).length
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
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Analisis Text</p>
          <p className="text-xs text-zinc-400">Pilih kalimat dengan konjungsi yang salah</p>
        </div>
      </div>

      {/* Text card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7">
        <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{soal.judul}</p>
        <p className="text-xs text-zinc-400 mb-5">
          Klik kalimat yang penggunaan konjungsinya <strong>salah/tidak tepat</strong>.
          {selected.length > 0 && !checked && (
            <span className="ml-2 text-blue-600 font-semibold">{selected.length} kalimat dipilih</span>
          )}
        </p>
        
        <div className="space-y-4">
          {paragrafToShow.map((par, pi) => (
            <p key={pi} className="text-sm leading-8">
              {par.map((sent, ci) => {
                const state = getSentenceState(pi, ci);
                return (
                  <React.Fragment key={ci}>
                    <span
                      className={`inline transition-all duration-150 px-1 py-0.5 ${sentenceStyle[state]}`}
                      onClick={() => toggleSentence(pi, ci)}
                    >
                      {sent.kalimat}
                    </span>{' '}
                  </React.Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {checked && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-sm font-semibold text-zinc-800">
              {correctCount} dari {totalWrongSentences} kesalahan ditemukan
            </p>
          </div>
          
          <div className="space-y-3">
            {paragrafToShow.flatMap((p, pi) => 
              p.map((s, ci) => ({ s, pi, ci }))
            ).filter(({ s, pi, ci }) => 
              s.salah || selected.some(sel => sel.pIdx === pi && sel.cIdx === ci)
            ).map(({ s, pi, ci }, idx) => {
              const isSel = selected.some(sel => sel.pIdx === pi && sel.cIdx === ci);
              const isAnswer = s.salah;
              
              let icon = <XCircle className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />;
              let cls = '';
              let label = '';
              
              if (isAnswer && isSel) {
                icon = <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
                cls = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                label = 'Benar ditebak';
              } else if (isAnswer && !isSel) {
                icon = <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
                cls = 'bg-red-50 text-red-800 border-red-100';
                label = 'Terlewat';
              } else if (!isAnswer && isSel) {
                icon = <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
                cls = 'bg-amber-50 text-amber-800 border-amber-100';
                label = 'Salah pilih';
              }
              
              return (
                <div key={idx} className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${cls}`}>
                  {icon}
                  <div>
                    <p className="font-semibold mb-1 opacity-80">{label}</p>
                    <p className="mb-1">"{s.kalimat}"</p>
                    {s.salah && s.koreksi && (
                      <p className="text-emerald-700 font-medium">Seharusnya menggunakan konjungsi: "{s.koreksi}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={selected.length === 0}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            onClick={() => onFinish(selected)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
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
  soal: AnalisisTextSoal;
  selected: { pIdx: number; cIdx: number }[];
  difficulty: Difficulty;
  onRestart: () => void;
  onBack: () => void;
}) {
  const paragrafToShow = soal.paragraf.slice(0, PARAGRAF_COUNT[difficulty]);
  
  const totalWrongSentences = useMemo(() => {
    let count = 0;
    paragrafToShow.forEach((p) => {
      p.forEach((s) => { if (s.salah) count++; });
    });
    return count;
  }, [paragrafToShow]);

  const correct = selected.filter((s) => paragrafToShow[s.pIdx]?.[s.cIdx]?.salah).length;
  // Penalty for selecting wrong sentences? For simplicity, we just look at correctly identified ones.
  // But if they selected everything, score should be low. Let's do a simple formula:
  const falsePositives = selected.length - correct;
  const netScore = Math.max(0, correct - (falsePositives * 0.5));
  const pct = Math.round((netScore / totalWrongSentences) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">
          {correct} dari {totalWrongSentences} kesalahan ditemukan
        </p>
        {falsePositives > 0 && (
          <p className="text-xs text-amber-500 mt-1">
            {falsePositives} kalimat benar malah disalahkan (mengurangi nilai)
          </p>
        )}
      </div>
      
      <div className="flex gap-3">
        <button onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function AnalisisTextInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as Difficulty;

  const soal: AnalisisTextSoal = useMemo(() => {
    const valid = analisisTextData;
    return valid[Math.floor(Math.random() * valid.length)] ?? analisisTextData[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<Phase>('playing');
  const [finalSelected, setFinalSelected] = useState<{ pIdx: number; cIdx: number }[]>([]);

  const handleBack = () => router.push('/indonesia/konjungsi');

  return (
    <>
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Konjungsi</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Analisis Text</span>
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

export default function AnalisisTextPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat teks...</div>}>
            <AnalisisTextInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
