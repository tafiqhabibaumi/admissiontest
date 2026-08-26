'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Mail,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  FileText,
  Clock,
  AlertCircle,
  Loader2,
  Radio,
  RefreshCw
} from 'lucide-react';
import { Order } from '@/types';
import { formatBDT, toBengaliNumber } from '@/lib/utils';
import { trackPixelEvent } from '@/components/MetaPixel';

export default function OrderStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders`);
      const data = await res.json();
      if (data.orders) {
        const found = data.orders.find((o: Order) => o.id === orderId);
        if (found) {
          setOrder(found);
          if (found.paymentStatus === 'completed') {
            triggerConfetti();

            // Track Purchase conversion once per session with Advanced Matching
            const purchaseKey = `purchase_tracked_${found.id}`;
            if (!sessionStorage.getItem(purchaseKey)) {
              sessionStorage.setItem(purchaseKey, '1');
              trackPixelEvent(
                'Purchase',
                {
                  value: found.amount,
                  currency: 'BDT',
                  content_name: found.packageTitle,
                  order_id: found.id,
                },
                {
                  email: found.customerEmail,
                  phone: found.customerPhone,
                  firstName: found.customerName,
                }
              );
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Real-time automatic SMS polling if payment is pending
  useEffect(() => {
    if (!order || order.paymentStatus === 'completed') {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    setIsPolling(true);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/checkout/poll-status?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}&amount=${order.amount}`
        );
        const data = await res.json();
        if (data.verified) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          fetchOrder();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [order?.paymentStatus, order?.id, order?.customerPhone, order?.amount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-sm text-slate-400">অর্ডার ভেরিফাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold">অর্ডার খুঁজে পাওয়া যায়নি</h2>
          <p className="text-xs text-slate-400">অর্ডার নম্বরটি সঠিক নয় অথবা ডাটাবেজে রেকর্ড নেই।</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল পাতায় ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = order.paymentStatus === 'completed';

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </Link>

        {/* Status Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-indigo-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
          {isCompleted ? (
            <>
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  পেমেন্ট সফল ও ভেরিফাইড
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-normal">
                  অভিনন্দন, {order.customerName}! 🎓
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  আপনার <strong className="text-white">{order.packageTitle}</strong> সাজেশন ফাইলটি প্রস্তুত। নিচে ক্লিক করে এখনই ডাউনলোড করুন।
                </p>
              </div>

              {/* Instant Download Action */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-indigo-950/50 to-slate-950 border border-emerald-500/30 text-center space-y-4">
                <a
                  href={`/api/download/${order.downloadToken}`}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-500/30 inline-flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>📥 সাজেশন PDF ডাউনলোড করুন (ফুল ভার্সন)</span>
                </a>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Mail className="w-3.5 h-3.5" /> ইমেইলেও পাঠানো হয়েছে ({order.customerEmail})
                  </span>
                  <span>•</span>
                  <span>ডাউনলোড: {toBengaliNumber(order.downloadCount || 0)} বার</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Pending Real-time Radar Window */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl">
                  <Radio className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  পেমেন্ট এসএমএস স্বয়ংক্রিয়ভাবে যাচাই হচ্ছে...
                </span>
                <h1 className="text-2xl font-bold text-white leading-normal">অটো-ভেরিফিকেশন চলছে</h1>

                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  আপনার বিকাশ/নগদ/রকেট থেকে পাঠানো <strong className="text-emerald-400 font-mono">{formatBDT(order.amount)}</strong> টাকা আসার এসএমএস রিসিভ হলেই এই পেজটিতে সাথে সাথে ডাউনলোড লিংক ও লাইফটাইম এক্সেস আনলক হয়ে যাবে।
                </p>
              </div>

              {/* Waiting Information & Helpline */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>সার্ভারে নতুন এসএমএস পর্যবেক্ষণ চলছে...</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <a
                    href={`https://wa.me/8801760470298?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি ${order.amount} টাকা পাঠিয়েছি। আমার অর্ডার নম্বর #${order.id}, ফোন: ${order.customerPhone}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp হেল্পলাইনে মেসেজ দিন</span>
                  </a>
                  <button
                    onClick={fetchOrder}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিফ্রেশ করুন</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Order Details Invoice Table */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-left text-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> অর্ডার ইনভয়েস বিবরণ
            </h3>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">অর্ডার নম্বর:</span>
                <span className="font-mono text-indigo-300 font-bold">{order.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">তারিখ ও সময়:</span>
                <span>{new Date(order.createdAt).toLocaleString('bn-BD')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">গ্রাহকের নাম ও ফোন:</span>
                <span className="font-medium text-white">{order.customerName} ({order.customerPhone})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">টার্গেট বিশ্ববিদ্যালয়:</span>
                <span className="text-amber-400">{order.targetUniversity}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">প্যাকেজ:</span>
                <span className="font-medium text-white">{order.packageTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">পরিশোধিত মূল্য:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">
                  {formatBDT(order.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Need Help WhatsApp */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> সার্বক্ষণিক সাপোর্ট সহায়তা
            </span>
            <a
              href="https://wa.me/8801760470298"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp-এ সাহায্য নিন</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
