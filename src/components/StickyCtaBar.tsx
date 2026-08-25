'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Download, Sparkles } from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { SingleProductConfig } from '@/types';

interface StickyCtaBarProps {
  onOpenCheckout: () => void;
  product?: SingleProductConfig;
}

export default function StickyCtaBar({ onOpenCheckout, product }: StickyCtaBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const discountPrice = product?.discountPrice || 499;
  const originalPrice = product?.originalPrice || 999;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-2.5 sm:bottom-5 left-2.5 right-2.5 sm:left-6 sm:right-6 z-40 max-w-2xl mx-auto pointer-events-auto"
        >
          <div className="p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-[#0c1220] sm:bg-[#0c1220]/95 border border-emerald-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Download Badge & Price Info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono tracking-tight leading-none">
                    {formatBDT(discountPrice)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through font-mono leading-none">
                    {formatBDT(originalPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate">
                    ৫০ অধ্যায় + ৮৪ দিনের প্ল্যান
                  </p>
                </div>
              </div>
            </div>

            {/* Right: High-Converting Shimmer CTA Button */}
            <button
              onClick={onOpenCheckout}
              className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300 animate-bounce flex-shrink-0" />
              <span>এখনই সংগ্রহ করুন</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
