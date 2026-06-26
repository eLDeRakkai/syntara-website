'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface BookCardProps {
  title: string;
  description: string;
  imageSrc: string;
  gradient: string;
  accentColor: string;
  category?: string;
  rating?: number;
}

export default function BookCard({
  title,
  description,
  imageSrc,
  gradient,
  accentColor,
  category = 'Library',
  rating = 4.5,
}: BookCardProps) {


  return (
    <div className="flex flex-col group cursor-pointer">
      {/* ── Image Stage ── */}
      <div
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${gradient} transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg shadow-sm`}
      >
        {/* Decorative blurred blobs for depth */}
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/15 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle grid/dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Illustration — contained with drop-shadow */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-full h-full drop-shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, 220px"
              className="object-contain"
            />
          </div>
        </div>


      </div>

      {/* ── Card Info ── */}
      <div className="mt-3 px-0.5">
        <h3 className="font-bold theme-card-title text-sm truncate leading-snug group-hover:text-indigo-500 transition-colors duration-500">
          {title}
        </h3>
        <p className="text-[11px] theme-card-description mt-0.5 line-clamp-1 leading-relaxed">
          {description}
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          <span className={`text-[11px] font-bold ${accentColor}`}>{rating.toFixed(1)}</span>
          <span className="text-[10px] theme-card-meta ml-0.5">/ 5.0</span>
        </div>
      </div>
    </div>
  );
}
