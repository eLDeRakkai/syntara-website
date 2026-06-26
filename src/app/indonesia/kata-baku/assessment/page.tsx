'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import {
  membandingkanData, analisisData, detektifData,
  type MembandingkanSoal, type AnalisisSoal,
} from '@/shared/data/kata-baku-data';
import {
  ClipboardList, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight,
  Scale, Search, PenLine,
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'playing' | 'results';

// Assessment soal count per difficulty
const SOAL_COUNT: Record<Difficulty, number> = { easy: 10, medium: 20, hard: 30 };

// ─── Unified Question Type ────────────────────────────────────────────────────

type AssessmentQuestion =
  | { type: 'membandingkan'; data: MembandingkanSoal }
  | { type: 'analisis'; data: AnalisisSoal }
  | { type: 'detektif_word'; data: { id: number; kalimat: string; kataJawaban: string; huruf: string } };

type UserAnswer =
  | { type: 'membandingkan'; jawaban: string }
  | { type: 'analisis'; jawaban: string }
  | { type: 'detektif_word'; jawaban: string };

function isCorrect(q: AssessmentQuestion, a: UserAnswer): boolean {
  if (q.type === 'membandingkan' && a.type === 'membandingkan') {
    return a.jawaban.toLowerCase() === q.data.jawabanBaku.toLowerCase();
  }
  if (q.type === 'analisis' && a.type === 'analisis') {
    return a.jawaban.trim().toLowerCase() === q.data.kataBenar.toLowerCase();
  }
  if (q.type === 'detektif_word' && a.type === 'detektif_word') {
    return a.jawaban.toLowerCase() === q.data.kataJawaban.toLowerCase();
  }
  return false;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Question Type Labels ─────────────────────────────────────────────────────

const TYPE_META = {
  membandingkan: { label: 'Pilihan Ganda', icon: Scale, cls: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  analisis:      { label: 'Analisis Kalimat', icon: PenLine, cls: 'bg-violet-50 text-violet-600 border-violet-100' },
  detektif_word: { label: 'Detektif Kata', icon: Search, cls: 'bg-sky-50 text-sky-600 border-sky-100' },
};

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  questions,
  answers,
  setAnswers,
  onFinish,
  onBack,
}: {
  questions: AssessmentQuestion[];
  answers: Record<number, UserAnswer>;
  setAnswers: (v: Record<number, UserAnswer>) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [textInput, setTextInput] = useState('');

  const q = questions[index];
  const currentAnswer = answers[index];
  const isAnswered = currentAnswer !== undefined;
  const answered_correct = isAnswered && isCorrect(q, currentAnswer);
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const progress = ((index + 1) / questions.length) * 100;

  const typeMeta = TYPE_META[q.type];
  const TypeIcon = typeMeta.icon;

  const handleSubmitMembandingkan = (jawaban: string) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [index]: { type: 'membandingkan', jawaban } });
  };

  const handleSubmitText = () => {
    if (isAnswered || textInput.trim() === '') return;
    if (q.type === 'analisis') {
      setAnswers({ ...answers, [index]: { type: 'analisis', jawaban: textInput } });
    } else if (q.type === 'detektif_word') {
      setAnswers({ ...answers, [index]: { type: 'detektif_word', jawaban: textInput } });
    }
  };

  const handleNav = (dir: number) => {
    setIndex((i) => i + dir);
    setTextInput('');
  };

  const correctAnswer =
    q.type === 'membandingkan' ? q.data.jawabanBaku :
    q.type === 'analisis' ? q.data.kataBenar :
    q.data.kataJawaban;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Menu
        </button>
        <span className="text-xs text-zinc-500 font-medium">{index + 1} / {questions.length}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center shadow-md shadow-rose-200">
          <ClipboardList className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Assessment</p>
          <p className="text-xs text-zinc-400">Uji kemampuan komprehensif kata baku</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7 space-y-5">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${typeMeta.cls}`}>
            <TypeIcon className="w-3 h-3" />
            {typeMeta.label}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Soal {index + 1}</span>
        </div>

        {/* ── Membandingkan Kata ── */}
        {q.type === 'membandingkan' && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-zinc-800">Manakah kata yang <span className="text-indigo-600">baku</span>?</p>
            <div className="grid grid-cols-1 gap-2.5">
              {q.data.pilihan.map((p) => {
                const sel = isAnswered && (currentAnswer as { jawaban: string }).jawaban === p;
                const correct = p.toLowerCase() === q.data.jawabanBaku.toLowerCase();
                const cls = isAnswered
                  ? correct
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : sel
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                  : sel
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50/40';
                return (
                  <button
                    key={p}
                    onClick={() => handleSubmitMembandingkan(p)}
                    disabled={isAnswered}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all cursor-pointer ${cls}`}
                  >
                    {p}
                    {isAnswered && correct && <CheckCircle className="w-4 h-4 inline ml-2 text-emerald-500" />}
                    {isAnswered && sel && !correct && <XCircle className="w-4 h-4 inline ml-2 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Detektif Kata (word-level) ── */}
        {q.type === 'detektif_word' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-400 mb-3">Temukan kata yang <span className="font-semibold text-sky-600">tidak baku</span> dalam kalimat ini:</p>
              <div className="bg-sky-50/60 border border-sky-100 rounded-xl px-4 py-3">
                <p className="text-sm text-zinc-800 leading-7 font-medium">{q.data.kalimat}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-2">
                Tulis kata yang tidak baku:
              </label>
              <input
                type="text"
                value={isAnswered ? (currentAnswer as { jawaban: string }).jawaban : textInput}
                onChange={(e) => !isAnswered && setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitText()}
                disabled={isAnswered}
                placeholder="Ketik kata tidak baku..."
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  isAnswered
                    ? answered_correct
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-200'
                      : 'border-red-400 bg-red-50 text-red-600 focus:ring-red-200'
                    : 'border-zinc-200 bg-white text-zinc-800 focus:ring-sky-300'
                }`}
              />
            </div>
          </div>
        )}

        {/* ── Analisis Kalimat ── */}
        {q.type === 'analisis' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-400 mb-3">Temukan kata tidak baku dalam kalimat, lalu tulis bentuk <span className="font-semibold text-violet-600">bakunya</span>:</p>
              <div className="bg-violet-50/60 border border-violet-100 rounded-xl px-4 py-3">
                <p className="text-base text-zinc-800 leading-8">{q.data.kalimat}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-2">
                Tuliskan bentuk baku yang benar:
              </label>
              <input
                type="text"
                value={isAnswered ? (currentAnswer as { jawaban: string }).jawaban : textInput}
                onChange={(e) => !isAnswered && setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitText()}
                disabled={isAnswered}
                placeholder="Ketik kata baku di sini..."
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  isAnswered
                    ? answered_correct
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-200'
                      : 'border-red-400 bg-red-50 text-red-600 focus:ring-red-200'
                    : 'border-zinc-200 bg-white text-zinc-800 focus:ring-violet-300'
                }`}
              />
            </div>
          </div>
        )}

        {/* Feedback */}
        {isAnswered && (
          <div className={`flex items-start gap-3 p-3.5 rounded-xl text-xs ${
            answered_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {answered_correct ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{answered_correct ? 'Benar!' : 'Belum tepat.'}</p>
              {!answered_correct && (
                <p className="mt-0.5">Jawaban yang benar: <strong>&ldquo;{correctAnswer}&rdquo;</strong>.</p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!isAnswered && q.type !== 'membandingkan' ? (
          <button
            id="btn-submit-assessment"
            onClick={handleSubmitText}
            disabled={textInput.trim() === ''}
            className="w-full py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Periksa Jawaban
          </button>
        ) : isAnswered ? (
          <div className="flex gap-3">
            <button
              onClick={() => handleNav(-1)}
              disabled={index === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            {index < questions.length - 1 ? (
              <button
                id="btn-next-assessment"
                onClick={() => handleNav(1)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-all cursor-pointer"
              >
                Berikutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-selesai-assessment"
                onClick={onFinish}
                disabled={!allAnswered}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Lihat Hasil <Trophy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : null}
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
  difficulty,
  onRestart,
  onBack,
}: {
  questions: AssessmentQuestion[];
  answers: Record<number, UserAnswer>;
  difficulty: Difficulty;
  onRestart: () => void;
  onBack: () => void;
}) {
  const correctCount = questions.filter((q, i) => answers[i] && isCorrect(q, answers[i])).length;
  const pct = Math.round((correctCount / questions.length) * 100);

  const grade =
    pct >= 90 ? { label: 'Luar Biasa!', color: 'text-emerald-600', bg: 'from-emerald-400 to-teal-500' } :
    pct >= 75 ? { label: 'Bagus!', color: 'text-indigo-600', bg: 'from-indigo-500 to-violet-600' } :
    pct >= 55 ? { label: 'Cukup Baik', color: 'text-sky-600', bg: 'from-sky-500 to-cyan-600' } :
    { label: 'Terus Berlatih', color: 'text-rose-600', bg: 'from-rose-500 to-pink-600' };

  // Stats by type
  const byType = {
    membandingkan: { total: 0, correct: 0 },
    analisis: { total: 0, correct: 0 },
    detektif_word: { total: 0, correct: 0 },
  };
  questions.forEach((q, i) => {
    byType[q.type].total++;
    if (answers[i] && isCorrect(q, answers[i])) byType[q.type].correct++;
  });

  const diffLabel = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }[difficulty];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Score card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${grade.bg} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 mb-3">
          Assessment · {diffLabel}
        </span>
        <p className={`text-lg font-bold mb-1 ${grade.color}`}>{grade.label}</p>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">{correctCount} benar dari {questions.length} soal</p>
      </div>

      {/* Per-type breakdown */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-zinc-800 mb-4">Rincian per Tipe Soal</h3>
        {(Object.entries(byType) as [keyof typeof byType, { total: number; correct: number }][])
          .filter(([, v]) => v.total > 0)
          .map(([type, stat]) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            const typePct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.cls}`}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">{stat.correct}/{stat.total}</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      typePct >= 70 ? 'bg-emerald-400' : typePct >= 40 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${typePct}%` }}
                  />
                </div>
              </div>
            );
        })}
      </div>

      {/* Review */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-800">Review Jawaban</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
          {questions.map((q, i) => {
            const ans = answers[i];
            const ok = ans ? isCorrect(q, ans) : false;
            const userAns = ans ? (ans as { jawaban: string }).jawaban : '—';
            const correctAns =
              q.type === 'membandingkan' ? q.data.jawabanBaku :
              q.type === 'analisis' ? q.data.kataBenar :
              q.data.kataJawaban;
            const meta = TYPE_META[q.type];
            const Icon = meta.icon;
            return (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${ok ? 'text-emerald-500' : 'text-red-400'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-700">
                    Jawabanmu:{' '}
                    <strong className={ok ? 'text-emerald-600' : 'text-red-500'}>{userAns}</strong>
                    {!ok && <span className="text-zinc-400"> (benar: <strong>{correctAns}</strong>)</span>}
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
        <button id="btn-ulangi-assessment" onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-rose-300 hover:text-rose-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button id="btn-back-menu-assessment" onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function AssessmentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as Difficulty;
  const totalSoal = SOAL_COUNT[difficulty];

  // Build mixed question list
  const questions = useMemo<AssessmentQuestion[]>(() => {
    // Detektif: convert paragraphs into single-sentence word questions
    const detektifWords = detektifData.flatMap((soal) =>
      soal.kataJawaban.map((kata, i) => ({
        type: 'detektif_word' as const,
        data: {
          id: soal.id * 100 + i,
          kalimat: soal.paragraf.find((p) => p.toLowerCase().includes(kata.toLowerCase())) ?? soal.paragraf[0],
          kataJawaban: kata,
          huruf: kata[0].toUpperCase(),
        },
      }))
    );

    const membPool: AssessmentQuestion[] = shuffle(membandingkanData).map((d) => ({ type: 'membandingkan', data: d }));
    const analPool: AssessmentQuestion[] = shuffle(analisisData).map((d) => ({ type: 'analisis', data: d }));
    const detPool: AssessmentQuestion[] = shuffle(detektifWords);

    // Mix evenly in thirds
    const third = Math.floor(totalSoal / 3);
    const remainder = totalSoal - third * 3;

    const mixed: AssessmentQuestion[] = [
      ...membPool.slice(0, third + (remainder > 0 ? 1 : 0)),
      ...analPool.slice(0, third + (remainder > 1 ? 1 : 0)),
      ...detPool.slice(0, third),
    ];

    return shuffle(mixed).slice(0, totalSoal);
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
        <span className="text-zinc-700 font-medium">Assessment</span>
      </div>

      {phase === 'playing' && questions.length > 0 && (
        <PlayingScreen
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={() => setPhase('results')}
          onBack={handleBack}
        />
      )}

      {phase === 'playing' && questions.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-zinc-500 mb-4">Tidak ada soal yang tersedia.</p>
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold cursor-pointer">
            Kembali ke Menu
          </button>
        </div>
      )}

      {phase === 'results' && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          difficulty={difficulty}
          onRestart={() => { setAnswers({}); setPhase('playing'); }}
          onBack={handleBack}
        />
      )}
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Menyiapkan soal...</div>}>
            <AssessmentInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
