'use client';

import React from 'react';
import { BookOpen, PenTool, Languages, Mic, AlignLeft, Feather } from 'lucide-react';

const topicItems = [
  {
    label: 'EYD (Ejaan yang Disempurnakan)',
    progress: 82,
    icon: PenTool,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-100',
    barColor: 'bg-indigo-600',
  },
  {
    label: 'Tata Kalimat',
    progress: 67,
    icon: AlignLeft,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50 border-violet-100',
    barColor: 'bg-violet-500',
  },
  {
    label: 'Kosakata KBBI',
    progress: 54,
    icon: BookOpen,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-100',
    barColor: 'bg-emerald-500',
  },
  {
    label: 'Menulis Paragraf',
    progress: 40,
    icon: Feather,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-100',
    barColor: 'bg-amber-500',
  },
  {
    label: 'Diksi & Gaya Bahasa',
    progress: 28,
    icon: Languages,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 border-rose-100',
    barColor: 'bg-rose-500',
  },
  {
    label: 'Kemahiran Berbicara',
    progress: 15,
    icon: Mic,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50 border-sky-100',
    barColor: 'bg-sky-500',
  },
];

export default function BestSales() {
  return (
    <div className="theme-panel rounded-[24px] p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold theme-text-strong text-sm">Progress Materi</h3>
        <button className="text-[10px] font-bold theme-text-muted hover:text-indigo-600 uppercase tracking-wider cursor-pointer transition-colors">
          Lihat Semua
        </button>
      </div>
      <p className="theme-text-muted text-[11px] mb-5">Pantau kemajuan belajarmu.</p>

      <div className="space-y-4">
        {topicItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${item.iconBg}`}
              >
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="theme-text-strong truncate pr-2">{item.label}</span>
                  <span className="theme-text-muted shrink-0">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 theme-progress-track rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
