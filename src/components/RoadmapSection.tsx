'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Zap
} from 'lucide-react';

const roadmapPhases = [
  {
    phase: 'Phase 1',
    weeks: 'সপ্তাহ ১ - ৪ (দিন ১ - ২৮)',
    title: 'কনসেপ্ট বিল্ডিং ও বেসিক মাস্টারি',
    badge: 'মৌলিক ভিত্তি',
    color: 'from-indigo-600 to-purple-600',
    glow: 'shadow-indigo-500/25',
    borderColor: 'border-indigo-500/40',
    description: 'প্রতিটি অধ্যায়ের কোর থিওরি ও টেক্সটবুক উদাহরণ আয়ত্ত করা।',
    tasks: [
      'প্রতিদিন ৩–৩.৫ ঘণ্টা ফোকাসড স্টাডি ব্লক (বিষয় অনুযায়ী ভাগ)',
      'থিওরি শেখার পর পরই ১০–১৫টি বেসিক ও মিডিয়াম MCQ প্র্যাকটিস',
      'প্রতিটি নতুন অধ্যায় শুরুর আগে পূর্ববর্তী অধ্যায়ের ফর্মুলা শিট রিভিশন',
      'প্রতি শুক্রবার উইকলি মিক্সড রিভিশন (৪–৫ ঘণ্টা) ও সেলফ-টেস্ট'
    ]
  },
  {
    phase: 'Phase 2',
    weeks: 'সপ্তাহ ৫ - ৮ (দিন ২৯ - ৫৬)',
    title: 'টপিক প্র্যাকটিস ও প্রশ্নব্যাংক ড্রিলিং',
    badge: 'গতি ও নির্ভুলতা',
    color: 'from-emerald-600 to-teal-600',
    glow: 'shadow-emerald-500/25',
    borderColor: 'border-emerald-500/40',
    description: 'বোর্ড ও অ্যাডমিশন লেভেলের স্ট্যান্ডার্ড প্রশ্ন সমাধান।',
    tasks: [
      'প্রতিদিন অধ্যায়ভিত্তিক ২০–২৫টি অ্যাডমিশন লেভেলের MCQ ও CQ প্র্যাকটিস',
      'প্রথম মাসের অধ্যায়গুলোর নিজস্ব নোট স্পেসড রিভিশন',
      '৪০–৫০ মিনিটের টাইমড সেশন দিয়ে পরীক্ষার গতির সাথে প্রস্তুত হওয়া',
      'ভুল হওয়া প্রশ্নগুলো সাথে সাথে মিস্টেক নোটবুকে এন্ট্রি করা'
    ]
  },
  {
    phase: 'Phase 3',
    weeks: 'সপ্তাহ ৯ - ১০ (দিন ৫৭ - ৭০)',
    title: 'বিশ্ববিদ্যালয় PYQ অ্যানালাইসিস',
    badge: 'ভার্সিটি টার্গেট',
    color: 'from-amber-600 to-orange-600',
    glow: 'shadow-amber-500/25',
    borderColor: 'border-amber-500/40',
    description: 'বুয়েট, সিকেরুয়েট ও আইইউটির বিগত বছরের প্রশ্ন সমাধান।',
    tasks: [
      'BUET, CUET, RUET, KUET ও IUT-এর বিগত ১৫ বছরের প্রশ্ন সমাধান',
      'প্রতি অধ্যায়ে ১৫–২০টি বিগত বছরের কঠিন প্রশ্ন সমাধান ও শর্টকাট',
      'মিস্টেক নোটবুক থেকে দুর্বল অধ্যায়গুলো পুনরায় ঝালাই করা',
      'সপ্তাহ ৯ ও ১০-এ ৫০ প্রশ্নের পূর্ণাঙ্গ আগের বছরের প্রশ্ন সেট পরীক্ষা'
    ]
  },
  {
    phase: 'Phase 4',
    weeks: 'সপ্তাহ ১১ - ১২ (দিন ৭১ - ৮৪)',
    title: 'ফুল মক টেস্ট ও চূড়ান্ত রিভিশন',
    badge: 'চূড়ান্ত প্রস্তুতি',
    color: 'from-rose-600 to-pink-600',
    glow: 'shadow-rose-500/25',
    borderColor: 'border-rose-500/40',
    description: 'আসল পরীক্ষার পরিবেশে ৩ ঘণ্টার রিটেন ও এমসিকিউ মক টেস্ট।',
    tasks: [
      'BUET ফরম্যাটে ৩ ঘণ্টার ৬০০ মার্কের রিটেন ফুল মক টেস্ট',
      'CKRUET ফরম্যাটে ১০০ MCQ (৫০০ মার্কস) ২.৫ ঘণ্টার পূর্ণাঙ্গ মক টেস্ট',
      'IUT ফরম্যাটে ১০০ MCQ (Math 35, Physics 35, Chem 15, English 15) টেস্ট',
      'একই দিনে টেস্টের প্রতিটি ভুল উত্তরের রুট কজ বিশ্লেষণ ও সমাধান'
    ]
  }
];

interface RoadmapSectionProps {
  onOpenCheckout: () => void;
}

export default function RoadmapSection({ onOpenCheckout }: RoadmapSectionProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const currentPhase = roadmapPhases[activePhaseIndex];

  return (
    <section id="roadmap" className="py-16 sm:py-28 px-3 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>৩ মাসের ১২ সপ্তাহের দিনভিত্তিক স্টাডি প্ল্যান (৮৪ দিন)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            প্রতিদিনের প্রস্তুতি সাজানো <span className="text-gradient-emerald">৪টি সুনির্দিষ্ট ধাপে</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            কোন দিন কোন বিষয়ের কোন অধ্যায় পড়বেন এবং কতগুলো প্রশ্ন প্র্যাকটিস করবেন—তার সম্পূর্ণ রোডম্যাপ:
          </p>
        </div>

        {/* 3D Phase Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {roadmapPhases.map((p, idx) => {
            const isSelected = activePhaseIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? `bg-gradient-to-br ${p.color} text-white shadow-2xl ${p.glow} border-white/30 -translate-y-1.5`
                    : 'bg-slate-900/70 border-white/10 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-extrabold uppercase">{p.phase}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white font-bold backdrop-blur-sm">
                    {p.badge}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white leading-normal pt-0.5 pb-0.5">{p.title}</h4>
                <span className="text-xs text-slate-200/90 mt-2 font-mono font-medium">{p.weeks}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed 3D Phase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase.phase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl p-6 sm:p-10 bg-slate-900/90 border ${currentPhase.borderColor} backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-extrabold uppercase tracking-wider block mb-1">
                  {currentPhase.weeks}
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-normal pt-0.5 pb-0.5">
                  {currentPhase.title}
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-semibold text-slate-300">
                {currentPhase.description}
              </span>
            </div>

            {/* Tasks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 pt-1">
              {currentPhase.tasks.map((task, tIdx) => (
                <div
                  key={tIdx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-slate-200 hover:border-slate-700 transition-colors shadow-inner"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed font-medium">{task}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
