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
      setShow(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const price = product?.discountPrice || 499;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-3 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6 z-40 max-w-4xl mx-auto"
        >
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-2xl font-black text-white font-mono">
                    {formatBDT(price)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-emerald-300 font-bold bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    ৫০টি অধ্যায় + ১২ সপ্তাহের রুটিন
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium hidden sm:block">
                  ইনস্ট্যান্ট ডাউনলোড + ইমেইল ব্যাকআপ
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl shimmer-button text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all flex-shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
              <span>এখনই সংগ্রহ করুন</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
