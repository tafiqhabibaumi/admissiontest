'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Coffee,
  Brain,
  BookOpen,
  Sparkles,
  Zap,
  RotateCcw,
  BedDouble
} from 'lucide-react';

const regularRoutine = [
  {
    time: 'সকাল ৬:৩০ - ৮:০০',
    duration: '১.৫ ঘণ্টা',
    activity: '📘 বিষয় A — মূল পড়াশোনা ব্লক',
    purpose: 'নতুন অধ্যায়ের থিওরি ও কনসেপ্ট বিল্ডিং (সতেজ মস্তিষ্ক = কঠিন বিষয় পড়ার সেরা সময়)',
    icon: Brain,
    badge: 'হাই-ফোকাস',
    color: 'text-indigo-400 bg-indigo-950/50 border-indigo-500/30'
  },
  {
    time: 'সকাল ৮:৩০ - ১০:০০',
    duration: '১.৫ ঘণ্টা',
    activity: '📘 বিষয় A চলমান — সমাধানকৃত উদাহরণ + ১০–১৫টি MCQ',
    purpose: 'শেখা থিওরি তাজা থাকতেই সরাসরি প্রশ্নে প্রয়োগ',
    icon: Zap,
    badge: 'অ্যাপ্লিকেশন',
    color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
  },
  {
    time: 'সকাল ১০:১৫ - ১১:৪৫',
    duration: '১.৫ ঘণ্টা',
    activity: '🧪/📐 বিষয় B — প্রশ্নব্যাংক অনুশীলন ব্লক',
    purpose: 'ভর্তি পরীক্ষার মানের প্রশ্নে সচেতন অনুশীলন',
    icon: BookOpen,
    badge: 'কোশ্চেন ব্যাংক',
    color: 'text-sky-400 bg-sky-950/50 border-sky-500/30'
  },
  {
    time: 'দুপুর ২:০০ - ৩:৩০',
    duration: '১.৫ ঘণ্টা',
    activity: '🔁 ৩য় ব্লক — আগের সপ্তাহের অধ্যায়ের স্পেসড রিভিশন',
    purpose: 'স্পেসড রিভিশনই পড়াকে দীর্ঘমেয়াদী স্মৃতিতে নিয়ে যায়',
    icon: RotateCcw,
    badge: 'স্পেসড রিভিশন',
    color: 'text-amber-400 bg-amber-950/50 border-amber-500/30'
  },
  {
    time: 'বিকাল ৪:০০ - ৫:৩০',
    duration: '১.৫ ঘণ্টা',
    activity: '📐 ৪র্থ ব্লক — মিশ্র সমস্যা সমাধান অনুশীলন',
    purpose: 'ক্যালকুলেটর শর্টকাট ও টাইমিং প্র্যাকটিস',
    icon: Sparkles,
    badge: 'মিক্সড প্র্যাকটিস',
    color: 'text-purple-400 bg-purple-950/50 border-purple-500/30'
  },
  {
    time: 'সন্ধ্যা ৭:০০ - ৮:৩০',
    duration: '১.৫ ঘণ্টা',
    activity: '🧪 ৫ম ব্লক — প্রশ্নব্যাংক ও ভুল-নোটবুক রিভিউ',
    purpose: 'দুর্বলতা চিহ্নিত করা ও সংশোধন',
    icon: CheckCircle2,
    badge: 'মিস্টেক রিভিউ',
    color: 'text-rose-400 bg-rose-950/50 border-rose-500/30'
  },
  {
    time: 'রাত ৯:০০ - ১০:০০',
    duration: '১ ঘণ্টা',
    activity: '🌙 ৬ষ্ঠ ব্লক — হালকা রিভিশন (ফর্মুলা শিট)',
    purpose: 'ঘুমানোর আগে হালকা কনসোলিডেশন',
    icon: Moon,
    badge: 'ফর্মুলা শিট',
    color: 'text-blue-400 bg-blue-950/50 border-blue-500/30'
  },
  {
    time: 'রাত ১১:০০ - সকাল ৬:০০',
    duration: '৭ ঘণ্টা',
    activity: '🛌 সম্পূর্ণ ঘুম ও স্মৃতি সংরক্ষণ',
    purpose: 'মস্তিষ্কে সারাদিনের পড়া মেমোরিতে ফিক্স করতে ৭ ঘণ্টা ঘুম বাধ্যতামূলক',
    icon: BedDouble,
    badge: 'মেমোরি লক',
    color: 'text-teal-400 bg-teal-950/50 border-teal-500/30'
  }
];

const fridayRoutine = [
  {
    time: 'সকাল ৮:০০ - ১০:০০',
    duration: '২ ঘণ্টা',
    activity: '🔁 সাপ্তাহিক মিশ্র রিভিশন',
    purpose: 'শনি-বৃহস্পতি সপ্তাহে পড়া সব ৬টি পত্রের অধ্যায় রিভিশন',
    icon: RotateCcw,
    badge: 'উইকলি রিভিশন',
    color: 'text-amber-400 bg-amber-950/50 border-amber-500/30'
  },
  {
    time: 'সকাল ১০:৩০ - ১২:০০',
    duration: '১.৫ ঘণ্টা',
    activity: '🎯 মিশ্র MCQ টেস্ট (২০–৩০টি প্রশ্ন) + সেলফ চেক',
    purpose: 'আসল পরীক্ষার মিশ্র বিষয়ের চাপ সিমুলেট করা',
    icon: Zap,
    badge: 'টাইমড টেস্ট',
    color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
  },
  {
    time: 'দুপুর ২:৩০ - ৪:০০',
    duration: '১.৫ ঘণ্টা',
    activity: '📝 ভুল-নোটবুক আপডেট করা',
    purpose: 'সপ্তাহের ভুলগুলো লগ করা ও পুনরায় দেখার তারিখ ঠিক করা',
    icon: Brain,
    badge: 'ইম্প্রুভমেন্ট',
    color: 'text-indigo-400 bg-indigo-950/50 border-indigo-500/30'
  },
  {
    time: 'বিকাল ৪:০০ - রাত ১১:০০',
    duration: 'সন্ধ্যা',
    activity: '☕ রিকভারি, হালকা ব্যায়াম, পরিবার ও বাফার টাইম',
    purpose: 'বার্নআউট রোধ করে পরবর্তী সপ্তাহের শক্তি রিচার্জ রাখা',
    icon: Coffee,
    badge: 'রিকভারি টাইম',
    color: 'text-rose-400 bg-rose-950/50 border-rose-500/30'
  }
];

export default function DailyRoutineSection() {
  const [activeTab, setActiveTab] = useState<'regular' | 'friday'>('regular');
  const routineList = activeTab === 'regular' ? regularRoutine : fridayRoutine;

  return (
    <section id="daily-routine" className="py-16 sm:py-28 px-3 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>৩ মাসের জন্য টেকসই দৈনিক রুটিন</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            সিদ্ধান্ত-ক্লান্তি দূর করতে <span className="text-gradient-amber">বিজ্ঞানসম্মত দৈনিক রুটিন</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            কখন কী পড়বেন, কতক্ষণ রিভিশন দেবেন আর কতক্ষণ ঘুমাবেন—তার নিখুঁত টাইম-ব্লকিং নিচে দেখুন:
          </p>
        </div>

        {/* 3D Tab Switcher */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => setActiveTab('regular')}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 border shadow-xl ${
              activeTab === 'regular'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400/50 shadow-amber-500/25 -translate-y-0.5'
                : 'bg-slate-900/70 text-slate-400 border-white/10 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-300" />
            <span>☀️ নিয়মিত পড়ার দিন (শনি – বৃহস্পতি)</span>
          </button>

          <button
            onClick={() => setActiveTab('friday')}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 border shadow-xl ${
              activeTab === 'friday'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/50 shadow-emerald-500/25 -translate-y-0.5'
                : 'bg-slate-900/70 text-slate-400 border-white/10 hover:text-white hover:bg-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-300" />
            <span>🕌 শুক্রবার (রিভিশন ও রিকভারি)</span>
          </button>
        </div>

        {/* 3D Routine Timeline Grid */}
        <div className="space-y-3 sm:space-y-4">
          {routineList.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                whileHover={{ y: -2 }}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:border-slate-700 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-inner ${item.color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] sm:text-xs font-mono font-extrabold text-amber-400 bg-black/50 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        {item.time} ({item.duration})
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white leading-normal pt-0.5 pb-0.5">{item.activity}</h4>
                  </div>
                </div>

                <div className="sm:max-w-md text-xs text-slate-300 border-t sm:border-t-0 sm:border-l border-white/10 pt-2.5 sm:pt-0 sm:pl-5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">উদ্দেশ্য (Purpose):</span>
                  <p className="leading-relaxed text-xs font-medium">{item.purpose}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
