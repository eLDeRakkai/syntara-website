'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { membandingkanData, type MembandingkanSoal } from '@/shared/data/kata-baku-data';
import {
  Scale, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight,
} from 'lucide-react';

type Phase = 'playing' | 'results';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Playing Screen ──────────────────────────────────────────────────────────

function PlayingScreen({
  soalList,
  answers,
  setAnswers,
  onFinish,
  onBack,
}: {
  soalList: MembandingkanSoal[];
  answers: Record<number, string>;
  setAnswers: (v: Record<number, string>) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const soal = soalList[index];
  const answered = answers[soal.id] !== undefined;
  const isCorrect = answers[soal.id] === soal.jawabanBaku;
  const allAnswered = soalList.every((s) => answers[s.id] !== undefined);
  const progress = ((index + 1) / soalList.length) * 100;

  const choose = (kata: string) => {
    if (answered) return;
    setAnswers({ ...answers, [soal.id]: kata });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Menu
        </button>
        <span className="text-xs text-zinc-500 font-medium">{index + 1} / {soalList.length}</span>
      </div>

      {/* Header info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Membandingkan Kata</p>
          <p className="text-xs text-zinc-400">Pilih kata yang baku</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Soal card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
        <p className="text-xs text-indigo-600 font-semibold mb-2 uppercase tracking-wider">
          Soal {index + 1} — Huruf {soal.huruf}
        </p>
        <h2 className="text-lg font-bold text-zinc-800 mb-6">
          Manakah kata yang <span className="text-indigo-600">baku</span>?
        </h2>

        <div className="space-y-3">
          {soal.pilihan.map((kata) => {
            const isChosen = answers[soal.id] === kata;
            const isAnswer = kata === soal.jawabanBaku;
            let style = 'border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50';
            if (answered) {
              if (isAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold';
              else if (isChosen) style = 'border-red-400 bg-red-50 text-red-600';
              else style = 'border-zinc-100 bg-zinc-50 text-zinc-400';
            }
            return (
              <button
                key={kata}
                id={`btn-pilih-${kata}`}
                onClick={() => choose(kata)}
                className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${style}`}
              >
                <span>{kata}</span>
                {answered && isAnswer && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {answered && isChosen && !isAnswer && <XCircle className="w-4 h-4 text-red-400" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`mt-5 p-3 rounded-xl text-xs font-medium ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {isCorrect
              ? '✓ Benar! Jawaban kamu tepat.'
              : `✗ Salah. Kata baku yang benar adalah "${soal.jawabanBaku}".`}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <button
          id="btn-prev-soal"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
        </button>
        {index < soalList.length - 1 ? (
          <button
            id="btn-next-soal"
            onClick={() => setIndex((i) => i + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer"
          >
            Berikutnya <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id="btn-selesai-membandingkan"
            onClick={onFinish}
            disabled={!allAnswered}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Lihat Hasil <Trophy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-zinc-400">
        {Object.keys(answers).length} dari {soalList.length} soal terjawab
      </p>
    </div>
  );
}

// ─── Results Screen ──────────────────────────────────────────────────────────

function ResultsScreen({
  soalList,
  answers,
  onRestart,
  onBack,
}: {
  soalList: MembandingkanSoal[];
  answers: Record<number, string>;
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = soalList.filter((s) => answers[s.id] === s.jawabanBaku).length;
  const pct = Math.round((correct / soalList.length) * 100);
  const grade =
    pct >= 90 ? { label: 'Sempurna!', color: 'text-emerald-600' } :
    pct >= 70 ? { label: 'Bagus!', color: 'text-indigo-600' } :
    pct >= 50 ? { label: 'Cukup Baik', color: 'text-amber-600' } :
    { label: 'Perlu Latihan', color: 'text-red-500' };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <p className={`text-lg font-bold mb-1 ${grade.color}`}>{grade.label}</p>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">{correct} benar dari {soalList.length} soal</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-800">Review Jawaban</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
          {soalList.map((soal) => {
            const ok = answers[soal.id] === soal.jawabanBaku;
            return (
              <div key={soal.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 mb-0.5">Huruf {soal.huruf}</p>
                  <p className="text-xs text-zinc-700">
                    Jawabanmu: <strong>{answers[soal.id] || '—'}</strong>
                    {!ok && <span className="text-emerald-600"> → {soal.jawabanBaku}</span>}
                  </p>
                </div>
                {ok
                  ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          id="btn-ulangi-membandingkan"
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button
          id="btn-back-menu-membandingkan"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner component (needs useSearchParams) ─────────────────────────────────

function MembandingkanInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hurufParam  = searchParams.get('huruf') ?? 'A,B,C';
  const jumlahParam = searchParams.get('jumlah') ?? '10';

  const [phase, setPhase] = useState<Phase>('playing');
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const soalList = useMemo(() => {
    const letters = hurufParam.split(',').filter(Boolean);
    const filtered = membandingkanData.filter((s) => letters.includes(s.huruf));
    const count = jumlahParam === 'Semua' ? filtered.length : parseInt(jumlahParam) || filtered.length;
    return shuffle(filtered).slice(0, Math.min(count, filtered.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Only run once on mount (params won't change during game)

  useEffect(() => {
    setAnswers({});
    setPhase('playing');
  }, []);

  const handleBack = () => router.push('/indonesia/kata-baku');

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Kata Baku</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Membandingkan Kata</span>
      </div>

      {phase === 'playing' && soalList.length > 0 && (
        <PlayingScreen
          soalList={soalList}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={() => setPhase('results')}
          onBack={handleBack}
        />
      )}
      {phase === 'playing' && soalList.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-zinc-500 mb-4">Tidak ada soal yang sesuai filter.</p>
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold cursor-pointer">
            Kembali ke Menu
          </button>
        </div>
      )}
      {phase === 'results' && (
        <ResultsScreen
          soalList={soalList}
          answers={answers}
          onRestart={() => { setAnswers({}); setPhase('playing'); }}
          onBack={handleBack}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MembandingkanPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat soal...</div>}>
            <MembandingkanInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
