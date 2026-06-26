'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import { lengkapiTextData, type LengkapiTextSoal } from '@/shared/data/konjungsi-data';
import {
  LayoutTemplate, ChevronRight, BookOpen, RotateCcw,
  CheckCircle, XCircle, Trophy, ArrowLeft,
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'playing' | 'results';

const PARAGRAF_COUNT: Record<Difficulty, number> = { easy: 2, medium: 3, hard: 4 };

const DIFF_LABEL: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFF_CLS: Record<Difficulty, string> = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-sky-100 text-sky-700',
  hard:   'bg-red-100 text-red-700',
};

// ─── Utility to shuffle word bank ─────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  soal,
  difficulty,
  onFinish,
  onBack,
}: {
  soal: LengkapiTextSoal;
  difficulty: Difficulty;
  onFinish: (answers: Record<string, string>) => void;
  onBack: () => void;
}) {
  const paragrafToShow = soal.paragraf.slice(0, PARAGRAF_COUNT[difficulty]);
  
  // Only use blanks that appear in the shown paragraphs
  const activeBlanks = useMemo(() => {
    const pStr = paragrafToShow.join(' ');
    return soal.blanks.filter(b => pStr.includes(`[[${b.id}]]`));
  }, [paragrafToShow, soal.blanks]);

  const shuffledBank = useMemo(() => shuffle([...soal.kataBank]), [soal.kataBank]);
  
  // State for user answers (key = blank ID, value = string from word bank)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Kata bank items that are currently used
  const usedWords = Object.values(answers);

  const [checked, setChecked] = useState(false);

  // Simple click-based interaction instead of native Drag and Drop for mobile compatibility
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    if (checked) return;
    if (usedWords.includes(word)) return; // Already used
    
    setSelectedWord(selectedWord === word ? null : word);
  };

  const handleBlankClick = (blankId: string) => {
    if (checked) return;
    
    if (selectedWord) {
      // Place the selected word into the blank
      setAnswers(prev => ({ ...prev, [blankId]: selectedWord }));
      setSelectedWord(null);
    } else if (answers[blankId]) {
      // Remove the word from the blank
      setAnswers(prev => {
        const next = { ...prev };
        delete next[blankId];
        return next;
      });
    }
  };

  const isAllFilled = activeBlanks.every(b => answers[b.id] !== undefined);

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
        <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-200">
          <LayoutTemplate className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">Lengkapi Text</p>
          <p className="text-xs text-zinc-400">Isi bagian yang rumpang dengan konjungsi yang tepat</p>
        </div>
      </div>

      {/* Text card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-7">
        <p className="text-xs text-sky-600 font-semibold mb-1 uppercase tracking-wider">{soal.judul}</p>
        <p className="text-xs text-zinc-400 mb-5">
          Klik kata di kotak bawah, lalu klik area rumpang (<span className="inline-block border-b-2 border-zinc-300 w-6 text-center">...</span>) untuk mengisinya.
        </p>
        
        <div className="space-y-4">
          {paragrafToShow.map((par, pi) => {
            // Split paragraph by [[B_X]]
            const parts = par.split(/(\[\[B_\d+\]\])/);
            
            return (
              <p key={pi} className="text-sm leading-8 text-zinc-700">
                {parts.map((part, ci) => {
                  const match = part.match(/\[\[(B_\d+)\]\]/);
                  if (match) {
                    const blankId = match[1];
                    const filledWord = answers[blankId];
                    const isActive = selectedWord !== null && !filledWord;
                    
                    let cls = 'border-zinc-300 hover:border-sky-400 cursor-pointer';
                    if (filledWord) cls = 'border-sky-400 text-sky-700 bg-sky-50 cursor-pointer';
                    if (isActive) cls = 'border-sky-400 border-dashed bg-sky-50/50 cursor-pointer ring-2 ring-sky-100';
                    
                    if (checked) {
                      const isCorrect = filledWord === soal.blanks.find(b => b.id === blankId)?.jawaban;
                      if (isCorrect) cls = 'border-emerald-400 text-emerald-700 bg-emerald-50 cursor-default';
                      else cls = 'border-red-400 text-red-600 bg-red-50 cursor-default';
                    }
                    
                    return (
                      <span
                        key={ci}
                        onClick={() => handleBlankClick(blankId)}
                        className={`inline-block min-w-[80px] text-center px-2 py-0.5 mx-1 border-b-2 font-medium transition-all ${cls}`}
                      >
                        {filledWord || '...'}
                        {checked && filledWord && (
                          filledWord === soal.blanks.find(b => b.id === blankId)?.jawaban
                            ? <CheckCircle className="w-3 h-3 inline ml-1 text-emerald-500" />
                            : <XCircle className="w-3 h-3 inline ml-1 text-red-400" />
                        )}
                      </span>
                    );
                  }
                  return <span key={ci}>{part}</span>;
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Word Bank */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-zinc-700 mb-3">Pilihan Kata:</p>
        <div className="flex flex-wrap gap-2">
          {shuffledBank.map((word, i) => {
            const isUsed = usedWords.includes(word);
            const isSelected = selectedWord === word;
            
            let btnCls = 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:border-sky-300 hover:bg-white cursor-pointer';
            if (isUsed) btnCls = 'bg-zinc-50 text-zinc-300 border border-dashed border-zinc-200 cursor-not-allowed opacity-60';
            if (isSelected) btnCls = 'bg-sky-500 text-white border-sky-600 shadow-md transform scale-105';
            
            return (
              <button
                key={`${word}-${i}`}
                onClick={() => handleWordClick(word)}
                disabled={isUsed || checked}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${btnCls}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!isAllFilled}
            className="flex-1 py-3.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            onClick={() => onFinish(answers)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
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
  answers,
  difficulty,
  onRestart,
  onBack,
}: {
  soal: LengkapiTextSoal;
  answers: Record<string, string>;
  difficulty: Difficulty;
  onRestart: () => void;
  onBack: () => void;
}) {
  const paragrafToShow = soal.paragraf.slice(0, PARAGRAF_COUNT[difficulty]);
  const pStr = paragrafToShow.join(' ');
  const activeBlanks = soal.blanks.filter(b => pStr.includes(`[[${b.id}]]`));
  
  const correctCount = activeBlanks.filter((b) => answers[b.id] === b.jawaban).length;
  const pct = Math.round((correctCount / activeBlanks.length) * 100);

  const grade =
    pct >= 90 ? { label: 'Sempurna!', color: 'text-emerald-600' } :
    pct >= 70 ? { label: 'Bagus!', color: 'text-sky-500' } :
    pct >= 50 ? { label: 'Lumayan', color: 'text-blue-500' } :
    { label: 'Terus Berlatih', color: 'text-red-500' };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200">
          <Trophy className="w-9 h-9 text-white" />
        </div>
        <p className={`text-lg font-bold mb-1 ${grade.color}`}>{grade.label}</p>
        <p className="text-5xl font-black text-zinc-900 mt-2">{pct}%</p>
        <p className="text-sm text-zinc-500 mt-2">
          {correctCount} dari {activeBlanks.length} kata terisi dengan benar
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-800">Kunci Jawaban</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-72 overflow-y-auto p-5 space-y-3">
          {activeBlanks.map((b, i) => {
            const userAns = answers[b.id];
            const isCorrect = userAns === b.jawaban;
            
            return (
              <div key={b.id} className={`p-3 rounded-xl border flex items-center justify-between ${
                isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
              }`}>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Rumpang {i + 1}</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {userAns || '(Kosong)'}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-emerald-600 mt-1">Seharusnya: {b.jawaban}</p>
                  )}
                </div>
                {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex gap-3">
        <button onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-sky-300 hover:text-sky-600 transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </button>
        <button onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-all cursor-pointer">
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function LengkapiTextInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as Difficulty;

  const soal: LengkapiTextSoal = useMemo(() => {
    const valid = lengkapiTextData;
    return valid[Math.floor(Math.random() * valid.length)] ?? lengkapiTextData[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<Phase>('playing');
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});

  const handleBack = () => router.push('/indonesia/konjungsi');

  return (
    <>
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Indonesia</span>
        <ChevronRight className="w-3 h-3" />
        <span>Konjungsi</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Lengkapi Text</span>
      </div>
      {phase === 'playing' && (
        <PlayingScreen
          soal={soal}
          difficulty={difficulty}
          onFinish={(ans) => { setFinalAnswers(ans); setPhase('results'); }}
          onBack={handleBack}
        />
      )}
      {phase === 'results' && (
        <ResultsScreen
          soal={soal}
          answers={finalAnswers}
          difficulty={difficulty}
          onRestart={() => { setFinalAnswers({}); setPhase('playing'); }}
          onBack={handleBack}
        />
      )}
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LengkapiTextPage() {
  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Suspense fallback={<div className="text-center py-20 text-zinc-400">Memuat teks...</div>}>
            <LengkapiTextInner />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
