'use client';

import React from 'react';
import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative w-full rounded-[24px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 p-8 sm:p-10 text-white overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Decorative background circles */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Small floating dots */}
      <div className="absolute top-[20%] left-[45%] w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-blue-300 rounded-full opacity-50 animate-pulse" />
      <div className="absolute top-[60%] right-[40%] w-2 h-2 bg-purple-300 rounded-full opacity-50" />

      {/* Left Content */}
      <div className="flex-1 z-10 max-w-lg text-center md:text-left flex flex-col items-center md:items-start">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Hi, Irham Muhammad Shidiq
        </h1>
        <p className="mt-3 text-white/85 text-sm sm:text-base font-medium leading-relaxed">
          The library serves as a welcoming home for knowledge seekers and avid readers alike.
        </p>
        <button className="mt-6 px-6 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-200 cursor-pointer">
          Learn more
        </button>
      </div>

      {/* Right 3D Illustration */}
      <div className="w-56 h-36 sm:w-64 sm:h-44 md:w-72 md:h-48 relative shrink-0 z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
        <Image
          src="/images/banner_3d_books.png"
          alt="3D books and glasses illustration"
          fill
          priority
          sizes="(max-width: 768px) 256px, 288px"
          className="object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
