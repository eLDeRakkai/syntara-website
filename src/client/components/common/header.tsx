'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';

    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.style.colorScheme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem('theme', nextTheme);
  };

  return (
    <header className="h-20 theme-panel border-b px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
      {/* Search Input */}
      <div className="w-96 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search.."
          className="w-full h-11 pl-12 pr-4 theme-input rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Live Badge */}
        <div className="flex items-center gap-2 px-3 py-1 theme-badge-live border rounded-full">
          <span className="w-2 h-2 theme-badge-live-dot rounded-full animate-pulse" />
          <span className="text-[10px] font-bold theme-badge-live-text uppercase tracking-wider">Live</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 theme-icon-btn rounded-xl transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <button className="p-2 theme-icon-btn rounded-xl relative transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l theme-panel-alt">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white ring-2 ring-indigo-100">
            IS
          </div>
        </div>
      </div>
    </header>
  );
}
