'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FaqItem } from '@/types';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-28 px-3 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>সচরাচর জিজ্ঞাসা ও উত্তর</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            সাধারণ <span className="text-gradient-purple">প্রশ্নোত্তর (FAQ)</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            কেনার আগে আপনার মনের যেকোনো প্রশ্নের দ্রুত সমাধান এখানে পেয়ে যাবেন:
          </p>
        </div>

        {/* 3D FAQ Accordion List */}
        <div className="space-y-3.5 sm:space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg ${
                  isOpen
                    ? 'bg-slate-900/95 border-indigo-500/50 shadow-indigo-500/10 backdrop-blur-2xl'
                    : 'bg-slate-900/60 border-white/10 hover:border-slate-700 hover:bg-slate-900/80 backdrop-blur-xl'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 text-xs sm:text-base font-extrabold text-white transition-colors"
                >
                  <span className="leading-normal pt-0.5 pb-0.5">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-4 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-4 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
