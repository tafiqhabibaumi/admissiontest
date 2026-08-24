'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Sparkles,
  Download,
  Mail,
  Flame,
  ArrowRight,
  ShieldCheck,
  Lock,
  Clock
} from 'lucide-react';
import { SingleProductConfig } from '@/types';
import { formatBDT } from '@/lib/utils';

interface SingleProductPricingProps {
  product: SingleProductConfig;
  onOpenCheckout: () => void;
}

export default function SingleProductPricing({ product, onOpenCheckout }: SingleProductPricingProps) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  return (
    <section id="pricing" className="py-16 sm:py-28 px-3 sm:px-6 relative perspective-1000">
      {/* Dynamic Background Multi-Hue Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/20 to-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-rose-500/10">
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>একক পূর্ণাঙ্গ মাস্টার গাইড • ৫০% লিমিটেড টাইম অফার</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-normal pt-1 pb-1">
            একটি পিডিএফে <span className="text-gradient-emerald">সকল বিশ্ববিদ্যালয়ের সম্পূর্ণ প্রস্তুতি</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            আলাদা কোনো প্যাকেজ বা জটিলতা নেই। একবার সংগ্রহ করলেই পাচ্ছেন বুয়েট, সিকেরুয়েট, আইইউটি ও ঢাবি ‘ক’ ইউনিটের সম্পূর্ণ গাইডলাইন।
          </p>
        </div>

        {/* 3D Holographic Pricing Bento Card Wrapper with Visible Overflow */}
        <div className="relative pt-4">
          {/* Top Pill Ribbon with Shimmer - Positioned Cleanly Without Clipping */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-2xl flex items-center gap-2 whitespace-nowrap border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="leading-normal pt-0.5 pb-0.5">{product.tag}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-950/95 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl group hover:border-emerald-400 transition-colors"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center pt-4 sm:pt-2">
              {/* Left Col: Details & Features */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-wider block mb-2">
                    {product.universitiesCovered.join(' • ')}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-normal pt-0.5 pb-0.5">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">
                    {product.subtitle}
                  </p>
                </div>

                {/* Features List with 3D Green Checks */}
                <div className="space-y-3 pt-1">
                  {product.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: 3D Price Box & CTA */}
              <div className="lg:col-span-5 rounded-3xl p-6 sm:p-9 bg-slate-950/90 border border-white/15 text-center space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                    এককালীন পরিশোধিত মূল্য
                  </span>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-4xl sm:text-6xl font-black text-white font-mono">
                      {formatBDT(product.discountPrice)}
                    </span>
                    <span className="text-lg text-slate-500 line-through font-mono">
                      {formatBDT(product.originalPrice)}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{discountPercent}% স্পেশাল ছাড় চলছে</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-3">
                  <button
                    onClick={onOpenCheckout}
                    className="w-full py-4 px-6 rounded-2xl shimmer-button text-white font-extrabold text-sm sm:text-base shadow-2xl flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
                    <span>এখনই সম্পূর্ণ গাইডটি নিন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Download className="w-3.5 h-3.5" /> ইনস্ট্যান্ট ডাউনলোড
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> ইমেইল ব্যাকআপ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Official Payment Gateways Bar */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-3.5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>১০০% নিরাপদ অফিসিয়াল গেটওয়ে ও ম্যানুয়াল পেমেন্ট সাপোর্ট</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-1">
            <div className="h-11 sm:h-13 px-4 py-2 bg-white rounded-xl border border-slate-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="bKash">
              <img src="/images/payment/bkash.svg" alt="bKash" className="h-7 sm:h-8 object-contain" />
            </div>
            <div className="h-11 sm:h-13 px-4 py-2 bg-white rounded-xl border border-slate-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="Nagad">
              <img src="/images/payment/nagad.png" alt="Nagad" className="h-7 sm:h-8 object-contain" />
            </div>
            <div className="h-11 sm:h-13 px-4 py-2 bg-white rounded-xl border border-slate-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="Rocket">
              <img src="/images/payment/rocket.svg" alt="Rocket" className="h-7 sm:h-8 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
