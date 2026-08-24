'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle,
  XCircle,
  Layers,
  ArrowRight,
  Filter,
  Zap,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';
import { ChapterData } from '@/types';

interface ChapterAnalyzerProps {
  chapters: ChapterData[];
  onOpenCheckout: () => void;
}

export default function ChapterAnalyzer({ chapters, onOpenCheckout }: ChapterAnalyzerProps) {
  const [selectedSubject, setSelectedSubject] = useState<
    'physics-1' | 'physics-2' | 'chem-1' | 'chem-2' | 'math-1' | 'math-2'
  >('physics-1');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3'>('all');

  const subjectOptions = [
    { id: 'physics-1', label: 'পদার্থবিজ্ঞান ১ম পত্র', short: 'Physics 1st', icon: '⚡' },
    { id: 'physics-2', label: 'পদার্থবিজ্ঞান ২য় পত্র', short: 'Physics 2nd', icon: '⚡' },
    { id: 'chem-1', label: 'রসায়ন ১ম পত্র', short: 'Chemistry 1st', icon: '🧪' },
    { id: 'chem-2', label: 'রসায়ন ২য় পত্র', short: 'Chemistry 2nd', icon: '🧪' },
    { id: 'math-1', label: 'উচ্চতর গণিত ১ম পত্র', short: 'Math 1st', icon: '📐' },
    { id: 'math-2', label: 'উচ্চতর গণিত ২য় পত্র', short: 'Math 2nd', icon: '📐' },
  ];

  const filteredChapters = chapters.filter((ch) => {
    if (ch.subject !== selectedSubject) return false;
    if (ratingFilter !== 'all' && ch.rating !== Number(ratingFilter)) return false;
    return true;
  });

  return (
    <section id="chapter-matrix" className="py-16 sm:py-28 px-3 sm:px-6 relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-indigo-600/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>৫০টি অধ্যায়ের সম্পূর্ণ অগ্রাধিকার বিশ্লেষণ</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            অধ্যায়ভিত্তিক <span className="text-gradient-purple">গুরুত্ব ও স্কিপ-লিস্ট</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            কোন অধ্যায় থেকে বুয়েট এবং অন্যান্য ইঞ্জিনিয়ারিংয়ে প্রশ্ন আসে আর কোন অপ্রয়োজনীয় অংশ বাদ দেবেন তা নিচে লাইভ চেক করুন:
          </p>
        </div>

        {/* 3D Subject Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 mb-8">
          {subjectOptions.map((subj) => {
            const isSelected = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id as any)}
                className={`p-3 sm:p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 text-left flex flex-col justify-between border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-slate-900/90 text-white border-indigo-400 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-400 -translate-y-1'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-slate-700 hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400" />
                )}
                <span className="text-base sm:text-lg mb-1">{subj.icon}</span>
                <span className="leading-normal text-xs sm:text-sm font-extrabold">{subj.label}</span>
              </button>
            );
          })}
        </div>

        {/* Rating Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl mb-8 shadow-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> প্রায়োরিটি ফিল্টার:
            </span>
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                ratingFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              সবগুলো অধ্যায়
            </button>
            <button
              onClick={() => setRatingFilter('5')}
              className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                ratingFilter === '5' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ★★★★★ মাস্ট স্টাডি
            </button>
            <button
              onClick={() => setRatingFilter('4')}
              className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                ratingFilter === '4' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ★★★★ গুরুত্বপূর্ণ
            </button>
            <button
              onClick={() => setRatingFilter('3')}
              className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                ratingFilter === '3' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ★★★ স্কিপ যোগ্য
            </button>
          </div>

          <span className="text-xs text-slate-300 font-medium">
            ফিল্টার রেজাল্ট: <strong className="text-amber-400 font-mono text-sm">{filteredChapters.length}</strong> টি অধ্যায়
          </span>
        </div>

        {/* 3D Chapters Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 mb-10 sm:mb-16">
          <AnimatePresence mode="popLayout">
            {filteredChapters.map((ch, idx) => {
              const is5Star = ch.rating === 5;
              const is3Star = ch.rating <= 3;

              return (
                <motion.div
                  key={ch.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl p-5 sm:p-7 border backdrop-blur-2xl transition-all flex flex-col justify-between relative overflow-hidden group shadow-2xl ${
                    is5Star
                      ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400/80 shadow-amber-500/5'
                      : is3Star
                      ? 'bg-slate-900/70 border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/5'
                      : 'bg-slate-900/80 border-white/10 hover:border-indigo-500/60 shadow-indigo-500/5'
                  }`}
                >
                  <div>
                    {/* Header with Badges */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700">
                            অধ্যায় {ch.chapterNumber}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            {[...Array(ch.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="ml-1 text-[11px] text-amber-200">
                              {ch.rating === 5 ? '(Must-Study)' : ch.rating === 4 ? '(Important)' : '(Safe to Skip)'}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-normal pt-0.5 pb-0.5 group-hover:text-indigo-300 transition-colors">
                          {ch.chapterName}
                        </h3>
                      </div>
                    </div>

                    {/* Question Trend & University Importance Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                          🏛️ BUET Written গুরুত্ব
                        </span>
                        <p className="text-indigo-300 font-medium leading-relaxed">{ch.buetImportance}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                          🎓 CKRUET / IUT / DU 'A' গুরুত্ব
                        </span>
                        <p className="text-emerald-300 font-medium leading-relaxed">{ch.otherUniImportance}</p>
                      </div>
                    </div>

                    {/* Previous Frequency */}
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 mb-4">
                      <strong className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                        📊 বিগত বছরের প্রশ্ন ট্রেন্ড:
                      </strong>
                      <span className="leading-relaxed font-medium">{ch.prevFreq}</span>
                    </div>

                    {/* What to Study */}
                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>কী কী টপিক পড়তে হবে (Key Topics):</span>
                      </div>
                      <p className="text-slate-200 pl-5 leading-relaxed font-medium">{ch.whatToStudy}</p>
                    </div>

                    {/* What to Skip */}
                    <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1 text-xs">
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        <span>কী কী বাদ দেবেন (What Can Be Skipped):</span>
                      </div>
                      <p className="text-rose-200/90 pl-5 leading-relaxed font-medium">{ch.whatToSkip}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 3D Bottom Conversion Banner */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-emerald-950/60 via-indigo-950/60 to-slate-950 border border-emerald-500/40 backdrop-blur-2xl text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-normal pt-0.5 pb-0.5">
            সম্পূর্ণ ৫০টি অধ্যায়ের বিশ্লেষণ ও ১২ সপ্তাহের রুটিন একসাথে পেতে চান?
          </h3>
          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            আমাদের পূর্ণাঙ্গ মাস্টার গাইডে রয়েছে সব বিষয়ের পূর্ণাঙ্গ প্রায়োরিটি টেবিল, ডেইলি টাইমটেবিল ও স্পেসড রিভিশন ফর্মুলা।
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/30 inline-flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>এক ক্লিকে সম্পূর্ণ মাস্টার গাইড PDF সংগ্রহ করুন</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
