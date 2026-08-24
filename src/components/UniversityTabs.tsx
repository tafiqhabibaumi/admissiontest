'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle2, ChevronRight, Award, Zap, Compass } from 'lucide-react';

const universities = [
  {
    id: 'buet',
    name: 'বুয়েট (BUET)',
    fullName: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়',
    tagline: 'লিখিত পরীক্ষায় সর্বোচ্চ কনসেপচুয়াল সমস্যার সমাধান',
    seats: '১,৩০০+ আসন',
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-500/40',
    highlights: [
      'প্রিলিমিনারি ১০০ এমসিকিউ ও মূল লিখিত পরীক্ষায় ৬০টি জটিল গাণিতিক সমস্যার প্যাটার্ন বিশ্লেষণ',
      'প্রতি প্রশ্নে মাত্র ৩ মিনিট সময় বণ্টন ও পর্যাপ্ত জায়গা ব্যবহারে সঠিক ড্রাফটিং টেকনিক',
      'পদার্থ, রসায়ন ও গণিতের উচ্চ ধারণাগত (Conceptual) গভীরতার প্রশ্ন তালিকা',
      'বিগত ১৫ বছরের বুয়েট টপ র‍্যাঙ্কারদের প্রশ্ন সিলেক্ট করার বাস্তব স্ট্র্যাটেজি'
    ]
  },
  {
    id: 'ckreut',
    name: 'সিকেরুয়েট (CKReUT)',
    fullName: 'রুয়েট, চুয়েট ও কুয়েট সমন্বিত ইঞ্জিনিয়ারিং',
    tagline: 'হিউজ সিটের সমন্বিত ইঞ্জিনিয়ারিং এক্সাম ক্র্যাকিং রোডম্যাপ',
    seats: '৩,২০০+ আসন',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/40',
    highlights: [
      'রুয়েট, চুয়েট ও কুয়েটের বিগত বছরের সমন্বিত প্রশ্ন প্যাটার্ন ও কমন টপিকস',
      'দ্রুত সঠিক উত্তরের জন্য ফর্মুলা মেমোরিজেশন চার্ট',
      'ইঞ্জিনিয়ারিং আসন নিশ্চিত করার সেফ-মার্কস স্ট্র্যাটেজি',
      'প্র্যাকটিস টেস্টের মাধ্যমে ভুল কমানোর স্পেশাল চেকলিস্ট'
    ]
  },
  {
    id: 'butex',
    name: 'বুটেক্স (BUTEX)',
    fullName: 'বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয়',
    tagline: 'টেক্সটাইল ইঞ্জিনিয়ারিং ও স্পেশাল কেমিস্ট্রি ফোকাস',
    seats: '৬০০+ আসন',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/40',
    highlights: [
      'বুটেক্সের জন্য রসায়ন ও উচ্চতর গণিতের স্পেশাল ফোকাসড টপিকস',
      'লিখিত পরীক্ষায় সংক্ষিপ্ত ও নির্ভুল উপস্থাপনার নিয়মাবলী',
      'বিগত ১০ বছরের প্রশ্ন ব্যাংকের হাই-ফ্রিকোয়েন্সি থিওরি ও ম্যাথ',
      'শর্টকাট রিভিশন শিট ও ফর্মুলা সামারি'
    ]
  },
  {
    id: 'du-a',
    name: 'ঢাবি ‘ক’ ইউনিট (DU A-Unit)',
    fullName: 'ঢাকা বিশ্ববিদ্যালয় বিজ্ঞান অনুষদ',
    tagline: 'ক্যালকুলেটর ছাড়া দ্রুত হিসাব ও এমসিকিউ একুরেসি',
    seats: '১,৮০০+ আসন',
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500/40',
    highlights: [
      'ক্যালকুলেটর ছাড়া মুখে মুখে ভগ্নাংশ ও জটিল হিসাব মেলানোর শর্টকাট ট্রিকস',
      'নেগেটিভ মার্কিং এড়িয়ে সর্বোচ্চ সঠিক উত্তর দাগানোর স্ট্র্যাটেজি',
      'লিখিত অংশে অল্প জায়গায় টু-দ্য-পয়েন্ট উত্তর লেখার নিয়ম',
      'পদার্থ, রসায়ন, গণিত ও বায়োলজি চ্যাপ্টার প্রায়োরিটি'
    ]
  }
];

interface UniversityTabsProps {
  onOpenCheckout: (packageId?: string) => void;
}

export default function UniversityTabs({ onOpenCheckout }: UniversityTabsProps) {
  const [activeTab, setActiveTab] = useState('buet');
  const currentUni = universities.find((u) => u.id === activeTab) || universities[0];

  return (
    <section id="universities" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs sm:text-sm font-semibold">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>বিশ্ববিদ্যালয়ভিত্তিক সুনির্দিষ্ট গাইডলাইন</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight">
            আপনার <span className="text-gradient-emerald">স্বপ্নের বিশ্ববিদ্যালয়</span> কোনটি?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base">
            প্রতিটি বিশ্ববিদ্যালয়ের প্রশ্ন কাঠামো ও মূল্যায়ন পদ্ধতি ভিন্ন। নিচে ক্লিক করে দেখুন আপনার টার্গেটের জন্য কী কী করণীয়:
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8">
          {universities.map((uni) => (
            <button
              key={uni.id}
              onClick={() => setActiveTab(uni.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2.5 ${
                activeTab === uni.id
                  ? `bg-gradient-to-r ${uni.color} text-white shadow-xl shadow-indigo-950/60 scale-105`
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{uni.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic University Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUni.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl p-8 sm:p-10 bg-slate-900/70 border ${currentUni.borderColor} backdrop-blur-2xl shadow-2xl shadow-black/50`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {currentUni.seats}
                    </span>
                    <span className="text-xs text-slate-400">{currentUni.fullName}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">{currentUni.name}</h3>
                  <p className="text-indigo-300 text-sm sm:text-base mt-1 font-medium">{currentUni.tagline}</p>
                </div>

                {/* Highlights List */}
                <div className="space-y-3">
                  {currentUni.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenCheckout()}
                    className={`px-7 py-3.5 rounded-xl bg-gradient-to-r ${currentUni.color} hover:opacity-90 text-white font-bold text-sm sm:text-base shadow-lg inline-flex items-center gap-2 transition-all`}
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>{currentUni.name}-এর সম্পূর্ণ সাজেশন সংগ্রহ করুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphic Stats Box */}
              <div className="lg:col-span-4 rounded-2xl p-6 bg-slate-950/80 border border-slate-800 space-y-4 text-center">
                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-white font-serif">সফলতার নিশ্চয়তা</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  বিগত বছরগুলোতে এই সাজেশনের দিকনির্দেশনা অনুসরণ করে শত শত শিক্ষার্থী তাদের ড্রিম ভার্সিটিতে চান্স পেয়েছেন।
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-emerald-400 font-semibold">
                  ✓ শতভাগ আপডেটেড এডিশন
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
