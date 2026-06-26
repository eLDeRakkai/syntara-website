'use client';

import React, { useState } from 'react';
import { BookOpen, PenTool, Star, Flame, Award, Zap, Trophy, Microscope, MessageSquare } from 'lucide-react';

const badges = [
  {
    label: 'Pembaca Aktif',
    icon: BookOpen,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    ring: 'ring-indigo-200',
    earned: true,
  },
  {
    label: 'Ahli EYD',
    icon: PenTool,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    ring: 'ring-violet-200',
    earned: true,
  },
  {
    label: 'Bintang Kelas',
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    earned: true,
  },
  {
    label: 'Streak 7 Hari',
    icon: Flame,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    ring: 'ring-orange-200',
    earned: true,
  },
  {
    label: 'Juara Kuis',
    icon: Trophy,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    ring: 'ring-yellow-200',
    earned: false,
  },
  {
    label: 'Super Cepat',
    icon: Zap,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    ring: 'ring-sky-200',
    earned: false,
  },
  {
    label: 'Penghargaan',
    icon: Award,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    earned: false,
  },
  {
    label: 'Peneliti',
    icon: Microscope,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200',
    earned: false,
  },
  {
    label: 'Diskusi Pro',
    icon: MessageSquare,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    ring: 'ring-teal-200',
    earned: false,
  },
];

export default function Achievements() {
  const [toggle, setToggle] = useState(true);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="theme-panel rounded-[24px] p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold theme-text-strong text-sm">Unlocks Achievement</h3>
        <button
          onClick={() => setToggle(!toggle)}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
            toggle ? 'bg-indigo-600' : 'theme-panel-alt'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
              toggle ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <p className="theme-text-muted text-[11px] mb-4">
        {earnedCount} dari {badges.length} badge diraih
      </p>

      {/* Badge Grid */}
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`group/badge relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 ${
                badge.earned
                  ? `${badge.bg} ring-2 ${badge.ring}`
                  : 'theme-panel-alt ring-1 opacity-40'
              }`}
            >
              <Icon className={`w-5 h-5 ${badge.earned ? badge.color : 'theme-text-muted'}`} />

              {/* Custom Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                <div className="bg-zinc-900 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg flex flex-col items-center gap-0.5">
                  <span>{badge.label}</span>
                  <span className={`text-[9px] font-normal ${badge.earned ? 'text-emerald-400' : 'theme-text-muted'}`}>
                    {badge.earned ? '✓ Diraih' : '🔒 Terkunci'}
                  </span>
                </div>
                {/* Arrow */}
                <div className="w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1 rounded-sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
