'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, Award } from 'lucide-react';
import { TestimonialItem } from '@/types';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-16 sm:py-28 px-3 sm:px-6 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>ভেরিফাইড রিভিউ ও ফলাফল</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            শীর্ষ বিশ্ববিদ্যালয়ের <span className="text-gradient-emerald">টপারদের অভিজ্ঞতা</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            যারা আগের বছরগুলোতে স্মার্ট স্ট্র্যাটেজি ও প্রায়োরিটি বিশ্লেষণ অনুসরণ করে সফল হয়েছেন:
          </p>
        </div>

        {/* 3D Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-indigo-500/50 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all group"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 drop-shadow" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-slate-700 group-hover:text-indigo-400/50 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-5 font-medium">
                  "{t.quote}"
                </p>
              </div>

              {/* Student Info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {t.dept}, {t.institution}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 border border-emerald-500/30">
                  {t.batch}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
