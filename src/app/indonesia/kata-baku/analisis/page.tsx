'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { analisisData, type AnalisisSoal } from '@/shared/data/kata-baku-data';
import {
  PenLine, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight,
} from 'lucide-react';

type Phase = 'playing' | 'results';

interface UserAnswer {
  kataBenar: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderKalimat(kalimat: string) {
  return (
    <p className="text-base text-zinc-800 leading-8">{kalimat}</p>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  soalList,
  answers,
  setAnswers,
  onFinish,
  onBack,
}: {
  soalList: AnalisisSoal[];
  answers: Record<number, UserAnswer>;
  setAnswers: (v: Record<number, UserAnswer>) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const soal = soalList[index];
  const currentAnswer = answers[soal.id];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered &&
    currentAnswer.kataBenar.trim().toLowerCase() === soal.kataBenar.toLowerCase();
  const allAnswered = soalList.every((s) => answers[s.id] !== undefined);
  const progress = ((index + 1) / soalList.length) * 100;

  const handleSubmit = () => {
    if (isAnswered || inputValue.trim() === '') return;
    setAnswers({ ...answers, [soal.id]: { kataBenar: inputValue } });
  };

  const handleNav = (dir: number) => {
    setIndex((i) => i + dir);
    setInputValue('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Menu
        </button>
        <span className="text-xs text-zinc-500 font-medium">{index + 1} / {soalList.length}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
          <PenLine className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Analisis Kalimat</p>
          <p className="text-xs text-zinc-400">Temukan kata salah, tuliskan yang baku</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Soal Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7 space-y-5">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
          Soal {index + 1} — Huruf {soal.huruf}
        </p>

        <div>
          <p className="text-xs text-zinc-400 mb-3">
            Baca kalimat dengan teliti, temukan kata yang tidak baku, lalu tuliskan bentuk bakunya.
          </p>
          {renderKalimat(soal.kalimat)}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-2">
            Tuliskan bentuk baku yang benar:
          </label>
          <input
            id={`input-jawaban-${soal.id}`}
            type="text"
            value={isAnswered ? currentAnswer.kataBenar : inputValue}
            onChange={(e) => !isAnswered && setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={isAnswered}
            placeholder="Ketik kata baku di sini..."
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
              isAnswered
                ? isCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-200'
                  : 'border-red-400 bg-red-50 text-red-600 focus:ring-red-200'
                : 'border-zinc-200 bg-white text-zinc-800 focus:ring-amber-300'
            }`}
          />
        </div>

        {isAnswered && (
          <div className={`flex items-start gap-3 p-3.5 rounded-xl text-xs ${
            isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {isCorrect ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{isCorrect ? 'Benar!' : 'Belum tepat.'}</p>
              {!isCorrect && (
                <p className="mt-0.5">Kata baku yang benar adalah <strong>&ldquo;{soal.kataBenar}&rdquo;</strong>.</p>
              )}
            </div>
          </div>
        )}

        {!isAnswered ? (
          <button
            id="btn-submit-analisis"
            onClick={handleSubmit}
            disabled={inputValue.trim() === ''}
            className="w-full py-3 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Periksa Jawaban
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleNav(-1)}
              disabled={index === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:border-amber-300 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            {index < soalList.length - 1 ? (
              <button
                id="btn-next-analisis"
                onClick={() => handleNav(1)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-all cursor-pointer"
              >
                Berikutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-selesai-analisis"
                onClick={onFinish}
                disabled={!allAnswered}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Lihat Hasil <Trophy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-zinc-400">
        {Object.keys(answers).length} dari {soalList.length} soal terjawab
      </p>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  soalList,
  answers,
  onRestart,
  onBack,
}: {
  soalList: AnalisisSoal[];
  answers: Record<number, UserAnswer>;
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = soalList.filter(
    (s) => answers[s.id]?.kataBenar.trim().toLowerCase() === s.kataBenar.toLowerCase()
  ).length;
  const pct = Math.round((correct / soalList.length) * 100);
  const grade =
    pct >= 90 ? { label: 'Luar Biasa!', color: 'text-emerald-600' } :
    pct >= 70 ? { label: 'Bagus!', color: 'text-amber-600' } :
    pct >= 50 ? { label: 'Lumayan', color: 'text-orange-500' } :
    { label: 'Terus Berlatih', color: 'text-red-500' };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
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
            const ans = answers[soal.id];
            const ok = ans?.kataBenar.trim().toLowerCase() === soal.kataBenar.toLowerCase();
            return (
              <div key={soal.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 mb-0.5 truncate">{soal.kataSalah} → ?</p>
                  <p className="text-xs text-zinc-700">
                    Jawabanmu:{' '}
                    <strong className={ok ? 'text-emerald-600' : 'text-red-500'}>
                      {ans?.kataBenar || '—'}
                    </strong>
                    {!ok && <span className="text-zinc-400"> (benar: <strong>{soal.kataBenar}</strong>)</span>}
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
        <button id="btn-ulangi-analisis" onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-amber-300 hover:text-amber-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button id="btn-back-menu-analisis" onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function AnalisisInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hurufParam  = searchParams.get('huruf')  ?? 'A,B,C';
  const jumlahParam = searchParams.get('jumlah') ?? '10';

  const soalList = useMemo(() => {
    const letters = hurufParam.split(',').filter(Boolean);
    const filtered = analisisData.filter((s) => letters.includes(s.huruf));
    const count = jumlahParam === 'Semua' ? filtered.length : parseInt(jumlahParam) || filtered.length;
    return shuffle(filtered).slice(0, Math.min(count, filtered.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<Phase>('playing');
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});

  const handleBack = () => router.push('/indonesia/kata-baku');

  return (
    <>
      <div className="max-w-xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Kata Baku</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Analisis Kalimat</span>
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
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold cursor-pointer">
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

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalisisPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat soal...</div>}>
            <AnalisisInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
