'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';

const universities = [
  {
    id: 'buet',
    name: 'BUET',
    bengaliName: 'বুয়েট',
    logo: '/images/logos/buet.svg',
    type: 'Written + Preli',
    glowColor: 'hover:border-rose-500/80 hover:shadow-rose-500/20',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'ruet',
    name: 'RUET',
    bengaliName: 'রুয়েট',
    logo: '/images/logos/ruet.svg',
    type: 'CKRUET MCQ',
    glowColor: 'hover:border-blue-500/80 hover:shadow-blue-500/20',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  {
    id: 'kuet',
    name: 'KUET',
    bengaliName: 'কুয়েট',
    logo: '/images/logos/kuet.svg',
    type: 'CKRUET MCQ',
    glowColor: 'hover:border-sky-500/80 hover:shadow-sky-500/20',
    tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'cuet',
    name: 'CUET',
    bengaliName: 'চুয়েট',
    logo: '/images/logos/cuet.svg',
    type: 'CKRUET MCQ',
    glowColor: 'hover:border-emerald-500/80 hover:shadow-emerald-500/20',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'iut',
    name: 'IUT',
    bengaliName: 'আইইউটি',
    logo: '/images/logos/iut.png',
    type: 'English MCQ',
    glowColor: 'hover:border-amber-500/80 hover:shadow-amber-500/20',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'du',
    name: 'DU A-Unit',
    bengaliName: 'ঢাবি ‘ক’',
    logo: '/images/logos/du.svg',
    type: 'MCQ + Written',
    glowColor: 'hover:border-indigo-500/80 hover:shadow-indigo-500/20',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  {
    id: 'butex',
    name: 'BUTEX',
    bengaliName: 'বুটেক্স',
    logo: '/images/logos/butex.svg',
    type: 'Written Test',
    glowColor: 'hover:border-pink-500/80 hover:shadow-pink-500/20',
    tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  },
  {
    id: 'gst',
    name: 'GST Science',
    bengaliName: 'জিএসটি গুচ্ছ',
    logo: '/images/logos/gst.svg',
    type: 'Combined MCQ',
    glowColor: 'hover:border-purple-500/80 hover:shadow-purple-500/20',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
];

export default function UniversityLogosBanner() {
  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6 relative border-y border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl overflow-hidden">
      {/* Subtle Ambient Glow Behind University Row */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-48 bg-gradient-to-r from-emerald-500/10 via-indigo-500/15 to-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>সকল শীর্ষ বিশ্ববিদ্যালয় কভার্ড</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-normal pt-0.5 pb-0.5">
            যেসব বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার সুনির্দিষ্ট দিকনির্দেশনা রয়েছে
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            বুয়েট লিখিত থেকে শুরু করে ঢাবি এমসিকিউ ও ইঞ্জিনিয়ারিং গুচ্ছের প্রতিটি পরীক্ষার প্যাটার্ন আলাদাভাবে বিশ্লেষিত
          </p>
        </div>

        {/* 3D Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {universities.map((uni, idx) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-3.5 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:shadow-2xl transition-all duration-300 text-center flex flex-col items-center justify-between group cursor-default ${uni.glowColor}`}
            >
              {/* Official University Crest Display with 3D Pop */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 border border-slate-700/80 flex items-center justify-center mb-2.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src={uni.logo}
                  alt={`${uni.name} Official Logo`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  {uni.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {uni.bengaliName}
                </p>
              </div>

              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border mt-2.5 shadow-sm ${uni.tagColor}`}>
                {uni.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
