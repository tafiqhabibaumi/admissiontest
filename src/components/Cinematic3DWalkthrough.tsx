'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Zap,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Layers,
  Calendar,
  Calculator,
  Flame,
  Atom,
  Check,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface Cinematic3DWalkthroughProps {
  onOpenCheckout: () => void;
}

const scenes = [
  {
    id: 'scene-1',
    sceneNumber: '০১',
    shortTab: 'অধ্যায় প্রায়োরিটি',
    tabTag: '২৪টি Must-Study',
    title: '৫০টি অধ্যায়ের সম্পূর্ণ প্রায়োরিটি ও স্কিপ ম্যাট্রিক্স',
    subtitle: 'High-Yield Chapter Priority & Skip System',
    description: 'বুয়েট, সিকেরুয়েট ও ঢাবি ‘ক’ ইউনিটের বিগত ২০ বছরের প্রশ্ন অ্যানালাইসিস করে ৫০টি অধ্যায়কে সুনির্দিষ্ট স্টার রেটিং ও গুরুত্বে সাজানো হয়েছে—যাতে অপ্রয়োজনীয় চ্যাপ্টারে সময় নষ্ট না হয়।',
    accentGradient: 'from-emerald-500 via-teal-500 to-indigo-600',
    type: 'priority-matrix',
    stats: [
      { label: 'মাস্ট-স্টাডি অধ্যায়', value: '২৪টি', color: 'text-amber-400' },
      { label: 'গুরুত্বপূর্ণ অধ্যায়', value: '১৮টি', color: 'text-emerald-400' },
      { label: 'স্কিপযোগ্য অংশ', value: '৮টি', color: 'text-rose-400' },
    ],
    items: [
      { name: 'ভেক্টর (Vectors)', rating: 5, uni: 'BUET & CKRUET', note: 'ডট/ক্রস, নদী-নৌকা ও লব্ধি', isMust: true },
      { name: 'নিউটনীয় বলবিদ্যা', rating: 5, uni: 'BUET Written', note: 'ঘর্ষণ, ব্যাংকিং ও সংঘর্ষ', isMust: true },
      { name: 'জৈব রসায়ন (Organic)', rating: 5, uni: '২৫% প্রশ্ন কভার', note: 'আইসোমারিজম ও বিক্রিয়া ট্রিক্স', isMust: true },
      { name: 'অন্তরীকরণ ও যোগজীকরণ', rating: 5, uni: 'All Universities', note: 'চেইন রুল, স্পর্শক ও ক্ষেত্রফল', isMust: true },
      { name: 'ভৌত জগৎ ও পরিমাপ', rating: 3, uni: 'Low Yield', note: 'মাত্রাগত সমীকরণ বাদে বাকি বাদ', isMust: false },
    ]
  },
  {
    id: 'scene-2',
    sceneNumber: '০২',
    shortTab: 'শর্টকাট ও ট্রিক্স',
    tabTag: '৫০+ টেকনিক',
    title: 'ক্যালকুলেটর শর্টকাট ও সুপারফাস্ট এক্সাম ট্রিক্স',
    subtitle: 'Speed Solving & Calculator Hacks Vault',
    description: 'এডমিশন পরীক্ষায় প্রতি মিনিটে একাধিক অংক নির্ভুলভাবে করার জন্য ক্যালকুলেটর শর্টকাট, অপশন এলিমিনেশন টেকনিক এবং জৈব বিক্রিয়ার মেকানিজম মনে রাখার স্পেশাল ফর্মুলা।',
    accentGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    type: 'shortcuts-vault',
    stats: [
      { label: 'ক্যালকুলেটর হ্যাকস', value: '৫০+ ট্রিক্স', color: 'text-indigo-400' },
      { label: 'সময় বাঁচবে', value: '১৫-২০ সেকেন্ড', color: 'text-emerald-400' },
      { label: 'কমন প্রশ্ন ফাঁদ', value: '১০০+ অ্যালার্ট', color: 'text-amber-400' },
    ],
    shortcuts: [
      { title: 'দ্বিঘাত ও ত্রিঘাত সমীকরণ সমাধান', desc: 'ক্যালকুলেটর মোড ৫ ব্যবহার করে মাত্র ৩ সেকেন্ডে মূল ও প্রকৃতি নির্ণয়', tag: 'Math' },
      { title: 'ভেক্টর ডট ও ক্রস গুণফল ডিরেক্ট ভ্যালু', desc: 'সরাসরি ভেক্টর মোডে মান ইনপুট দিয়ে লম্ব একক ভেক্টর ও কোণ বের করা', tag: 'Physics' },
      { title: 'জৈব বিক্রিয়ার উৎপাদ চেনার ফর্মুলা', desc: 'অ্যালডল, ক্যানিজারো ও গ্রিগনার্ড বিকারকের শর্ট রুলস টেকনিক', tag: 'Chemistry' },
      { title: 'ম্যাট্রিক্স ইনভার্স ও ডিটারমিন্যান্ট', desc: '৩×৩ ম্যাট্রিক্সের বিপরীত ম্যাট্রিক্স নির্ণয়ের শর্টকাট মেথড', tag: 'Math' },
    ]
  },
  {
    id: 'scene-3',
    sceneNumber: '০৩',
    shortTab: '৮৪ দিনের রুটিন',
    tabTag: '১২ সপ্তাহের প্ল্যান',
    title: '৮৪ দিনের সুনির্দিষ্ট স্টাডি প্ল্যান ও দৈনিক টাইম-ব্লক',
    subtitle: 'Precision Day-by-Day Roadmap & Spaced Revision',
    description: 'প্রতিদিন কোন বিষয়ের কোন অধ্যায় কত ঘণ্টা পড়বেন, কয়টি MCQ সমাধান করবেন এবং প্রতি শুক্রবারে কীভাবে স্পেসড রিভিশন (+৭ দিন ও +২১ দিন) দিয়ে পড়া দীর্ঘমেয়াদে মনে রাখবেন।',
    accentGradient: 'from-amber-500 via-orange-500 to-rose-600',
    type: 'routine-roadmap',
    stats: [
      { label: 'মোট দিন সংখ্যা', value: '৮৪ দিন', color: 'text-amber-400' },
      { label: 'দৈনিক পড়ার সেশন', value: '৬টি ব্লক', color: 'text-emerald-400' },
      { label: 'সাপ্তাহিক রিকভারি', value: 'শুক্রবার রিভিশন', color: 'text-indigo-400' },
    ],
    roadmapPhases: [
      { phase: 'সপ্তাহ ১-৪', title: 'মৌলিক কনসেপ্ট ও বেসিক MCQ', target: 'কোর ৫০ অধ্যায়ের ভিত্তি' },
      { phase: 'সপ্তাহ ৫-৮', title: 'কোশ্চেন ব্যাংক ও স্পিড ড্রিলিং', target: 'টাইমড প্র্যাকটিস ও গতি' },
      { phase: 'সপ্তাহ ৯-১০', title: 'বিগত ১৫ বছরের PYQ অ্যানালাইসিস', target: 'BUET, CKRUET, IUT PYQ' },
      { phase: 'সপ্তাহ ১১-১২', title: 'ফুল মক টেস্ট ও মিস্টেক লক', target: 'আসল পরীক্ষার চূড়ান্ত সিমুলেশন' },
    ]
  },
  {
    id: 'scene-4',
    sceneNumber: '০৪',
    shortTab: 'মক টেস্ট ও ট্র্যাকার',
    tabTag: 'টপারস ব্লুপ্রিন্ট',
    title: 'ফুল রিটেন মক টেস্ট পেপার ও মিস্টেক ট্র্যাকিং ভল্ট',
    subtitle: 'Full Mock Test Papers & Mistake Notebook',
    description: 'আসল ভর্তি পরীক্ষার পরিবেশে নিজেকে যাচাই করার জন্য পূর্ণাঙ্গ ৬০০ মার্কের বুয়েট রিটেন এবং ৫০০ মার্কের সিকেরুয়েট মডেল টেস্ট পেপার সাথে ভুল সমাধানের সেলফ-কারেকশন শিট।',
    accentGradient: 'from-teal-500 via-emerald-600 to-indigo-700',
    type: 'mock-vault',
    stats: [
      { label: 'বুয়েট রিটেন টেস্ট', value: '৬০০ মার্কস', color: 'text-emerald-400' },
      { label: 'ইঞ্জিনিয়ারিং গুচ্ছ', value: '১০০ MCQ', color: 'text-indigo-400' },
      { label: 'মিস্টেক ট্র্যাকার', value: 'অ্যাক্টিভ লগ', color: 'text-amber-400' },
    ],
    mockFeatures: [
      { title: 'BUET স্ট্যান্ডার্ড ৩ ঘণ্টার রিটেন মক', desc: 'পদার্থ, রসায়ন ও গণিতের জটিল CQ প্রশ্নের আসল পরীক্ষার ফরম্যাট' },
      { title: 'CKRUET আড়াই ঘণ্টার ১০০ MCQ মক', desc: 'নেগেটিভ মার্কিং সহ টাইম ম্যানেজমেন্ট ড্রিল' },
      { title: 'পার্সোনাল মিস্টেক লগ শিট', desc: 'যেসব প্রশ্নে ভুল হয় তা টুকে রেখে পরবর্তীতে পুনরাবৃত্তি ঠেকানোর পদ্ধতি' },
    ]
  }
];

export default function Cinematic3DWalkthrough({ onOpenCheckout }: Cinematic3DWalkthroughProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const currentScene = scenes[activeSceneIndex];

  // Lightweight 6-second auto-play timer (0 re-renders during playback)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPlaying, activeSceneIndex]);

  const handleSelectScene = (index: number) => {
    setActiveSceneIndex(index);
  };

  const handleNext = () => {
    setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
  };

  const handlePrev = () => {
    setActiveSceneIndex((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  return (
    <section className="py-16 sm:py-28 px-3 sm:px-6 relative overflow-hidden bg-[#07090e]">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-r from-emerald-600/10 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '7s' }} />
            <span>৩ডি ইন্টারঅ্যাক্টিভ শোকেস (Interactive Preview)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            মাস্টার গাইডের ভেতরে কী আছে? <br />
            <span className="text-gradient-purple">সরাসরি লাইভ প্রিভিউ দেখে নিন</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            নিচের ট্যাবগুলোতে ক্লিক করে বা প্লে বাটনে রেখে গাইডের প্রতিটি মূল ফিচার এক্সপ্লোর করুন:
          </p>
        </div>

        {/* 3D Glass Console Screen Container */}
        <div className="rounded-3xl bg-slate-950/85 border-2 border-indigo-500/30 p-4 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          {/* Top Console Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>মাস্টার গাইড শোকেস • পর্ব {currentScene.sceneNumber}/০৪</span>
              </span>
            </div>

            {/* Play/Pause & Step Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all shadow"
                aria-label={isPlaying ? 'Pause tour' : 'Play tour'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>পজ করুন</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>অটো প্লে</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 transition-colors"
                  aria-label="Previous scene"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 transition-colors"
                  aria-label="Next scene"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 Interactive Scrubber Tabs (Clean Bengali Labels with no overflow) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
            {scenes.map((s, idx) => {
              const isSelected = activeSceneIndex === idx;

              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectScene(idx)}
                  className={`p-3 sm:p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/95 border-indigo-400 text-white shadow-xl ring-1 ring-indigo-400 -translate-y-1'
                      : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {/* Subtle Top Active Progress Bar with CSS animation */}
                  {isSelected && isPlaying && (
                    <div
                      key={`progress-${activeSceneIndex}`}
                      className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-indigo-400 pointer-events-none animate-[progress_6.5s_linear_forwards]"
                      style={{ width: '100%' }}
                    />
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-extrabold text-indigo-400 uppercase">
                      দৃশ্য {s.sceneNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-emerald-300 border border-emerald-500/30">
                      {s.tabTag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-normal pt-0.5 pb-0.5">
                    {s.shortTab}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Main 3D Display Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-slate-950/90 rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl relative"
            >
              {/* Left Column: Description & Metric Counters */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {currentScene.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-normal pt-0.5 pb-0.5">
                    {currentScene.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">
                    {currentScene.description}
                  </p>
                </div>

                {/* 3 Metric Summary Boxes */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                  {currentScene.stats.map((st, sIdx) => (
                    <div key={sIdx} className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-center shadow-md">
                      <span className={`text-sm sm:text-xl font-black block font-mono ${st.color}`}>
                        {st.value}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenCheckout}
                    className="w-full sm:w-auto px-7 py-4 rounded-2xl shimmer-button text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                    <span>এখনই সম্পূর্ণ গাইডটি সংগ্রহ করুন • {formatBDT(499)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual High-Fidelity 3D Content Card (No Fake Code) */}
              <div className="lg:col-span-6 rounded-3xl p-4 sm:p-6 bg-slate-900/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                {/* 1. Type: Priority Matrix Showcase */}
                {currentScene.type === 'priority-matrix' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>অধ্যায় প্রায়োরিটি লাইভ নমুনা</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">৫-স্টার ও স্কিপ শিট</span>
                    </div>

                    <div className="space-y-2">
                      {currentScene.items?.map((item, i) => (
                        <div
                          key={i}
                          className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                            item.isMust
                              ? 'bg-slate-950/80 border-amber-500/30 hover:border-amber-400/60'
                              : 'bg-slate-950/50 border-rose-500/30 opacity-80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{item.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                item.isMust ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              }`}>
                                {item.isMust ? '★★★★★ Must Study' : '★★★ Safe to Skip'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.note}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 hidden sm:block">
                            {item.uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Type: Shortcuts & Hacks Showcase */}
                {currentScene.type === 'shortcuts-vault' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ক্যালকুলেটর ও শর্টকাট টেকনিক</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">১৫ সেকেন্ড মেথড</span>
                    </div>

                    <div className="space-y-2">
                      {currentScene.shortcuts?.map((sc, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 hover:border-indigo-500/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs flex items-center gap-1.5">
                              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>{sc.title}</span>
                            </span>
                            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                              {sc.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium pl-4">{sc.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Type: Routine & Roadmap Showcase */}
                {currentScene.type === 'routine-roadmap' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>১২ সপ্তাহের দিনভিত্তিক প্রগ্রেস</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">৮৪ দিনের প্ল্যান</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentScene.roadmapPhases?.map((rp, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 hover:border-amber-500/40 transition-colors">
                          <span className="text-[10px] font-mono font-extrabold text-amber-400 block">{rp.phase}</span>
                          <h4 className="font-bold text-white text-xs leading-normal">{rp.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{rp.target}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Type: Mock Test & Mistakes Showcase */}
                {currentScene.type === 'mock-vault' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-teal-400" />
                        <span>রিটেন ও MCQ ফুল মক পেপার</span>
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono font-bold">টপারস ব্লুপ্রিন্ট</span>
                    </div>

                    <div className="space-y-2.5">
                      {currentScene.mockFeatures?.map((mf, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 hover:border-teal-500/40 transition-colors">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                            <span className="font-bold text-white text-xs">{mf.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium pl-5">{mf.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer Badge */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> ১০০% নির্ভুল ও ভেরিফাইড গাইড
                  </span>
                  <span>ইনস্ট্যান্ট PDF ডাউনলোড</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
