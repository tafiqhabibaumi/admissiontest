'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Shield,
  CreditCard,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Share2,
  Copy,
  Smartphone,
  Zap,
  Check,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SiteConfig } from '@/types';
import { defaultSiteConfig } from '@/data/defaultData';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // SMS Tester State
  const [testSms, setTestSms] = useState('You have received Tk 299.00 from 01712345678. Ref . Fee Tk 0.00. Balance Tk 5,450.00. TrxID 9J7X8KL9 at 25/08/2026 16:10');
  const [testingSms, setTestingSms] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      alert('সেটিংস সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const copyWebhookUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourwebsite.com';
    navigator.clipboard.writeText(`${origin}/api/payment/sms-webhook`);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(config.paymentSettings.smsWebhookKey || 'AumiWebhook2026');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRunSmsTest = async () => {
    if (!testSms.trim()) return;
    setTestingSms(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/payment/sms-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-key': config.paymentSettings.smsWebhookKey || 'AumiWebhook2026',
        },
        body: JSON.stringify({
          message: testSms,
          sender: 'bKash',
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Simulation request failed' });
    } finally {
      setTestingSms(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            সিস্টেম ও পেমেন্ট সেটিংস
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            বিকাশ, নগদ, রকেট অটোমেশন ও ডেলিভারি কনফিগারেশন
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সেভ করুন'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>সবগুলো সেটিংস সফলভাবে সংরক্ষিত ও কার্যকর হয়েছে!</span>
        </div>
      )}

      {/* 1. Android SMS Auto-Webhook Engine */}
      <div className="rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Android SMS Auto-Webhook ভেরিফিকেশন ইঞ্জিন
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                ● LIVE & ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ফোনে বিকাশ/নগদ/রকেট সেন্ড মানি মেসেজ আসতেই স্বয়ংক্রিয়ভাবে TrxID ও টাকা যাচাই হবে
            </p>
          </div>
        </div>

        {/* Webhook Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              ১. আপনার Webhook URL (অ্যান্ড্রয়েড অ্যাপে দিন):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? `${window.location.origin}/api/payment/sms-webhook` : '/api/payment/sms-webhook'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none"
              />
              <button
                onClick={copyWebhookUrl}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'কপি হয়েছে' : 'কপি'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Method: <strong>POST</strong> (Content-Type: application/json)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              ২. সিক্রেট Webhook কী (Secret Token):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={config.paymentSettings.smsWebhookKey || 'AumiWebhook2026'}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentSettings: {
                      ...config.paymentSettings,
                      smsWebhookKey: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={copySecretKey}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'কপি হয়েছে' : 'কপি'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">সিকিউরিটির জন্য অ্যান্ড্রয়েড অ্যাপের Header বা Query Params-এ দিন</p>
          </div>
        </div>

        {/* Live SMS Testing Console */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>লাইভ SMS পার্সিং ও ভেরিফিকেশন টেস্ট করুন:</span>
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">Test Simulator</span>
          </div>

          <textarea
            rows={2}
            value={testSms}
            onChange={(e) => setTestSms(e.target.value)}
            placeholder="এখানে ফোনে আসা বিকাশ/নগদ/রকেট SMS পেস্ট করুন..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTestSms('You have received Tk 299.00 from 01712345678. Ref . Fee Tk 0.00. Balance Tk 5,450.00. TrxID 9J7X8KL9 at 25/08/2026 16:10')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-pink-500/40 text-[10px] text-pink-400 hover:bg-slate-800"
              >
                বিকাশ স্যাম্পল
              </button>
              <button
                type="button"
                onClick={() => setTestSms('Money Received. Amount: Tk 299.00. Sender: 01812345678. TxnID: 71G78KL9. Balance: Tk 1,200.00')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-orange-500/40 text-[10px] text-orange-400 hover:bg-slate-800"
              >
                নগদ স্যাম্পল
              </button>
              <button
                type="button"
                onClick={() => setTestSms('Tk299.00 received from 01912345678. TxnId: 1928374650. Balance: Tk 8,900.00')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/40 text-[10px] text-purple-400 hover:bg-slate-800"
              >
                রকেট স্যাম্পল
              </button>
            </div>

            <button
              type="button"
              onClick={handleRunSmsTest}
              disabled={testingSms}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-amber-300" />
              <span>{testingSms ? 'যাচাই হচ্ছে...' : 'টেস্ট রান করুন'}</span>
            </button>
          </div>

          {/* Test Result Output Box */}
          {testResult && (
            <div className="mt-3 p-3.5 rounded-xl bg-black/70 border border-emerald-500/40 text-xs font-mono text-slate-200 space-y-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                <span className="text-emerald-400 font-bold">✔ PARSING RESULT:</span>
                <span className="text-[10px] text-slate-400">{testResult.matched ? 'MATCHED WITH PENDING ORDER' : 'LOGGED TO BUFFER'}</span>
              </div>
              <p>TrxID: <strong className="text-amber-300">{testResult.trxId || 'N/A'}</strong></p>
              <p>Amount: <strong className="text-emerald-300">৳{testResult.amount || '0'}</strong> | Provider: <strong className="text-indigo-300 uppercase">{testResult.provider || 'MFS'}</strong></p>
              {testResult.orderId && <p>Order Matched: <strong className="text-teal-300">{testResult.orderId} ({testResult.customerName})</strong></p>}
            </div>
          )}
        </div>

        {/* 3-Step Setup Guide */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-300">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>অ্যান্ড্রয়েড ফোনে ৩ মিনিটে সেটআপ করার নিয়ম:</span>
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>আপনার বিকাশ/নগদ সিমযুক্ত অ্যান্ড্রয়েড ফোনে <strong>"SMS Forwarder"</strong> বা <strong>"SMS to URL / Webhook"</strong> ফ্রি অ্যাপ নামান।</li>
            <li>অ্যাপটিতে নতুন ফরওয়ার্ডার যোগ করে Webhook URL-এ ওপরের লিংকটি পেস্ট করুন।</li>
            <li>ব্যাস! এখন শিক্ষার্থী টাকা পাঠালে আপনার ফোনে মেসেজ আসতেই ওয়েবসাইট স্বয়ংক্রিয়ভাবে অর্ডার ভেরিফাই করে ডাউনলোড লিংক দিয়ে দেবে।</li>
          </ol>
        </div>
      </div>

      {/* 2. Direct Payment Numbers Settings */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">
              সরাসরি পেমেন্ট নম্বর সেটিংস (bKash, Nagad, Rocket)
            </h2>
            <p className="text-[11px] text-slate-400">
              চেকআউটে শিক্ষার্থীদের প্রদর্শিত বিকাশ, নগদ ও রকেট সেন্ড মানি নম্বর
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-pink-400 mb-1.5">বিকাশ (bKash) নম্বর</label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={config.paymentSettings.bkashMerchantNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentSettings: { ...config.paymentSettings, bkashMerchantNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-orange-400 mb-1.5">নগদ (Nagad) নম্বর</label>
              <input
                type="text"
                placeholder="018XXXXXXXX"
                value={config.paymentSettings.nagadMerchantNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentSettings: { ...config.paymentSettings, nagadMerchantNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-400 mb-1.5">রকেট (Rocket) নম্বর</label>
              <input
                type="text"
                placeholder="019XXXXXXXX"
                value={config.paymentSettings.rocketMerchantNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentSettings: { ...config.paymentSettings, rocketMerchantNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Email Delivery (SMTP) */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">
              স্বয়ংক্রিয় ইমেইল ডেলিভারি (SMTP)
            </h2>
            <p className="text-[11px] text-slate-400">
              পেমেন্ট সফল হলে শিক্ষার্থীর ইমেইলে স্বয়ংক্রিয়ভাবে পিডিএফ ফাইল পাঠানোর কনফিগারেশন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">প্রেরকের নাম (Sender Name)</label>
            <input
              type="text"
              value={config.emailSettings.senderName}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, senderName: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">প্রেরকের ইমেইল (Sender Email)</label>
            <input
              type="email"
              value={config.emailSettings.senderEmail}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, senderEmail: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SMTP Host</label>
            <input
              type="text"
              value={config.emailSettings.smtpHost}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, smtpHost: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SMTP Port</label>
            <input
              type="number"
              value={config.emailSettings.smtpPort}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, smtpPort: parseInt(e.target.value) || 465 },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SMTP Username / Email</label>
            <input
              type="text"
              value={config.emailSettings.smtpUser}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, smtpUser: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SMTP App Password</label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              value={config.emailSettings.smtpPass}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emailSettings: { ...config.emailSettings, smtpPass: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Meta Pixel & Conversions API */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">
              মেটা পিক্সেল ও কনভার্শন API (Meta Pixel / CAPI)
            </h2>
            <p className="text-[11px] text-slate-400">
              ফেসবুক অ্যাডস ট্র্যাকিং ও পারচেজ ইভেন্ট অটোমেশন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Meta Pixel ID</label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={config.metaTracking.pixelId}
              onChange={(e) =>
                setConfig({
                  ...config,
                  metaTracking: { ...config.metaTracking, pixelId: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Conversions API Access Token</label>
            <input
              type="password"
              placeholder="EAAB..."
              value={config.metaTracking.conversionsApiToken}
              onChange={(e) =>
                setConfig({
                  ...config,
                  metaTracking: { ...config.metaTracking, conversionsApiToken: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
