'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react';

const mockSales = [
  { name: 'তানভীর আহমেদ', city: 'ঢাকা (নটর ডেম কলেজ)', package: 'বুয়েট ড্রিমার সাজেশন', time: '১ মিনিট আগে' },
  { name: 'নাফিসা তাসনিম', city: 'চট্টগ্রাম (সিলেট ক্যাডেট)', package: 'অল ইঞ্জিনিয়ারিং মেগা কম্বো', time: '৩ মিনিট আগে' },
  { name: 'আব্দুল্লাহ আল নোমান', city: 'রাজশাহী (রাজশাহী কলেজ)', package: 'বুয়েট ড্রিমার সাজেশন', time: '৫ মিনিট আগে' },
  { name: 'সাদিয়া ইসলাম', city: 'খুলনা', package: 'অল ইঞ্জিনিয়ারিং মেগা কম্বো', time: '৮ মিনিট আগে' },
  { name: 'মাহির ফয়সাল', city: 'ময়মনসিংহ (আনন্দ মোহন)', package: 'ঢাকা বিশ্ববিদ্যালয় A-Unit', time: '১১ মিনিট আগে' },
  { name: 'রাকিবুল হাসান', city: 'কুমিল্লা (ভিক্টোরিয়া কলেজ)', package: 'অল ইঞ্জিনিয়ারিং মেগা কম্বো', time: '১৪ মিনিট আগে' },
];

export default function LiveSalesTicker() {
  const [currentSale, setCurrentSale] = useState<typeof mockSales[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentSale(mockSales[index]);
      setVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);

      index = (index + 1) % mockSales.length;
    }, 14000);

    // Initial show after 4 seconds
    const timeout = setTimeout(() => {
      setCurrentSale(mockSales[0]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!currentSale) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm pointer-events-none md:bottom-6">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto flex items-center gap-3 p-3 bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-xl shadow-2xl shadow-indigo-950/50 text-white"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                <span>{currentSale.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({currentSale.city})</span>
              </div>
              <p className="text-emerald-400 font-medium mt-0.5">
                সংগ্রহ করেছেন: <span className="text-white font-semibold">{currentSale.package}</span>
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ভেরিফাইড অর্ডার
                </span>
                <span>•</span>
                <span>{currentSale.time}</span>
              </div>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
