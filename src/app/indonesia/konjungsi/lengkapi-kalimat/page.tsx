'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { 
  lengkapiKalimatData, 
  tebakJenisData, 
  type LengkapiKalimatSoal, 
  type TebakJenisSoal,
  type KonjungsiJenis 
} from '@/shared/data/konjungsi-data';
import {
  PenLine, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight,
  HelpCircle,
} from 'lucide-react';

type Phase = 'playing' | 'results';

type TipePermainan = 'pilih-konjungsi' | 'tebak-jenis';

type GameQuestion = 
  | { type: 'pilih-konjungsi', data: LengkapiKalimatSoal }
  | { type: 'tebak-jenis', data: TebakJenisSoal };

interface UserAnswer {
  jawaban: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  questions,
  tipe,
  answers,
  setAnswers,
  onFinish,
  onBack,
}: {
  questions: GameQuestion[];
  tipe: TipePermainan;
  answers: Record<number, UserAnswer>;
  setAnswers: (v: Record<number, UserAnswer>) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);

  const q = questions[index];
  const currentAnswer = answers[index];
  const isAnswered = currentAnswer !== undefined;
  const targetJawaban = q.data.jawaban;
  const isCorrect = isAnswered && currentAnswer.jawaban === targetJawaban;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const progress = ((index + 1) / questions.length) * 100;

  const handleSelect = (pilihan: string) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [index]: { jawaban: pilihan } });
  };

  const handleNav = (dir: number) => {
    setIndex((i) => i + dir);
  };

  const badgeColors: Record<string, string> = {
    koordinatif: 'bg-indigo-100 text-indigo-700',
    subordinatif: 'bg-emerald-100 text-emerald-700',
    korelatif: 'bg-amber-100 text-amber-700',
    antarkalimat: 'bg-rose-100 text-rose-700',
    campuran: 'bg-zinc-100 text-zinc-700',
    tebak: 'bg-violet-100 text-violet-700'
  };

  const isTebak = q.type === 'tebak-jenis';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Menu
        </button>
        <span className="text-xs text-zinc-500 font-medium">{index + 1} / {questions.length}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center shadow-md shadow-cyan-200">
          {isTebak ? <HelpCircle className="w-4 h-4 text-white" /> : <PenLine className="w-4 h-4 text-white" />}
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">
            {isTebak ? 'Tebak Jenis Konjungsi' : 'Pilih Konjungsi'}
          </p>
          <p className="text-xs text-zinc-400">
            {isTebak ? 'Apa fungsi kata hubung pada kalimat di bawah?' : 'Pilih konjungsi yang tepat'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Soal Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyan-600 font-semibold uppercase tracking-wider">
            Soal {index + 1}
          </span>
          {q.type === 'pilih-konjungsi' ? (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badgeColors[q.data.jenis]}`}>
              {q.data.jenis}
            </span>
          ) : (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badgeColors['tebak']}`}>
              Tebak Fungsi
            </span>
          )}
        </div>

        <div>
          {q.type === 'pilih-konjungsi' ? (
            <p className="text-base text-zinc-800 leading-8 font-medium">
              {q.data.kalimat.split('___')[0]}
              <span className={`inline-block min-w-[80px] text-center border-b-2 mx-1 px-2 ${
                isAnswered 
                  ? isCorrect 
                    ? 'border-emerald-400 text-emerald-600' 
                    : 'border-red-400 text-red-600' 
                  : 'border-zinc-300 text-zinc-400'
              }`}>
                {isAnswered ? currentAnswer.jawaban : '...'}
              </span>
              {q.data.kalimat.split('___')[1]}
            </p>
          ) : (
            <div className="bg-cyan-50/60 border border-cyan-100 rounded-xl px-4 py-4">
              <p className="text-base text-zinc-800 leading-8 font-medium"
                dangerouslySetInnerHTML={{
                  __html: q.data.kalimat.replace(/\*\*(.*?)\*\*/g, '<span class="text-cyan-700 font-bold bg-cyan-100/50 px-1.5 py-0.5 rounded">$1</span>')
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {q.data.pilihan.map((p) => {
            const isSelected = isAnswered && currentAnswer.jawaban === p;
            const isTargetCorrect = isAnswered && p === targetJawaban;
            
            let btnCls = 'border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 hover:bg-cyan-50/40';
            
            if (isAnswered) {
              if (isTargetCorrect) {
                btnCls = 'border-emerald-400 bg-emerald-50 text-emerald-700';
              } else if (isSelected) {
                btnCls = 'border-red-400 bg-red-50 text-red-600';
              } else {
                btnCls = 'border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60';
              }
            }

            return (
              <button
                key={p}
                onClick={() => handleSelect(p)}
                disabled={isAnswered}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${btnCls}`}
              >
                {p}
                {isAnswered && isTargetCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {isAnswered && isSelected && !isTargetCorrect && <XCircle className="w-4 h-4 text-red-400" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-4 flex items-start gap-3 p-3.5 rounded-xl text-xs ${
            isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {isCorrect ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{isCorrect ? 'Benar!' : 'Belum tepat.'}</p>
              {!isCorrect && (
                <p className="mt-0.5">Jawaban yang tepat adalah <strong>&ldquo;{targetJawaban}&rdquo;</strong>.</p>
              )}
            </div>
          </div>
        )}

        {isAnswered && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleNav(-1)}
              disabled={index === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:border-cyan-300 hover:text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            {index < questions.length - 1 ? (
              <button
                onClick={() => handleNav(1)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition-all cursor-pointer"
              >
                Berikutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                disabled={!allAnswered}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Lihat Hasil <Trophy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-zinc-400">
        {Object.keys(answers).length} dari {questions.length} soal terjawab
      </p>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  questions,
  answers,
  onRestart,
  onBack,
}: {
  questions: GameQuestion[];
  answers: Record<number, UserAnswer>;
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = questions.filter((q, i) => answers[i]?.jawaban === q.data.jawaban).length;
  const pct = Math.round((correct / questions.length) * 100);
  
  const grade =
    pct >= 90 ? { label: 'Luar Biasa!', color: 'text-emerald-600' } :
    pct >= 70 ? { label: 'Bagus!', color: 'text-cyan-600' } :
    pct >= 50 ? { label: 'Lumayan', color: 'text-amber-500' } :
    { label: 'Terus Berlatih', color: 'text-red-500' };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-200">
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <p className={`text-lg font-bold mb-1 ${grade.color}`}>{grade.label}</p>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">{correct} benar dari {questions.length} soal</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-800">Review Jawaban</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
          {questions.map((q, i) => {
            const ans = answers[i];
            const ok = ans?.jawaban === q.data.jawaban;
            
            return (
              <div key={i} className="px-5 py-4 flex items-start gap-4">
                {ok
                  ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  {q.type === 'pilih-konjungsi' ? (
                    <p className="text-xs text-zinc-600 mb-1 leading-relaxed">
                      {q.data.kalimat.split('___')[0]}
                      <span className={`font-semibold ${ok ? 'text-emerald-600' : 'text-red-500 line-through'}`}>
                        {ans?.jawaban || '___'}
                      </span>
                      {q.data.kalimat.split('___')[1]}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-600 mb-1 leading-relaxed"
                       dangerouslySetInnerHTML={{
                         __html: q.data.kalimat.replace(/\*\*(.*?)\*\*/g, '<span class="text-cyan-700 font-semibold">$1</span>')
                       }}
                    />
                  )}
                  
                  {!ok && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">Benar: {q.data.jawaban}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-cyan-300 hover:text-cyan-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function LengkapiKalimatInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tipeParam = (searchParams.get('tipe') || 'pilih-konjungsi') as TipePermainan;
  const jumlahParam = searchParams.get('jumlah') ?? '10';

  const questions = useMemo(() => {
    let rawData: GameQuestion[] = [];
    if (tipeParam === 'tebak-jenis') {
      rawData = tebakJenisData.map(d => ({ type: 'tebak-jenis', data: d }));
    } else {
      rawData = lengkapiKalimatData.map(d => ({ type: 'pilih-konjungsi', data: d }));
    }
    
    const count = parseInt(jumlahParam) || 10;
    return shuffle(rawData).slice(0, Math.min(count, rawData.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<Phase>('playing');
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});

  const handleBack = () => router.push('/indonesia/konjungsi');

  return (
    <>
      <div className="max-w-xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Konjungsi</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Lengkapi Kalimat</span>
      </div>

      {phase === 'playing' && questions.length > 0 && (
        <PlayingScreen
          questions={questions}
          tipe={tipeParam}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={() => setPhase('results')}
          onBack={handleBack}
        />
      )}
      {phase === 'playing' && questions.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-zinc-500 mb-4">Tidak ada soal yang tersedia.</p>
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold cursor-pointer">
            Kembali ke Menu
          </button>
        </div>
      )}
      {phase === 'results' && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          onRestart={() => { setAnswers({}); setPhase('playing'); }}
          onBack={handleBack}
        />
      )}
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LengkapiKalimatPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat soal...</div>}>
            <LengkapiKalimatInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
