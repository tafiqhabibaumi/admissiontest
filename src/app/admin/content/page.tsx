'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  FileText,
  Upload,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  MessageSquare,
  DollarSign,
  Star,
  Layers
} from 'lucide-react';
import { SiteConfig, ChapterData, SingleProductConfig } from '@/types';
import { defaultSiteConfig } from '@/data/defaultData';

export default function AdminContentEditorPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [activeTab, setActiveTab] = useState<'hero' | 'product' | 'chapters' | 'testimonials' | 'faqs' | 'uploads'>('hero');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert('কনফিগারেশন সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('packageId', 'master_guide');

    try {
      const res = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadMessage(`✓ ফাইল আপলোড সফল হয়েছে: ${data.fileName}`);
        setConfig({
          ...config,
          product: { ...config.product, pdfFileName: data.fileName },
        });
      } else {
        setUploadMessage(`ত্রুটি: ${data.error || 'আপলোড ব্যর্থ'}`);
      }
    } catch (err) {
      setUploadMessage('ফাইল আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            কনটেন্ট ও মাস্টার গাইড এডিটর
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ওয়েবসাইটের যেকোনো টেক্সট, মূল্য, ৫০টি অধ্যায়ের প্রায়োরিটি ও পিডিএফ ফাইল লাইভ এডিট করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>✓ সকল পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে এবং লাইভ ওয়েবসাইটে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hero' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>হিরো ও ব্যানার</span>
        </button>

        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'product' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>মাস্টার গাইড মূল্য ও ফিচার</span>
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chapters' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>৫০টি অধ্যায় প্রায়োরিটি ও স্কিপ ডাটা</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'testimonials' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>শিক্ষার্থীদের রিভিউ</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'faqs' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ প্রশ্নোত্তর</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'uploads' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>পিডিএফ আপলোড ও ফাইল</span>
        </button>
      </div>

      {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-serif">হিরো সেকশন টেক্সট</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ব্যাজ টেক্সট</label>
              <input
                type="text"
                value={config.hero.badge}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, badge: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">মূল শিরোনাম</label>
                <input
                  type="text"
                  value={config.hero.title}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">হাইলাইট শিরোনাম</label>
                <input
                  type="text"
                  value={config.hero.highlightTitle}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, highlightTitle: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">সাবটাইটেল</label>
              <textarea
                rows={3}
                value={config.hero.subtitle}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Single Product & Pricing */}
      {activeTab === 'product' && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-serif">একক মাস্টার গাইড পণ্য ও মূল্য</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">গাইডের শিরোনাম</label>
              <input
                type="text"
                value={config.product.title}
                onChange={(e) => setConfig({ ...config, product: { ...config.product, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ট্যাগ / ব্যাজ</label>
              <input
                type="text"
                value={config.product.tag}
                onChange={(e) => setConfig({ ...config, product: { ...config.product, tag: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">রেগুলার মূল্য (৳)</label>
              <input
                type="number"
                value={config.product.originalPrice}
                onChange={(e) => setConfig({ ...config, product: { ...config.product, originalPrice: Number(e.target.value) } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">অফার মূল্য (৳)</label>
              <input
                type="number"
                value={config.product.discountPrice}
                onChange={(e) => setConfig({ ...config, product: { ...config.product, discountPrice: Number(e.target.value) } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">সংযুক্ত PDF ফাইলের নাম</label>
              <input
                type="text"
                value={config.product.pdfFileName}
                onChange={(e) => setConfig({ ...config, product: { ...config.product, pdfFileName: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">ফিচার পয়েন্টসমূহ (প্রতি লাইনে একটি)</label>
            <textarea
              rows={5}
              value={config.product.features.join('\n')}
              onChange={(e) => setConfig({ ...config, product: { ...config.product, features: e.target.value.split('\n') } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Chapters */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-serif">৫০টি অধ্যায়ের অগ্রাধিকার ডাটা</h2>
            <span className="text-xs text-slate-400 font-mono">মোট অধ্যায়: {config.chapters.length} টি</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {config.chapters.map((ch, idx) => (
              <div key={ch.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {ch.subjectTitle} • Ch {ch.chapterNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white font-serif">{ch.chapterName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={ch.rating}
                      onChange={(e) => {
                        const updated = [...config.chapters];
                        updated[idx].rating = Number(e.target.value) as any;
                        setConfig({ ...config, chapters: updated });
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold"
                    >
                      <option value="5">★★★★★ Must Study</option>
                      <option value="4">★★★★ Important</option>
                      <option value="3">★★★ Low / Skip</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">BUET Importance</label>
                    <input
                      type="text"
                      value={ch.buetImportance}
                      onChange={(e) => {
                        const updated = [...config.chapters];
                        updated[idx].buetImportance = e.target.value;
                        setConfig({ ...config, chapters: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Other Uni (CKReUT/IUT) Importance</label>
                    <input
                      type="text"
                      value={ch.otherUniImportance}
                      onChange={(e) => {
                        const updated = [...config.chapters];
                        updated[idx].otherUniImportance = e.target.value;
                        setConfig({ ...config, chapters: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-emerald-400 font-bold mb-0.5">What to Study</label>
                  <textarea
                    rows={2}
                    value={ch.whatToStudy}
                    onChange={(e) => {
                      const updated = [...config.chapters];
                      updated[idx].whatToStudy = e.target.value;
                      setConfig({ ...config, chapters: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-rose-400 font-bold mb-0.5">What Can Be Skipped</label>
                  <textarea
                    rows={2}
                    value={ch.whatToSkip}
                    onChange={(e) => {
                      const updated = [...config.chapters];
                      updated[idx].whatToSkip = e.target.value;
                      setConfig({ ...config, chapters: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-rose-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          {config.testimonials.map((t, idx) => (
            <div key={t.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => {
                    const updated = [...config.testimonials];
                    updated[idx].name = e.target.value;
                    setConfig({ ...config, testimonials: updated });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={t.dept}
                  onChange={(e) => {
                    const updated = [...config.testimonials];
                    updated[idx].dept = e.target.value;
                    setConfig({ ...config, testimonials: updated });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={t.institution}
                  onChange={(e) => {
                    const updated = [...config.testimonials];
                    updated[idx].institution = e.target.value;
                    setConfig({ ...config, testimonials: updated });
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <textarea
                rows={2}
                value={t.quote}
                onChange={(e) => {
                  const updated = [...config.testimonials];
                  updated[idx].quote = e.target.value;
                  setConfig({ ...config, testimonials: updated });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {config.faqs.map((faq, idx) => (
            <div key={faq.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => {
                  const updated = [...config.faqs];
                  updated[idx].question = e.target.value;
                  setConfig({ ...config, faqs: updated });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => {
                  const updated = [...config.faqs];
                  updated[idx].answer = e.target.value;
                  setConfig({ ...config, faqs: updated });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: PDF Upload */}
      {activeTab === 'uploads' && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-serif">মাস্টার গাইড PDF আপলোড</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            আপনার আসল পিডিএফ ফাইলটি এখানে আপলোড করুন। এটি স্বয়ংক্রিয়ভাবে ডাউনলোড ও ইমেইল ডেলিভারিতে সেট হয়ে যাবে।
          </p>

          <div className="pt-3">
            <label className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer inline-flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploadingPdf ? 'আপলোড হচ্ছে...' : 'কম্পিউটার থেকে PDF ফাইল সিলেক্ট করুন'}</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
            </label>
          </div>

          {uploadMessage && (
            <p className="text-xs font-semibold text-emerald-400 mt-2">{uploadMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
