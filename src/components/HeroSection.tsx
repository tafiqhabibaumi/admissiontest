'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Download,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowDown,
  Atom,
  Flame,
  Binary,
  BookOpen,
  Award
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { SingleProductConfig } from '@/types';

interface HeroSectionProps {
  hero: {
    badge: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    ctaButtonText: string;
    secondaryCtaText: string;
  };
  product: SingleProductConfig;
  onOpenCheckout: () => void;
}

const miniUniLogos = [
  { name: 'BUET', src: '/images/logos/buet.svg' },
  { name: 'RUET', src: '/images/logos/ruet.svg' },
  { name: 'KUET', src: '/images/logos/kuet.svg' },
  { name: 'CUET', src: '/images/logos/cuet.svg' },
  { name: 'IUT', src: '/images/logos/iut.png' },
  { name: 'DU', src: '/images/logos/du.svg' },
];

export default function HeroSection({ hero, product, onOpenCheckout }: HeroSectionProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates -1 to 1
    const xPct = (x / rect.width) * 2 - 1;
    const yPct = (y / rect.height) * 2 - 1;
    
    // Max 12 degree rotation
    setTilt({
      x: -yPct * 10,
      y: xPct * 10,
    });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const scrollToMatrix = () => {
    const el = document.getElementById('chapter-matrix');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[88vh] sm:min-h-[94vh] flex items-center justify-center pt-4 sm:pt-14 pb-14 sm:pb-28 px-3 sm:px-6 overflow-hidden perspective-1200">
      {/* 🏛️ Dual-Responsive University Campus Backdrops (Loads ONLY 1 image matching viewport) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <picture className="w-full h-full">
          <source media="(max-width: 640px)" srcSet="/images/bg-universities-mobile.jpg" />
          <img
            src="/images/bg-universities.jpg"
            alt="Engineering University Campuses"
            className="w-full h-full object-cover object-top sm:object-center opacity-90 filter contrast-110 brightness-95 transform-gpu"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Transparent Atmospheric Fog & Vignette Gradients */}
        <div className="absolute inset-0 bg-[#07090e]/25 sm:bg-[#07090e]/20" />
        <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#07090e]/50 via-transparent to-[#07090e]/95" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#07090e]/70 via-transparent to-[#07090e]/70" />
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-28 bg-gradient-to-b from-[#07090e] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center relative z-10">
        {/* Left Column: Bengali Editorial Copy (Instantly Painted on Frame 0) */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6 pt-1 sm:pt-0 transform-gpu">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-0.5 pb-0.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {hero.title}{' '}
            <span className="block mt-1 sm:mt-2 text-gradient-purple">
              {hero.highlightTitle}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {hero.subtitle}
          </p>

          {/* Quick Value Metrics Grid - 3-Col 3D Glass Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 max-w-xl mx-auto lg:mx-0 text-left">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 backdrop-blur-md transition-all shadow-xl hover:-translate-y-1">
              <span className="text-emerald-400 font-extrabold text-xs sm:text-base block font-mono drop-shadow">৫০টি অধ্যায়</span>
              <span className="text-slate-200 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-none font-medium">প্রায়োরিটি ও স্কিপ</span>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 backdrop-blur-md transition-all shadow-xl hover:-translate-y-1">
              <span className="text-amber-400 font-extrabold text-xs sm:text-base block font-mono drop-shadow">১২ সপ্তাহ</span>
              <span className="text-slate-200 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-none font-medium">৮৪ দিনের প্ল্যান</span>
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 backdrop-blur-md transition-all shadow-xl hover:-translate-y-1">
              <span className="text-indigo-400 font-extrabold text-xs sm:text-base block font-mono drop-shadow">৬-ব্লক রুটিন</span>
              <span className="text-slate-200 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-none font-medium">রিকভারি প্রটোকল</span>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto relative group overflow-hidden rounded-2xl p-[1.5px] shadow-2xl shadow-emerald-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 animate-pulse"></div>
              <div className="relative px-6 py-3.5 sm:px-9 sm:py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-[14.5px] flex items-center justify-center gap-2.5 text-white font-bold text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300 animate-bounce" />
                <span>মাস্টার গাইডটি সংগ্রহ করুন • {formatBDT(product.discountPrice)}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={scrollToMatrix}
              className="w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-4 rounded-2xl bg-slate-950/50 hover:bg-slate-900/70 border border-white/20 text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-xl hover:-translate-y-0.5"
            >
              <span>{hero.secondaryCtaText}</span>
              <ArrowDown className="w-4 h-4 text-indigo-400 animate-bounce" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 pt-2 text-xs text-slate-200 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>একক পূর্ণাঙ্গ PDF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>ইনস্ট্যান্ট ডাউনলোড</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>ভেরিফাইড পেমেন্ট</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Book & Floating Formula Capsules */}
        <div className="lg:col-span-5 flex justify-center w-full mt-4 sm:mt-0 relative transform-gpu">
          {/* Floating 3D Subject Capsules */}
          <div className="hidden sm:block absolute -top-5 -right-4 z-20 animate-float-capsule pointer-events-none">
            <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-emerald-300 font-semibold shadow-2xl">
              <Atom className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>পদার্থবিজ্ঞান শর্টকাট</span>
            </div>
          </div>

          <div className="hidden sm:block absolute top-1/2 -left-8 z-20 animate-float-reverse pointer-events-none">
            <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-amber-300 font-semibold shadow-2xl">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>রসায়ন মেকানিজম</span>
            </div>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -right-3 z-20 animate-float-slow pointer-events-none">
            <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-indigo-300 font-semibold shadow-2xl">
              <Binary className="w-3.5 h-3.5 text-indigo-400" />
              <span>গণিত ট্রিকস ও হ্যাকস</span>
            </div>
          </div>

          {/* Interactive 3D Tilt Book Mockup */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full max-w-sm sm:max-w-md cursor-pointer group"
            onClick={onOpenCheckout}
          >
            {/* Ambient Multi-Hue Glow Behind Card */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/25 via-indigo-600/25 to-purple-600/25 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity -z-10 animate-pulse-glow" />

            {/* 3D Glass Card Container */}
            <div className="relative rounded-3xl p-4 sm:p-7 bg-slate-950/40 border border-white/25 backdrop-blur-xl shadow-2xl text-white overflow-hidden">
              {/* Dynamic Mouse Glare Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent)`,
                }}
              />

              {/* Header Pill */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3 sm:pb-3 sm:mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-bold backdrop-blur-sm flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-300" />
                  <span>MASTER ADMISSION GUIDE 2026-27</span>
                </span>
              </div>

              {/* Inner 3D Graphic */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/50 border border-white/15 text-center space-y-3 backdrop-blur-md shadow-inner">
                {/* Official University Crests Row */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 bg-black/40 p-2 rounded-xl border border-white/15 backdrop-blur-sm">
                  {miniUniLogos.map((uni, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white p-1 border border-slate-600 flex items-center justify-center shadow hover:scale-110 transition-transform"
                      title={uni.name}
                    >
                      <img src={uni.src} alt={uni.name} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>

                <div className="py-1">
                  <h3 className="text-base sm:text-2xl font-extrabold text-white leading-normal pt-0.5 pb-0.5 drop-shadow-md">
                    ৫০টি অধ্যায়ের সম্পূর্ণ প্রায়োরিটি <br />
                    <span className="text-gradient-amber">& ৩ মাসের মাস্টার স্টাডি প্ল্যান</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 mt-1 font-mono font-medium">
                    Physics (1st & 2nd) • Chemistry (1st & 2nd) • Math (1st & 2nd)
                  </p>
                </div>

                {/* Real Data Snippet */}
                <div className="bg-black/40 rounded-xl p-3 text-left space-y-1.5 border border-white/15 text-xs backdrop-blur-md shadow">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-slate-200">★ ৫-স্টার অধ্যায়</span>
                    <span className="text-amber-400 font-bold font-mono">২৪টি (Must Study)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-slate-200">★ ৪-স্টার ও স্কিপ</span>
                    <span className="text-emerald-400 font-bold font-mono">২৬টি অধ্যায়</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">★ দিনভিত্তিক প্ল্যান</span>
                    <span className="text-indigo-400 font-bold font-mono">৮৪ দিনের ১২ সপ্তাহ</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-1.5">
                  <div className="text-left">
                    <span className="text-[10px] sm:text-xs text-slate-300 block line-through">{formatBDT(product.originalPrice)}</span>
                    <span className="text-base sm:text-xl font-extrabold text-emerald-400 font-mono">{formatBDT(product.discountPrice)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCheckout();
                    }}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>এখনই আনলক করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
