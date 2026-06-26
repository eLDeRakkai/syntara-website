'use client';

import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Languages,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [indonesiaOpen, setIndonesiaOpen] = useState(true);
  const [englishOpen, setEnglishOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderSubmenuItem = (name: string, href: string) => {
    const active = isActive(href);
    return (
      <Link
        key={name}
        href={href}
        className={`flex items-center gap-2.5 pl-12 pr-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group/sub ${active
            ? 'theme-nav-link-active'
            : 'theme-nav-link'
          }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 theme-dot ${active ? 'scale-125' : 'group-hover/sub:bg-indigo-600'}`}
        />
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 theme-panel border-r flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b theme-panel-alt">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: 'var(--surface)' }}>
            <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-xl font-bold theme-text-strong">SkillSet</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {/* Home Item */}
        <Link
          href="/"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${isActive('/')
              ? 'theme-nav-link-active'
              : 'theme-nav-link'
            }`}
        >
          {isActive('/') && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
          )}
          <Home
            className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive('/') ? 'text-indigo-600' : 'theme-text-muted'}`}
          />
          <span>Home</span>
        </Link>

        {/* Leaderboard Item */}
        <Link
          href="/leaderboard"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${isActive('/leaderboard')
              ? 'theme-nav-link-active'
              : 'theme-nav-link'
            }`}
        >
          {isActive('/leaderboard') && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
          )}
          <Trophy
            className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive('/leaderboard') ? 'text-indigo-600' : 'theme-text-muted'}`}
          />
          <span>Leaderboard</span>
        </Link>

        {/* Indonesia Submenu */}
        <div className="space-y-1">
          <button
            onClick={() => setIndonesiaOpen(!indonesiaOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <BookOpen className="w-5 h-5 theme-text-muted transition-transform duration-200 group-hover:scale-110" />
              <span>Indonesia</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 theme-text-muted transition-transform duration-200 ${indonesiaOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-350 ease-in-out ${indonesiaOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="space-y-1 py-1">
              {renderSubmenuItem('EYD (Ejaan)', '/indonesia/eyd')}
              {renderSubmenuItem('Kata Baku', '/indonesia/kata-baku')}
              {renderSubmenuItem('Konjungsi', '/indonesia/konjungsi')}
              {renderSubmenuItem('Tata Bahasa', '/indonesia/tata-bahasa')}
              {renderSubmenuItem('Kesusastraan', '/indonesia/sastra')}
            </div>
          </div>
        </div>

        {/* English Submenu */}
        <div className="space-y-1">
          <button
            onClick={() => setEnglishOpen(!englishOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Languages className="w-5 h-5 theme-text-muted transition-transform duration-200 group-hover:scale-110" />
              <span>English</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 theme-text-muted transition-transform duration-200 ${englishOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-350 ease-in-out ${englishOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="space-y-1 py-1">
              {renderSubmenuItem('Grammar', '/english/grammar')}
              {renderSubmenuItem('Vocabulary', '/english/vocabulary')}
              {renderSubmenuItem('Reading & Writing', '/english/reading-writing')}
            </div>
          </div>
        </div>
      </nav>

    </aside>
  );
}
