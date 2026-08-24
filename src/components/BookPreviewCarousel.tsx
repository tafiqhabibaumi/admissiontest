'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Download,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';

const previewSlides = [
  {
    id: 'slide-1',
    sheetNo: 'পৃষ্ঠা ১-৬',
    title: '📘 Priority & Topic Analysis (৫০টি অধ্যায়ের বিশ্লেষণ)',
    subtitle: 'স্টার কি: ★★★★★ = must-study | ★★★★ = important | ★★★ = low priority / safe to skip',
    previewContent: {
      type: 'table',
      headers: ['Ch', 'অধ্যায় / বিষয়', 'রেটিং', 'BUET গুরুত্ব', 'অন্যান্য Uni', 'কী কী পড়বেন', 'কী কী বাদ দেবেন'],
      rows: [
        ['২', 'ভেক্টর (Vectors)', '★★★★★', 'Very High', 'High across MCQs', 'Dot/Cross, Resolution, River-Boat', 'Theoretical vector-space proofs'],
        ['৩', 'নিউটনীয় বলবিদ্যা', '★★★★★', 'Very High', 'Very High Everywhere', '3 Laws, Friction, Banking, Collisions', 'Nothing — সম্পূর্ণ পড়তে হবে'],
        ['৪', 'কাজ, ক্ষমতা ও শক্তি', '★★★★★', 'Very High', 'Very High Everywhere', 'Work-Energy Theorem, Spring PE', 'Nothing significant to skip'],
        ['২', 'জৈব রসায়ন (Organic)', '★★★★★', 'Very High (২৫%)', 'Very High Everywhere', 'IUPAC, Isomerism, Named Reactions', 'Nothing — সম্পূর্ণ মেকানিজম সহ'],
        ['৯', 'অন্তরীকরণ (Differentiation)', '★★★★★', 'Very High', 'Very High Everywhere', 'Chain rule, Maxima-Minima, Tangent', 'Nothing — ১০০% আয়ত্ত করতে হবে'],
        ['১', 'ভৌত জগৎ ও পরিমাপ', '★★★', 'Rarely asked', 'Moderate in MCQ', 'Dimensional analysis, Significant figures', 'History/philosophy portions']
      ]
    }
  },
  {
    id: 'slide-2',
    sheetNo: 'পৃষ্ঠা ৭-১২',
    title: '📅 3-Month Day-by-Day Study Plan (১২ সপ্তাহের দিনভিত্তিক প্ল্যান)',
    subtitle: 'Phase 1: Concept Building ➔ Phase 2: Question Bank ➔ Phase 3: PYQ ➔ Phase 4: Full Mock',
    previewContent: {
      type: 'schedule',
      items: [
        { day: 'Day 1', date: 'সপ্তাহ ১ (শনিবার)', subject: '📘 Physics 1st Paper', task: 'ভেক্টর — থিওরি + উদাহরণ', duration: '৩-৩.৫ ঘণ্টা', practice: '১০-১৫টি MCQ' },
        { day: 'Day 2', date: 'সপ্তাহ ১ (রবিবার)', subject: '🧪 Chemistry 1st Paper', task: 'গুণগত রসায়ন — কোয়ান্টাম ও ইলেকট্রন বিন্যাস', duration: '৩-৩.৫ ঘণ্টা', practice: '১০-১৫টি MCQ' },
        { day: 'Day 3', date: 'সপ্তাহ ১ (সোমবার)', subject: '📐 Higher Math 1st Paper', task: 'ভেক্টর — ডট/ক্রস ও রেখা/সমতল', duration: '৩-৩.৫ ঘণ্টা', practice: '১০-১৫টি MCQ' },
        { day: 'Day 7', date: 'সপ্তাহ ১ (শুক্রবার)', subject: '🔁 All Subjects (Revision)', task: 'সাপ্তাহিক রিভিশন + মিস্টেক নোটবুক আপডেট', duration: '৪-৫ ঘণ্টা', practice: '২০-৩০টি মিশ্র MCQ' },
        { day: 'Day 71', date: 'সপ্তাহ ১১ (ফুল মক)', subject: '🏆 BUET Module A Mock', task: '৬০০ মার্কের ৩ ঘণ্টার রিটেন মক টেস্ট', duration: '৩ ঘণ্টা', practice: 'রুট কজ অ্যানালাইসিস' }
      ]
    }
  },
  {
    id: 'slide-3',
    sheetNo: 'পৃষ্ঠা ১৩-১৪',
    title: '⏰ দৈনিক রুটিন (৩ মাসের জন্য টেকসই)',
    subtitle: '৬টি হাই-ফোকাস পড়ার ব্লক + শুক্রবার উইকলি রিকভারি প্রটোকল',
    previewContent: {
      type: 'routine',
      blocks: [
        { time: 'সকাল ৬:৩০ - ৮:০০', block: '📘 বিষয় A — মূল পড়াশোনা ব্লক (১.৫ ঘণ্টা)', desc: 'সতেজ মস্তিষ্ক = নতুন অধ্যায়ের সবচেয়ে কঠিন কনসেপ্ট শেখার সেরা সময়' },
        { time: 'সকাল ৮:৩০ - ১০:০০', block: '📘 বিষয় A চলমান — সমাধানকৃত উদাহরণ + ১০-১৫ MCQ', desc: 'শেখা থিওরি তাজা থাকতেই সরাসরি প্রশ্নে প্রয়োগ' },
        { time: 'সকাল ১০:১৫ - ১১:৪৫', block: '🧪/📐 বিষয় B — প্রশ্নব্যাংক অনুশীলন ব্লক', desc: 'ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্নে সচেতন অনুশীলন' },
        { time: 'দুপুর ২:০০ - ৩:৩০', block: '🔁 ৩য় ব্লক — আগের সপ্তাহের স্পেসড রিভিশন', desc: 'স্পেসড রিভিশনই পড়াকে লং-টার্ম মেমোরিতে লক করে' },
        { time: 'রাত ১১:০০ - সকাল ৬:০০', block: '🛌 ৭ ঘণ্টা বাধ্যতামূলক ঘুম', desc: 'বার্নআউট এড়ানো ও মেমোরি কনসোলিডেশনের জন্য অপরিহার্য' }
      ]
    }
  },
  {
    id: 'slide-4',
    sheetNo: 'পৃষ্ঠা ২০-২২',
    title: '📝 Revision & Mistake Tracker (স্পেসড রিভিশন ক্যালেন্ডার)',
    subtitle: 'Target Revision Dates: 1st Revision = +7 days | 2nd Revision = +21 days',
    previewContent: {
      type: 'tracker',
      entries: [
        { topic: 'ভেক্টর (Vectors)', first: 'Day 1', rev1: '+৭ দিন (Day 8)', rev2: '+২১ দিন (Day 22)', status: 'Active Tracker' },
        { topic: 'গুণগত রসায়ন', first: 'Day 2', rev1: '+৭ দিন (Day 9)', rev2: '+২১ দিন (Day 23)', status: 'Active Tracker' },
        { topic: 'চল তড়িৎ (Current Electricity)', first: 'Day 4', rev1: '+৭ দিন (Day 11)', rev2: '+২১ দিন (Day 25)', status: 'Active Tracker' },
        { topic: 'জৈব রসায়ন (Organic Chemistry)', first: 'Day 5', rev1: '+৭ দিন (Day 12)', rev2: '+২১ দিন (Day 26)', status: 'Active Tracker' },
        { topic: 'জটিল সংখ্যা (Complex Number)', first: 'Day 6', rev1: '+৭ দিন (Day 13)', rev2: '+২১ দিন (Day 27)', status: 'Active Tracker' }
      ]
    }
  }
];

interface BookPreviewCarouselProps {
  onOpenCheckout: () => void;
}

export default function BookPreviewCarousel({ onOpenCheckout }: BookPreviewCarouselProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = previewSlides[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % previewSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + previewSlides.length) % previewSlides.length);
  };

  return (
    <section className="py-16 sm:py-28 px-3 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>পিডিএফ পেজ প্রিভিউ (Look Inside)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            মাস্টার গাইডের <span className="text-gradient-purple">ভেতরের পাতাগুলো দেখুন</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            ২২ পৃষ্ঠার পূর্ণাঙ্গ গাইডে যেভাবে সাজানো রয়েছে অধ্যায় প্রায়োরিটি, ডেলি রুটিন ও রিভিশন ট্র্যাকার:
          </p>
        </div>

        {/* 3D Interactive Carousel Frame */}
        <div className="relative rounded-3xl bg-slate-900/90 border border-indigo-500/40 p-5 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar of Viewer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 sm:pb-6 mb-5 sm:mb-7">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs sm:text-sm font-mono font-bold">
                {slide.sheetNo}
              </span>
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white leading-normal pt-0.5 pb-0.5">{slide.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">{slide.subtitle}</p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 shadow"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-300 px-2 py-1 rounded-lg bg-slate-950/80 border border-white/10">
                {currentSlideIndex + 1} / {previewSlides.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 shadow"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {slide.previewContent.type === 'table' && (
            <p className="text-[11px] text-indigo-400 block sm:hidden mb-2 text-right">
              👉 ডানে স্ক্রোল করে টেবিল দেখুন
            </p>
          )}

          {/* Dynamic Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-950/95 rounded-2xl border border-white/10 p-4 sm:p-6 overflow-x-auto min-h-[280px] shadow-inner"
            >
              {/* Type 1: Table */}
              {slide.previewContent.type === 'table' && (
                <table className="w-full text-left text-xs min-w-[680px]">
                  <thead className="border-b border-slate-800 text-slate-300 font-bold bg-slate-900/60">
                    <tr>
                      {slide.previewContent.headers?.map((h, i) => (
                        <th key={i} className="p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {slide.previewContent.rows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-3 ${
                              cIdx === 2
                                ? 'text-amber-400 font-mono font-bold'
                                : cIdx === 6
                                ? 'text-rose-400 font-medium'
                                : 'text-slate-200'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Type 2: Schedule */}
              {slide.previewContent.type === 'schedule' && (
                <div className="space-y-2.5">
                  {slide.previewContent.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-amber-400 bg-black/50 px-2.5 py-1 rounded-lg border border-amber-500/30 text-xs">
                          {item.day}
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs sm:text-sm leading-normal">{item.task}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{item.subject} • {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300 text-xs">
                        <span className="text-emerald-400 font-bold">⏱️ {item.duration}</span>
                        <span className="text-indigo-300 font-medium">🎯 {item.practice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 3: Routine */}
              {slide.previewContent.type === 'routine' && (
                <div className="space-y-2.5">
                  {slide.previewContent.blocks?.map((blk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-400 text-xs block mb-0.5">{blk.time}</span>
                        <h4 className="font-extrabold text-white text-xs sm:text-sm leading-normal">{blk.block}</h4>
                      </div>
                      <p className="text-slate-300 text-xs sm:max-w-md leading-relaxed font-medium">{blk.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 4: Tracker */}
              {slide.previewContent.type === 'tracker' && (
                <div className="space-y-2.5">
                  {slide.previewContent.entries?.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs items-center hover:border-slate-700 transition-colors"
                    >
                      <span className="font-bold text-white col-span-2 sm:col-span-1 leading-normal text-xs sm:text-sm">{entry.topic}</span>
                      <span className="text-slate-400 text-xs">1st: <strong className="text-slate-200">{entry.first}</strong></span>
                      <span className="text-emerald-400 text-xs font-semibold">Rev 1: {entry.rev1}</span>
                      <span className="text-amber-400 text-xs font-semibold">Rev 2: {entry.rev2}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA within Viewer */}
          <div className="mt-5 sm:mt-7 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300 text-center sm:text-left font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>২২ পৃষ্ঠার সম্পূর্ণ রঙিন মোবাইল ও প্রিন্ট ফ্রেন্ডলি ফাইল (PDF)</span>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ২২ পৃষ্ঠার PDF সংগ্রহ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
