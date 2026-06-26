'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import {
  Trophy,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
  BookOpen,
  Languages,
  Award,
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  initials: string;
  points: number;
  category: 'indonesia' | 'english';
  subCategory: 'eyd' | 'tata-bahasa' | 'sastra' | 'grammar' | 'vocabulary' | 'reading-writing';
  rankChange: 'up' | 'down' | 'same';
  level: number;
  avatarBg: string;
}

const allUsers: LeaderboardUser[] = [
  { id: '1', name: 'John Doe', initials: 'JD', points: 3450, category: 'english', subCategory: 'grammar', rankChange: 'up', level: 12, avatarBg: 'from-blue-500 to-indigo-600' },
  { id: '2', name: 'Budi Santoso', initials: 'BS', points: 3200, category: 'indonesia', subCategory: 'eyd', rankChange: 'same', level: 10, avatarBg: 'from-emerald-500 to-teal-600' },
  { id: '3', name: 'Sarah Connor', initials: 'SC', points: 3050, category: 'english', subCategory: 'vocabulary', rankChange: 'down', level: 11, avatarBg: 'from-pink-500 to-rose-600' },
  { id: '4', name: 'Ahmad Habib', initials: 'AH', points: 2900, category: 'indonesia', subCategory: 'tata-bahasa', rankChange: 'up', level: 9, avatarBg: 'from-amber-500 to-orange-600' },
  { id: '5', name: 'Emily Watson', initials: 'EW', points: 2750, category: 'english', subCategory: 'reading-writing', rankChange: 'down', level: 8, avatarBg: 'from-violet-500 to-purple-600' },
  { id: '6', name: 'Rian Hidayat', initials: 'RH', points: 2600, category: 'indonesia', subCategory: 'sastra', rankChange: 'up', level: 8, avatarBg: 'from-cyan-500 to-blue-600' },
  { id: '7', name: 'Jessica Lee', initials: 'JL', points: 2450, category: 'english', subCategory: 'grammar', rankChange: 'same', level: 7, avatarBg: 'from-fuchsia-500 to-pink-600' },
  { id: '8', name: 'Siti Aminah', initials: 'SA', points: 2300, category: 'indonesia', subCategory: 'eyd', rankChange: 'down', level: 7, avatarBg: 'from-teal-500 to-emerald-600' },
  { id: '9', name: 'David Beckham', initials: 'DB', points: 2150, category: 'english', subCategory: 'vocabulary', rankChange: 'up', level: 6, avatarBg: 'from-orange-500 to-red-600' },
  { id: '10', name: 'Mega Utami', initials: 'MU', points: 2000, category: 'indonesia', subCategory: 'tata-bahasa', rankChange: 'same', level: 6, avatarBg: 'from-purple-500 to-indigo-600' },
  { id: '11', name: 'Dian Sastro', initials: 'DS', points: 1950, category: 'indonesia', subCategory: 'sastra', rankChange: 'up', level: 5, avatarBg: 'from-rose-400 to-red-500' },
  { id: '12', name: 'Joko Anwar', initials: 'JA', points: 1800, category: 'indonesia', subCategory: 'eyd', rankChange: 'down', level: 5, avatarBg: 'from-amber-400 to-amber-600' },
  { id: '13', name: 'Emma Watson', initials: 'EM', points: 1980, category: 'english', subCategory: 'reading-writing', rankChange: 'up', level: 5, avatarBg: 'from-violet-400 to-fuchsia-600' },
  { id: '14', name: 'Tom Cruise', initials: 'TC', points: 1850, category: 'english', subCategory: 'grammar', rankChange: 'down', level: 4, avatarBg: 'from-sky-400 to-blue-600' },
  { id: '15', name: 'Angelina Jolie', initials: 'AJ', points: 1700, category: 'english', subCategory: 'vocabulary', rankChange: 'same', level: 4, avatarBg: 'from-purple-500 to-pink-600' },
];

export default function Leaderboard() {
  const [category, setCategory] = useState<'all' | 'indonesia' | 'english'>('all');
  const [subCategory, setSubCategory] = useState<string>('all');

  const handleCategoryChange = (cat: 'all' | 'indonesia' | 'english') => {
    setCategory(cat);
    setSubCategory('all');
  };

  const filteredUsers = allUsers
    .filter((user) => {
      if (category === 'all') return true;
      if (user.category !== category) return false;
      if (subCategory === 'all') return true;
      return user.subCategory === subCategory;
    })
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      displayRank: index + 1,
    }))
    .slice(0, 10); // Display only top 10 in total

  const first = filteredUsers[0];
  const second = filteredUsers[1];
  const third = filteredUsers[2];
  const remaining = filteredUsers.slice(3);

  const getSubCategoryLabel = (subCat: string) => {
    switch (subCat) {
      case 'eyd':
        return 'EYD';
      case 'tata-bahasa':
        return 'Tata Bahasa';
      case 'sastra':
        return 'Kesusastraan';
      case 'grammar':
        return 'Grammar';
      case 'vocabulary':
        return 'Vocabulary';
      case 'reading-writing':
        return 'Reading & Writing';
      default:
        return '';
    }
  };

  const renderRankChange = (change: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up':
        return <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />;
      case 'down':
        return <ArrowDown className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  return (
    <div className="flex bg-zinc-100 min-h-screen text-zinc-900 font-sans">
      {/* Sidebar on the Left */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area on the Right */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Header and Category Filter */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leaderboard</h1>
                    <p className="text-sm text-zinc-500">Lihat prestasi siswa terbaik kami di seluruh kelas.</p>
                  </div>
                </div>

                {/* Category selector */}
                <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/50 self-start md:self-auto">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${category === 'all'
                        ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200/20'
                        : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                  >
                    Semua Kategori
                  </button>
                  <button
                    onClick={() => handleCategoryChange('indonesia')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${category === 'indonesia'
                        ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200/20'
                        : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Indonesia
                  </button>
                  <button
                    onClick={() => handleCategoryChange('english')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${category === 'english'
                        ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200/20'
                        : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    English
                  </button>
                </div>
              </div>

              {/* Sub-Category selector (shows only if category is 'indonesia' or 'english') */}
              {category !== 'all' && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400 mr-2">Materi:</span>
                  <button
                    onClick={() => setSubCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'all'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                      }`}
                  >
                    Semua {category === 'indonesia' ? 'Indonesia' : 'English'}
                  </button>
                  {category === 'indonesia' ? (
                    <>
                      <button
                        onClick={() => setSubCategory('eyd')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'eyd'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        EYD (Ejaan)
                      </button>
                      <button
                        onClick={() => setSubCategory('tata-bahasa')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'tata-bahasa'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        Tata Bahasa
                      </button>
                      <button
                        onClick={() => setSubCategory('sastra')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'sastra'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        Kesusastraan
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSubCategory('grammar')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'grammar'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        Grammar
                      </button>
                      <button
                        onClick={() => setSubCategory('vocabulary')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'vocabulary'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        Vocabulary
                      </button>
                      <button
                        onClick={() => setSubCategory('reading-writing')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${subCategory === 'reading-writing'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'
                          }`}
                      >
                        Reading & Writing
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Layout: Desktop: Podium Left, Rows Right | Mobile: Stacked */}
            <div className="flex flex-col xl:flex-row gap-8 items-start">

              {/* Podium & Widgets Column (Left on Desktop, Top on Mobile) */}
              <div className="w-full xl:w-5/12 flex flex-col gap-6">

                {/* Podium Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-zinc-800 px-1">Top 3 Peringkat</h2>
                  <div className="flex items-end justify-center gap-3 md:gap-5 pt-12 pb-6 px-4 bg-white rounded-3xl border border-zinc-200/80 shadow-sm relative min-h-[360px]">
                    {/* Background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none rounded-3xl" />

                    {/* 2nd Place */}
                    {second ? (
                      <div className="flex flex-col items-center flex-1 max-w-[120px] z-10">
                        <div className="relative group mb-2">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-300 to-slate-400 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-base transition-transform duration-200 group-hover:scale-105">
                            {second.initials}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-sm">
                            2
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-800 text-center truncate w-full px-1">{second.name}</span>
                        <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">{second.points} XP</span>
                        <div className="w-full mt-3 bg-zinc-100 border border-zinc-200/50 rounded-t-xl flex flex-col items-center justify-end h-24 shadow-inner transition-all duration-300 hover:bg-zinc-200/40">
                          <span className="text-xl font-black text-zinc-400 mb-4 tracking-tight">2nd</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* 1st Place */}
                    {first ? (
                      <div className="flex flex-col items-center flex-1 max-w-[130px] z-10">
                        <div className="mb-1 text-amber-500 animate-bounce">
                          <Crown className="w-7 h-7 fill-amber-400" />
                        </div>
                        <div className="relative group mb-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 border-2 border-yellow-200 shadow-lg flex items-center justify-center text-white font-bold text-lg transition-transform duration-200 group-hover:scale-105 ring-2 ring-yellow-400/20">
                            {first.initials}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 border border-yellow-300 flex items-center justify-center text-[11px] font-bold text-amber-950 shadow-sm">
                            1
                          </div>
                        </div>
                        <span className="text-sm font-bold text-zinc-900 text-center truncate w-full px-1">{first.name}</span>
                        <span className="text-xs font-bold text-indigo-600 mt-0.5">{first.points} XP</span>
                        <div className="w-full mt-3 bg-gradient-to-t from-yellow-50 to-amber-100/30 border border-yellow-200/40 rounded-t-xl flex flex-col items-center justify-end h-32 shadow-inner transition-all duration-300 hover:from-yellow-100 hover:to-amber-200/30">
                          <span className="text-2xl font-black text-amber-500 mb-6 tracking-tight">1st</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* 3rd Place */}
                    {third ? (
                      <div className="flex flex-col items-center flex-1 max-w-[120px] z-10">
                        <div className="relative group mb-2">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-orange-700 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-base transition-transform duration-200 group-hover:scale-105">
                            {third.initials}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-[10px] font-bold text-orange-950 shadow-sm">
                            3
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-800 text-center truncate w-full px-1">{third.name}</span>
                        <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">{third.points} XP</span>
                        <div className="w-full mt-3 bg-orange-50/10 border border-orange-150/40 rounded-t-xl flex flex-col items-center justify-end h-16 shadow-inner transition-all duration-300 hover:bg-orange-100/10">
                          <span className="text-xl font-black text-amber-700/50 mb-2 tracking-tight">3rd</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </div>

                {/* Widget: Peringkat Anda */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Statistik Belajar Anda</h3>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        IW
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-800">Indra Wijaya</div>
                        <div className="text-[10px] text-zinc-400 font-medium">Level 5 • Belajar Aktif</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-indigo-600">#12</div>
                      <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Peringkat</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-zinc-500">
                      <span>Progres ke Top 10</span>
                      <span>1,950 / 2,000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: '97.5%' }} />
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                      🔥 Hebat! Tinggal <span className="font-bold text-indigo-600">50 XP lagi</span> untuk masuk Top 10 dan menggeser Mega Utami.
                    </p>
                  </div>
                </div>

              </div>

              {/* Rows Column (Right on Desktop, Bottom on Mobile) */}
              <div className="w-full xl:w-7/12 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-zinc-800 px-1">Peringkat Lainnya</h2>
                <div className="space-y-3 w-full">
                  {remaining.length > 0 ? (
                    remaining.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-white border border-zinc-200/80 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:border-zinc-300 group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank indicator and trend */}
                          <div className="flex flex-col items-center justify-center w-8">
                            <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors">
                              #{user.displayRank}
                            </span>
                            <div className="mt-0.5">{renderRankChange(user.rankChange)}</div>
                          </div>

                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${user.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                            {user.initials}
                          </div>

                          {/* Name and Level info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-800 group-hover:text-indigo-600 transition-colors">
                                {user.name}
                              </span>
                              {user.category === 'indonesia' ? (
                                <span className="bg-rose-50/70 text-rose-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-100/50">
                                  Indonesia • {getSubCategoryLabel(user.subCategory)}
                                </span>
                              ) : (
                                <span className="bg-blue-50/70 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100/50">
                                  English • {getSubCategoryLabel(user.subCategory)}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium">Level {user.level}</span>
                          </div>
                        </div>

                        {/* XP points */}
                        <div className="flex items-center gap-2 pr-2">
                          <span className="text-sm font-black text-zinc-900">{user.points}</span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">XP</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center text-zinc-500">
                      Tidak ada data siswa untuk kategori ini.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
