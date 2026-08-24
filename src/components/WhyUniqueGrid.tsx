'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  XCircle,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    title: 'অধ্যায়ভিত্তিক পড়ার সময়সীমা (Time Allocation)',
    description:
      'এইচএসসির পর সময় খুবই সংক্ষিপ্ত। কোন চ্যাপ্টারে ৮ ঘণ্টা আর কোনটায় ২৫ ঘণ্টা সময় দিতে হবে—তার বাস্তবভিত্তিক হিসাব দেওয়া আছে যাতে সময় অপচয় না হয়।',
    badge: 'সময় বাঁচান ৪০%'
  },
  {
    icon: Target,
    color: 'from-purple-500 to-indigo-500',
    title: '৫-স্টার প্রায়োরিটি র‍্যাঙ্কিং (Topic Priority)',
    description:
      'প্রতিটি চ্যাপ্টারের মধ্যে কোন ৫-১০টি কনসেপ্ট থেকে প্রতি বছর বুয়েট ও সিকেরুয়েটতে নিশ্চিত প্রশ্ন আসে, তা স্টার মার্কিং দিয়ে চিহ্নিত করা।',
    badge: '১০০% নিশ্চিত কনসেপ্ট'
  },
  {
    icon: XCircle,
    color: 'from-rose-500 to-red-500',
    title: 'কী কী বাদ দিতে হবে (What to Skip)',
    description:
      'কোন দীর্ঘ থিওরিটিক্যাল প্রমাণ বা অপ্রয়োজনীয় জটিল ম্যাথ ইঞ্জিনিয়ারিং ভর্তি পরীক্ষায় আসে না—তা স্পষ্ট চিহ্নিত করে মাথার অযথা বোঝা দূর করা হয়েছে।',
    badge: 'স্মার্ট প্রিপারেশন'
  },
  {
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    title: 'বিগত ১৫ বছরের প্রশ্ন ট্রেন্ড অ্যানালাইসিস',
    description:
      'বুয়েট, রুয়েট, চুয়েট, কুয়েট ও বুটেক্সের গত ১৫ বছরের বিগত প্রশ্ন এনালাইসিস করে কোন টপিকের পুনরাবৃত্তি বেশি তার নিখুঁত পরিসংখ্যান।',
    badge: 'রিসার্চ-ব্যাকড'
  },
  {
    icon: Cpu,
    color: 'from-cyan-500 to-blue-500',
    title: '৩ মিনিটে ম্যাথ সলভ করার ক্যালকুলেটর ট্রিকস',
    description:
      'বুয়েট রিটেন পরীক্ষায় প্রতি প্রশ্নে সময় থাকে মাত্র ৩ মিনিট। ক্যালকুলেটর শর্টকাট (FX-991EX/CW) ও স্টেপ স্কিপিং হ্যাকস দেওয়া আছে।',
    badge: 'রিটেন এক্সাম হ্যাকস'
  },
  {
    icon: Zap,
    color: 'from-pink-500 to-rose-500',
    title: 'ইনস্ট্যান্ট অটোমেটেড ডেলিভারি ও সাপোর্ট',
    description:
      'সাপোর্টকরি বা মোবাইল ব্যাংকিংয়ে পেমেন্ট সম্পন্ন করার কয়েক সেকেন্ডের মধ্যেই ওয়েবসাইট থেকে সরাসরি ডাউনলোড এবং ইমেইলে ব্যাকআপ ফাইল পৌঁছে যাবে।',
    badge: '২৪/৭ অটোমেশন'
  }
];

export default function WhyUniqueGrid() {
  return (
    <section id="why-unique" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>স্মার্ট অ্যাডমিশন স্ট্র্যাটেজি</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight">
            কেন এই সাজেশন সাধারণ বইগুলোর চেয়ে{' '}
            <span className="text-gradient-purple">সম্পূর্ণ আলাদা?</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            হাজার হাজার পৃষ্ঠা পড়ার চেয়ে সঠিক জিনিস সঠিক সময়ে পড়া একজন সাধারণ ছাত্রকে বুয়েট টপারে পরিণত করে।
          </p>
        </div>

        {/* 3D Glassmorphic Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl p-7 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2.5 font-serif group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">{feat.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>সাজেশন পিডিএফে শতভাগ অন্তর্ভুক্ত</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
