'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import {
  lengkapiKalimatData, analisisTextData, lengkapiTextData,
  type LengkapiKalimatSoal, type AnalisisTextSoal, type LengkapiTextSoal
} from '@/shared/data/konjungsi-data';
import {
  ClipboardList, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight,
  PenLine, Search, LayoutTemplate
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'playing' | 'results';

// Assessment config
const CONFIG: Record<Difficulty, { total: number; lkCount: number; atPar: number; ltPar: number }> = {
  easy:   { total: 15, lkCount: 5, atPar: 2, ltPar: 2 },
  medium: { total: 25, lkCount: 10, atPar: 3, ltPar: 3 },
  hard:   { total: 35, lkCount: 15, atPar: 4, ltPar: 4 }
};

// ─── Unified Question Type ────────────────────────────────────────────────────

type AssessmentQuestion =
  | { type: 'lengkapi_kalimat'; data: LengkapiKalimatSoal }
  | { type: 'analisis_text_kalimat'; data: { id: string; pIdx: number; cIdx: number; kalimat: string; salah: boolean; koreksi?: string; judul: string } }
  | { type: 'lengkapi_text_blank'; data: { id: string; blankId: string; kalimat: string; jawaban: string; kataBank: string[]; judul: string } };

type UserAnswer =
  | { type: 'lengkapi_kalimat'; jawaban: string }
  | { type: 'analisis_text_kalimat'; isWrong: boolean }
  | { type: 'lengkapi_text_blank'; jawaban: string };

function isCorrect(q: AssessmentQuestion, a: UserAnswer): boolean {
  if (q.type === 'lengkapi_kalimat' && a.type === 'lengkapi_kalimat') {
    return a.jawaban === q.data.jawaban;
  }
  if (q.type === 'analisis_text_kalimat' && a.type === 'analisis_text_kalimat') {
    return a.isWrong === q.data.salah;
  }
  if (q.type === 'lengkapi_text_blank' && a.type === 'lengkapi_text_blank') {
    return a.jawaban === q.data.jawaban;
  }
  return false;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Question Type Labels ─────────────────────────────────────────────────────

const TYPE_META = {
  lengkapi_kalimat: { label: 'Lengkapi Kalimat', icon: PenLine, cls: 'bg-teal-50 text-teal-600 border-teal-100' },
  analisis_text_kalimat: { label: 'Analisis Text', icon: Search, cls: 'bg-blue-50 text-blue-600 border-blue-100' },
  lengkapi_text_blank: { label: 'Lengkapi Text', icon: LayoutTemplate, cls: 'bg-amber-50 text-amber-600 border-amber-100' },
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

  const q = questions[index];
  const currentAnswer = answers[index];
  const isAnswered = currentAnswer !== undefined;
  const answered_correct = isAnswered && isCorrect(q, currentAnswer);
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const progress = ((index + 1) / questions.length) * 100;

  const typeMeta = TYPE_META[q.type];
  const TypeIcon = typeMeta.icon;

  const handleSubmit = (ans: UserAnswer) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [index]: ans });
  };

  const handleNav = (dir: number) => {
    setIndex((i) => i + dir);
  };

  const renderCorrectAnswerMsg = () => {
    if (q.type === 'lengkapi_kalimat') return `Jawaban yang benar: "${q.data.jawaban}"`;
    if (q.type === 'analisis_text_kalimat') {
      return q.data.salah 
        ? `Kalimat tersebut SALAH. Seharusnya menggunakan konjungsi: "${q.data.koreksi}"`
        : `Kalimat tersebut SUDAH BENAR penggunaannya.`;
    }
    if (q.type === 'lengkapi_text_blank') return `Kata yang tepat untuk melengkapi: "${q.data.jawaban}"`;
    return '';
  };

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
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200">
          <ClipboardList className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Assessment Konjungsi</p>
          <p className="text-xs text-zinc-400">Soal campuran komprehensif</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7 space-y-5">
        {/* Type badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${typeMeta.cls}`}>
            <TypeIcon className="w-3 h-3" />
            {typeMeta.label}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Soal {index + 1}</span>
        </div>

        {/* ── Lengkapi Kalimat ── */}
        {q.type === 'lengkapi_kalimat' && (
          <div className="space-y-4">
            <p className="text-base text-zinc-800 leading-8 font-medium">
              {q.data.kalimat.split('___')[0]}
              <span className={`inline-block min-w-[80px] text-center border-b-2 mx-1 px-2 ${
                isAnswered 
                  ? answered_correct 
                    ? 'border-emerald-400 text-emerald-600' 
                    : 'border-red-400 text-red-600' 
                  : 'border-zinc-300 text-zinc-400'
              }`}>
                {isAnswered ? (currentAnswer as { jawaban: string }).jawaban : '...'}
              </span>
              {q.data.kalimat.split('___')[1]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {q.data.pilihan.map((p) => {
                const isSelected = isAnswered && (currentAnswer as { jawaban: string }).jawaban === p;
                const isTargetCorrect = isAnswered && p === q.data.jawaban;
                
                let btnCls = 'border-zinc-200 bg-white text-zinc-700 hover:border-teal-300 hover:bg-teal-50/40';
                if (isAnswered) {
                  if (isTargetCorrect) btnCls = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (isSelected) btnCls = 'border-red-400 bg-red-50 text-red-600';
                  else btnCls = 'border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60';
                }

                return (
                  <button
                    key={p}
                    onClick={() => handleSubmit({ type: 'lengkapi_kalimat', jawaban: p })}
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
          </div>
        )}

        {/* ── Analisis Text Kalimat ── */}
        {q.type === 'analisis_text_kalimat' && (
          <div className="space-y-5">
            <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{q.data.judul}</p>
            <p className="text-sm font-semibold text-zinc-800">Apakah penggunaan konjungsi pada kalimat di bawah ini sudah tepat atau salah?</p>
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-800 leading-7 font-medium">{q.data.kalimat}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Benar', val: false },
                { label: 'Salah', val: true }
              ].map((opt) => {
                const isSelected = isAnswered && (currentAnswer as { isWrong: boolean }).isWrong === opt.val;
                const isTargetCorrect = isAnswered && opt.val === q.data.salah;
                
                let btnCls = 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 hover:bg-blue-50/40';
                if (isAnswered) {
                  if (isTargetCorrect) btnCls = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (isSelected) btnCls = 'border-red-400 bg-red-50 text-red-600';
                  else btnCls = 'border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60';
                }

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSubmit({ type: 'analisis_text_kalimat', isWrong: opt.val })}
                    disabled={isAnswered}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${btnCls}`}
                  >
                    {opt.label}
                    {isAnswered && isTargetCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {isAnswered && isSelected && !isTargetCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Lengkapi Text Blank ── */}
        {q.type === 'lengkapi_text_blank' && (
          <div className="space-y-4">
            <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wider">{q.data.judul}</p>
            <p className="text-sm font-semibold text-zinc-800">Pilih kata hubung yang tepat untuk mengisi rumpang pada kalimat ini:</p>
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-4">
              <p className="text-sm leading-8 text-zinc-700 font-medium">
                {q.data.kalimat.split(/\[\[B_\d+\]\]/).map((part, ci, arr) => (
                  <React.Fragment key={ci}>
                    {part}
                    {ci < arr.length - 1 && (
                      <span className={`inline-block min-w-[80px] text-center px-2 py-0.5 mx-1 border-b-2 font-bold ${
                        isAnswered 
                          ? answered_correct 
                            ? 'border-emerald-400 text-emerald-700' 
                            : 'border-red-400 text-red-600' 
                          : 'border-amber-400 text-amber-600'
                      }`}>
                        {isAnswered ? (currentAnswer as { jawaban: string }).jawaban : '...'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {q.data.kataBank.map((word, i) => {
                const isSelected = isAnswered && (currentAnswer as { jawaban: string }).jawaban === word;
                const isTargetCorrect = isAnswered && word === q.data.jawaban;
                
                let btnCls = 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50';
                if (isAnswered) {
                  if (isTargetCorrect) btnCls = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (isSelected) btnCls = 'border-red-400 bg-red-50 text-red-600';
                  else btnCls = 'border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60';
                }

                return (
                  <button
                    key={`${word}-${i}`}
                    onClick={() => handleSubmit({ type: 'lengkapi_text_blank', jawaban: word })}
                    disabled={isAnswered}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${btnCls}`}
                  >
                    {word}
                    {isAnswered && isTargetCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isTargetCorrect && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {isAnswered && (
          <div className={`flex items-start gap-3 p-3.5 rounded-xl text-xs ${
            answered_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {answered_correct ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{answered_correct ? 'Tepat Sekali!' : 'Belum Tepat.'}</p>
              {!answered_correct && (
                <p className="mt-0.5 font-medium">{renderCorrectAnswerMsg()}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        {isAnswered && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleNav(-1)}
              disabled={index === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            {index < questions.length - 1 ? (
              <button
                onClick={() => handleNav(1)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-all cursor-pointer"
              >
                Berikutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                disabled={!allAnswered}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
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
    { label: 'Terus Berlatih', color: 'text-indigo-600', bg: 'from-indigo-500 to-violet-600' };

  // Stats by type
  const byType = {
    lengkapi_kalimat: { total: 0, correct: 0 },
    analisis_text_kalimat: { total: 0, correct: 0 },
    lengkapi_text_blank: { total: 0, correct: 0 },
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
        <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3">
          Assessment Konjungsi · {diffLabel}
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
            const meta = TYPE_META[type as keyof typeof TYPE_META];
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

      <div className="flex gap-3">
        <button onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer">
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
  const config = CONFIG[difficulty];

  // Build mixed question list
  const questions = useMemo<AssessmentQuestion[]>(() => {
    // 1. Lengkapi Kalimat
    const lkPool: AssessmentQuestion[] = shuffle(lengkapiKalimatData)
      .slice(0, config.lkCount)
      .map(d => ({ type: 'lengkapi_kalimat', data: d }));

    // 2. Analisis Text (convert sentences into true/false questions)
    let atCount = 0;
    const atPool: AssessmentQuestion[] = [];
    shuffle(analisisTextData).forEach(text => {
      if (atCount >= config.atPar) return; // limit paragraphs
      
      const pIdx = Math.floor(Math.random() * text.paragraf.length);
      const par = text.paragraf[pIdx];
      // Pick 1 wrong sentence (if exists) and 1 right sentence from this paragraph
      const wrongSentences = par.map((s, cIdx) => ({ s, cIdx })).filter(x => x.s.salah);
      const rightSentences = par.map((s, cIdx) => ({ s, cIdx })).filter(x => !x.s.salah);
      
      const toAdd = [];
      if (wrongSentences.length > 0) toAdd.push(wrongSentences[Math.floor(Math.random() * wrongSentences.length)]);
      if (rightSentences.length > 0) toAdd.push(rightSentences[Math.floor(Math.random() * rightSentences.length)]);
      
      toAdd.forEach(item => {
        atPool.push({
          type: 'analisis_text_kalimat',
          data: {
            id: `at-${text.id}-${pIdx}-${item.cIdx}`,
            pIdx, cIdx: item.cIdx,
            kalimat: item.s.kalimat,
            salah: item.s.salah,
            koreksi: item.s.koreksi,
            judul: text.judul
          }
        });
      });
      atCount++;
    });

    // 3. Lengkapi Text (convert blanks into multiple choice context)
    let ltCount = 0;
    const ltPool: AssessmentQuestion[] = [];
    shuffle(lengkapiTextData).forEach(text => {
      if (ltCount >= config.ltPar) return;
      
      const pIdx = Math.floor(Math.random() * text.paragraf.length);
      const parStr = text.paragraf[pIdx];
      
      // Find blanks in this paragraph
      text.blanks.forEach(b => {
        if (parStr.includes(`[[${b.id}]]`)) {
          // Find the specific sentence containing this blank
          const sentences = parStr.split(/(?<=\.)\s+/);
          const targetSentence = sentences.find(s => s.includes(`[[${b.id}]]`)) || parStr;
          
          // Generate word bank (correct + 3 random from text bank)
          let options = new Set<string>();
          options.add(b.jawaban);
          while (options.size < 4 && options.size < text.kataBank.length) {
            options.add(text.kataBank[Math.floor(Math.random() * text.kataBank.length)]);
          }
          
          ltPool.push({
            type: 'lengkapi_text_blank',
            data: {
              id: `lt-${text.id}-${b.id}`,
              blankId: b.id,
              kalimat: targetSentence,
              jawaban: b.jawaban,
              kataBank: shuffle(Array.from(options)),
              judul: text.judul
            }
          });
        }
      });
      ltCount++;
    });

    const mixed = shuffle([...lkPool, ...atPool, ...ltPool]);
    return mixed.slice(0, config.total); // Ensure exact total
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
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold cursor-pointer">
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
