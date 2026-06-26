'use client';

import React from 'react';
import BookCard from './book-card';

export default function BookGrid() {
  const popularBooks = [
    {
      title: 'EYD Edisi V',
      description: 'Pedoman ejaan resmi Bahasa Indonesia terbaru dari Kemendikbud.',
      imageSrc: '/images/book_3d_stack.png',
      gradient: 'bg-gradient-to-br from-indigo-400 to-violet-500',
      accentColor: 'text-indigo-500',
      category: 'Ejaan',
      rating: 4.9,
    },
    {
      title: 'Tata Bahasa Baku',
      description: 'Panduan lengkap struktur gramatikal Bahasa Indonesia baku.',
      imageSrc: '/images/book_3d_red.png',
      gradient: 'bg-gradient-to-br from-rose-400 to-orange-400',
      accentColor: 'text-rose-500',
      category: 'Tata Bahasa',
      rating: 4.7,
    },
    {
      title: 'Kosakata KBBI',
      description: 'Perkaya kosakata dengan ribuan entri pilihan dari KBBI edisi terkini.',
      imageSrc: '/images/book_3d_open.png',
      gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      accentColor: 'text-emerald-500',
      category: 'Kosakata',
      rating: 4.6,
    },
    {
      title: 'Seni Menulis',
      description: 'Teknik menulis paragraf efektif untuk karya ilmiah dan kreatif.',
      imageSrc: '/images/book_3d_coffee.png',
      gradient: 'bg-gradient-to-br from-amber-400 to-yellow-400',
      accentColor: 'text-amber-500',
      category: 'Menulis',
      rating: 4.5,
    },
  ];

  const ongoingBooks = [
    {
      title: 'Diksi & Gaya Bahasa',
      description: 'Memahami pilihan kata dan majas dalam karya sastra dan ilmiah.',
      imageSrc: '/images/book_3d_purple.png',
      gradient: 'bg-gradient-to-br from-purple-400 to-pink-500',
      accentColor: 'text-purple-500',
      category: 'Stilistika',
      rating: 4.8,
    },
    {
      title: 'Penulisan Ilmiah',
      description: 'Panduan menyusun karya ilmiah sesuai kaidah akademik nasional.',
      imageSrc: '/images/book_3d_stack.png',
      gradient: 'bg-gradient-to-br from-sky-400 to-blue-500',
      accentColor: 'text-sky-500',
      category: 'Akademik',
      rating: 4.6,
    },
    {
      title: 'Alinea & Paragraf',
      description: 'Teknik menyusun alinea kohesif dan koherensi dalam tulisan.',
      imageSrc: '/images/book_3d_red.png',
      gradient: 'bg-gradient-to-br from-red-400 to-rose-500',
      accentColor: 'text-red-500',
      category: 'Menulis',
      rating: 4.4,
    },
    {
      title: 'Retorika & Pidato',
      description: 'Keterampilan berbicara persuasif dalam konteks formal dan publik.',
      imageSrc: '/images/book_3d_coffee.png',
      gradient: 'bg-gradient-to-br from-orange-400 to-amber-500',
      accentColor: 'text-orange-500',
      category: 'Berbicara',
      rating: 4.3,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Popular Section */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold theme-text-strong">Populer</h2>
          <button className="text-xs font-semibold theme-text-muted hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer">
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {popularBooks.map((book, idx) => (
            <BookCard key={`pop-${idx}`} {...book} />
          ))}
        </div>
      </div>

      {/* Ongoing Section */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold theme-text-strong">Sedang Dipelajari</h2>
          <button className="text-xs font-semibold theme-text-muted hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer">
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {ongoingBooks.map((book, idx) => (
            <BookCard key={`ong-${idx}`} {...book} />
          ))}
        </div>
      </div>
    </div>
  );
}
