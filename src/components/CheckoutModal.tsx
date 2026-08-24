'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Zap,
  Download,
  Mail,
  User,
  Phone,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';
import { SingleProductConfig, SiteConfig } from '@/types';
import { formatBDT } from '@/lib/utils';
import { trackPixelEvent } from './MetaPixel';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SingleProductConfig;
  paymentSettings?: SiteConfig['paymentSettings'];
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  paymentSettings
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetUni, setTargetUni] = useState('সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং');
  const [hscBatch, setHscBatch] = useState('HSC 2025/2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMode, setPaymentMode] = useState<'manual_bkash' | 'manual_nagad' | 'manual_rocket'>('manual_bkash');
  const [manualTrxId, setManualTrxId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('একটি সঠিক ইমেইল দিন (সাজেশন ফাইলটি ইমেইলেও যাবে)');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('একটি সঠিক মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }
    if (!manualTrxId.trim()) {
      setErrorMsg('পেমেন্ট করার পর প্রাপ্ত TrxID লিখুন');
      return;
    }

    setIsSubmitting(true);

    try {
      trackPixelEvent('InitiateCheckout', {
        content_name: product.title,
        content_category: 'Admission Master Guide',
        value: product.discountPrice,
        currency: 'BDT',
        num_items: 1,
      });

      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          targetUniversity: targetUni,
          hscBatch,
          paymentMethod: paymentMode,
          manualTrxId: manualTrxId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'চেকআউট তৈরিতে সমস্যা হয়েছে');
      }

      await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderId,
          action: 'manual_verify',
          manualTrxId: manualTrxId.trim(),
        }),
      });

      window.location.href = `/order-status/${data.orderId}?success=1`;
    } catch (err: any) {
      setErrorMsg(err.message || 'একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-500/40 p-5 sm:p-8 shadow-2xl text-white my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-left mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                🔒 নিরাপদ চেকআউট
              </span>
              <span className="text-xs text-slate-400 font-medium">ইনস্ট্যান্ট ডাউনলোড</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-normal">
              মাস্টার গাইডটি সংগ্রহ করুন
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              সঠিক তথ্য দিন। পেমেন্ট সম্পন্ন হলেই ইনস্ট্যান্ট ডাউনলোড পেয়ে যাবেন।
            </p>
          </div>

          {/* Product Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 mb-5 flex items-center justify-between shadow-inner">
            <div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">{product.title}</p>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">৫০টি অধ্যায় + ১২ সপ্তাহের প্ল্যান</span>
            </div>
            <div className="text-right pl-3 flex-shrink-0">
              <span className="text-lg sm:text-xl font-black text-emerald-400 block font-mono">
                {formatBDT(product.discountPrice)}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatBDT(product.originalPrice)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  আপনার নাম <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  মোবাইল নম্বর <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ইমেইল (পিডিএফ ফাইল যাবে) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  প্রধান টার্গেট
                </label>
                <select
                  value={targetUni}
                  onChange={(e) => setTargetUni(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BUET & Engineering">BUET & Engineering (বুয়েট ও ইঞ্জিনিয়ারিং)</option>
                  <option value="CKRUET & IUT">CKRUET & IUT (রুয়েট, চুয়েট, কুয়েট, আইইউটি)</option>
                  <option value="DU A-Unit & GST">DU A-Unit & GST (ঢাবি ক ও গুচ্ছ)</option>
                  <option value="All University Science">All University Science (সকল বিজ্ঞান)</option>
                </select>
              </div>
            </div>

            {/* Official Payment Method Badges Selector */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-300 mb-2">
                পেমেন্ট মাধ্যম বেছে নিন:
              </label>
              
              <div className="grid grid-cols-3 gap-2.5 mb-2">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('manual_bkash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all bg-white text-slate-900 shadow ${
                    paymentMode === 'manual_bkash'
                      ? 'ring-2 ring-pink-500 border-pink-500 shadow-pink-500/30 scale-[1.02]'
                      : 'border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src="/images/payment/bkash.svg" alt="bKash" className="h-7 w-full object-contain" />
                  <span className="text-[11px] font-bold text-pink-700">বিকাশ (bKash)</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('manual_nagad')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all bg-white text-slate-900 shadow ${
                    paymentMode === 'manual_nagad'
                      ? 'ring-2 ring-orange-500 border-orange-500 shadow-orange-500/30 scale-[1.02]'
                      : 'border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src="/images/payment/nagad.png" alt="Nagad" className="h-7 w-full object-contain" />
                  <span className="text-[11px] font-bold text-orange-700">নগদ (Nagad)</span>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('manual_rocket')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all bg-white text-slate-900 shadow ${
                    paymentMode === 'manual_rocket'
                      ? 'ring-2 ring-purple-500 border-purple-500 shadow-purple-500/30 scale-[1.02]'
                      : 'border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src="/images/payment/rocket.svg" alt="Rocket" className="h-7 w-full object-contain" />
                  <span className="text-[11px] font-bold text-purple-700">রকেট (Rocket)</span>
                </button>
              </div>

              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">
                    {paymentMode === 'manual_bkash' ? 'বিকাশ সেন্ড মানি নম্বর:' : paymentMode === 'manual_nagad' ? 'নগদ সেন্ড মানি নম্বর:' : 'রকেট সেন্ড মানি নম্বর:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-400 font-mono text-sm">
                      {paymentMode === 'manual_bkash'
                        ? (paymentSettings?.bkashMerchantNumber || '01700000000')
                        : paymentMode === 'manual_nagad'
                        ? (paymentSettings?.nagadMerchantNumber || '01700000000')
                        : (paymentSettings?.rocketMerchantNumber || '01700000000')}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(
                        paymentMode === 'manual_bkash'
                          ? (paymentSettings?.bkashMerchantNumber || '01700000000')
                          : paymentMode === 'manual_nagad'
                          ? (paymentSettings?.nagadMerchantNumber || '01700000000')
                          : (paymentSettings?.rocketMerchantNumber || '01700000000')
                      )}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">
                  নম্বরে <strong className="text-amber-400 font-mono">{formatBDT(product.discountPrice)}</strong> সেন্ড মানি করে প্রাপ্ত TrxID নিচে লিখুন:
                </p>
                <input
                  type="text"
                  required
                  placeholder="Transaction ID (যেমন: 9J7X8KL9)"
                  value={manualTrxId}
                  onChange={(e) => setManualTrxId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 uppercase font-mono"
                />
              </div>
            </div>

            {/* Total Price Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">পরিশোধযোগ্য মোট ফি:</p>
                <p className="text-xl font-extrabold text-emerald-400 font-mono">
                  {formatBDT(product.discountPrice)}
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <span className="text-emerald-400 font-bold block">✓ ইনস্ট্যান্ট ডেলিভারি</span>
                <span>পিডিএফ + লাইফটাইম আপডেট</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl shimmer-button text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                  <span>অর্ডার নিশ্চিত করে ডাউনলোড নিন</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> ১০০% সুরক্ষিত পেমেন্ট
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-indigo-400" /> ইনস্ট্যান্ট এক্সেস
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
