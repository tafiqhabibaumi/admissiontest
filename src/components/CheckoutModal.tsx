'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Radio,
  CheckCircle2,
  RefreshCw,
  Clock
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
  const [senderPhone, setSenderPhone] = useState('');
  const [targetUni, setTargetUni] = useState('সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং');
  const [paymentMode, setPaymentMode] = useState<'manual_bkash' | 'manual_nagad' | 'manual_rocket'>('manual_bkash');
  
  // Realtime Verification States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRealtimeVerifying, setIsRealtimeVerifying] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [verifyCountdown, setVerifyCountdown] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [showManualTrx, setShowManualTrx] = useState(false);
  const [manualTrxId, setManualTrxId] = useState('');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount or modal close
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Start real-time polling for incoming SMS
  const startRealtimePolling = (orderId: string, phone: string) => {
    setIsRealtimeVerifying(true);
    setActiveOrderId(orderId);
    setVerifyCountdown(30);

    // Countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setVerifyCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling API every 2.5 seconds
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/poll-status?orderId=${orderId}&phone=${encodeURIComponent(phone)}&amount=${product.discountPrice}`);
        const data = await res.json();

        if (data.verified) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          
          setIsSuccess(true);
          setTimeout(() => {
            window.location.href = `/order-status/${orderId}?success=1`;
          }, 1200);
        }
      } catch (err) {
        console.error('Polling check error:', err);
      }
    }, 2500);
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
    if (!senderPhone.trim() || senderPhone.length < 10) {
      setErrorMsg('যে নম্বর থেকে টাকা পাঠিয়েছেন সেই মোবাইল নম্বরটি লিখুন (যেমন: 017xxxxxxxx)');
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
          phone: senderPhone.trim(),
          senderPhone: senderPhone.trim(),
          targetUniversity: targetUni,
          paymentMethod: paymentMode,
          manualTrxId: manualTrxId.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'চেকআউট তৈরিতে সমস্যা হয়েছে');
      }

      // If already matched with pre-arrived SMS
      if (data.autoVerified) {
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = `/order-status/${data.orderId}?success=1`;
        }, 800);
      } else {
        // Start real-time live SMS tracking radar
        setIsSubmitting(false);
        startRealtimePolling(data.orderId, senderPhone.trim());
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  // Manual verify fallback if SMS took longer than 30s
  const handleManualFallbackVerify = async () => {
    if (!activeOrderId) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrderId,
          action: 'manual_verify',
          manualTrxId: manualTrxId.trim() || `VERIFIED-${senderPhone.slice(-6)}`,
        }),
      });
      window.location.href = `/order-status/${activeOrderId}?success=1`;
    } catch (err) {
      window.location.href = `/order-status/${activeOrderId}`;
    }
  };

  if (!isOpen) return null;

  const currentNumber =
    paymentMode === 'manual_bkash'
      ? (paymentSettings?.bkashMerchantNumber || '01700000000')
      : paymentMode === 'manual_nagad'
      ? (paymentSettings?.nagadMerchantNumber || '01700000000')
      : (paymentSettings?.rocketMerchantNumber || '01700000000');

  const providerName =
    paymentMode === 'manual_bkash' ? 'বিকাশ' : paymentMode === 'manual_nagad' ? 'নগদ' : 'রকেট';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-3xl bg-[#0b101d] border border-emerald-500/40 p-4 sm:p-7 shadow-2xl text-white my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ================= REALTIME LIVE VERIFICATION RADAR SCREEN ================= */}
          {isRealtimeVerifying ? (
            <div className="text-center py-6 sm:py-8 space-y-5">
              {isSuccess ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    পেমেন্ট ভেরিফাইড! 🎉
                  </h3>
                  <p className="text-xs text-emerald-300">
                    আপনার অর্ডার নিশ্চিত হয়েছে। ডাউনলোড পেজে নিয়ে যাওয়া হচ্ছে...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Glowing Radar Animation */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-indigo-500/40 animate-pulse" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                      <Radio className="w-7 h-7 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>রিয়েল-টাইম অটো-ভেরিফিকেশন চলছে</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      আপনার {providerName} পেমেন্ট চেক করা হচ্ছে...
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                      নম্বর <strong className="text-emerald-400 font-mono">{senderPhone}</strong> থেকে প্রাপ্ত <strong className="text-amber-400 font-mono">{formatBDT(product.discountPrice)}</strong> ট্র্যাক করা হচ্ছে
                    </p>
                  </div>

                  {/* Progress Countdown Bar */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 max-w-xs mx-auto text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>স্বয়ংক্রিয় কানেকশন</span>
                      <span className="font-mono text-emerald-400 font-bold">{verifyCountdown}s</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-1000"
                        style={{ width: `${((30 - verifyCountdown) / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    টাকা পাঠানোর সাথে সাথে আপনার স্ক্রিন স্বয়ংক্রিয়ভাবে ডাউনলোড পেজে চলে যাবে।
                  </p>

                  {/* Manual fallback button if needed */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleManualFallbackVerify}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
                    >
                      টাকা পাঠিয়ে থাকলে এখনই সরাসরি পেজটি ওপেন করুন →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= CHECKOUT FORM SCREEN ================= */
            <>
              {/* Modal Header */}
              <div className="text-left mb-3 sm:mb-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                    ⚡ ইনস্ট্যান্ট অটো-ভেরিফিকেশন
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">কোনো TrxID টাইপ করতে হবে না</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-normal">
                  মাস্টার গাইডটি আনলক করুন
                </h3>
              </div>

              {/* Product Summary Box */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950 border border-white/10 mb-4 flex items-center justify-between shadow-inner">
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
                <div className="mb-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                {/* 1. Payment Method Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ১. পেমেন্ট মাধ্যম বেছে নিন:
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode('manual_bkash')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all bg-white text-slate-900 shadow ${
                        paymentMode === 'manual_bkash'
                          ? 'ring-2 ring-pink-500 border-pink-500 shadow-pink-500/30 scale-[1.02]'
                          : 'border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src="/images/payment/bkash.svg" alt="bKash" className="h-6 w-full object-contain" />
                      <span className="text-[10px] font-bold text-pink-700">বিকাশ (bKash)</span>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode('manual_nagad')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all bg-white text-slate-900 shadow ${
                        paymentMode === 'manual_nagad'
                          ? 'ring-2 ring-orange-500 border-orange-500 shadow-orange-500/30 scale-[1.02]'
                          : 'border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src="/images/payment/nagad.png" alt="Nagad" className="h-6 w-full object-contain" />
                      <span className="text-[10px] font-bold text-orange-700">নগদ (Nagad)</span>
                    </button>

                    {/* Rocket */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode('manual_rocket')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all bg-white text-slate-900 shadow ${
                        paymentMode === 'manual_rocket'
                          ? 'ring-2 ring-purple-500 border-purple-500 shadow-purple-500/30 scale-[1.02]'
                          : 'border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src="/images/payment/rocket.svg" alt="Rocket" className="h-6 w-full object-contain" />
                      <span className="text-[10px] font-bold text-purple-700">রকেট (Rocket)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Send Money Number Box */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">
                      {providerName} পার্সোনাল (Send Money) নম্বর:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-emerald-400 font-mono text-sm tracking-wider">
                        {currentNumber}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(currentNumber)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium flex items-center gap-1 transition-colors border border-slate-600"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    উপরের নম্বরে <strong className="text-amber-400 font-mono">{formatBDT(product.discountPrice)}</strong> সেন্ড মানি করুন।
                  </p>
                </div>

                {/* 3. Customer & Sender Info Inputs */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">
                      ২. যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Mobile Number) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="আপনার বিকাশ/নগদ নম্বর (যেমন: 017XXXXXXXX)"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full bg-slate-950 border-2 border-emerald-500/40 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono text-sm font-bold placeholder:font-normal placeholder:text-slate-500 shadow-inner"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      ✓ সিস্টেম স্বয়ংক্রিয়ভাবে আপনার নম্বর ও টাকার পরিমাণ মিলিয়ে পেমেন্ট ভেরিফাই করবে।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        আপনার নাম <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="আপনার পুরো নাম"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ইমেইল (যেখানে PDF কপি যাবে) <span className="text-rose-400">*</span>
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
                  </div>
                </div>

                {/* Optional TrxID toggle if user specifically wants it */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualTrx(!showManualTrx)}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <span>{showManualTrx ? '− TrxID ইনপুট লুকান' : '+ TrxID লিখতে চান? (ঐচ্ছিক)'}</span>
                  </button>
                  {showManualTrx && (
                    <div className="mt-1.5">
                      <input
                        type="text"
                        placeholder="TrxID (ঐচ্ছিক - যেমন: 9J7X8KL9)"
                        value={manualTrxId}
                        onChange={(e) => setManualTrxId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 uppercase font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Total Price Box */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">মোট পরিশোধযোগ্য:</p>
                    <p className="text-xl font-black text-emerald-400 font-mono">
                      {formatBDT(product.discountPrice)}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold block">✓ অটো-ভেরিফিকেশন</span>
                    <span>ইনস্ট্যান্ট PDF ডাউনলোড</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 rounded-2xl shimmer-button text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>রিয়েল-টাইম কানেক্ট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                      <span>টাকা পাঠিয়েছি • অটো-ভেরিফাই ও ডাউনলোড</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> ১০০% সুরক্ষিত অটোমেটেড সিস্টেম
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> ইনস্ট্যান্ট এক্সেস
                </span>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
