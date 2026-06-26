import React from 'react';
import Sidebar from '@/client/components/common/sidebar';
import Header from '@/client/components/common/header';
import BookGrid from '@/client/components/features/book-grid';
import Achievements from '@/client/components/features/achievements';
import BestSales from '@/client/components/features/best-sales';

export default function Home() {
  return (
    <div className="flex min-h-screen font-sans theme-app">
      {/* Sidebar on the Left (hidden on mobile/tablet for responsiveness if needed, but sticky for desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area on the Right */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
            {/* Center Area: Hero Banner & Book Grids */}
            <div className="flex-1 space-y-10 min-w-0">
              <BookGrid />
            </div>

            {/* Right Widget Column: Achievements & Best Sales */}
            <div className="w-full xl:w-80 shrink-0 space-y-8">
              <Achievements />
              <BestSales />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
