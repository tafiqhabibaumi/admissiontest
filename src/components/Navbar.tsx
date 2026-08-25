'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, Zap, Menu, X, BookOpen } from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';

interface NavbarProps {
  onOpenCheckout?: () => void;
  whatsappNumber?: string;
}

export default function Navbar({ onOpenCheckout, whatsappNumber = "+8801700000000" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 48, seconds: 12 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification Urgency Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-indigo-950 border-b border-emerald-500/20 text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center text-slate-300 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 relative z-50">
        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold">
          🔥 ৫০% বিশেষ ছাড়
        </span>
        <span className="text-[11px] sm:text-xs">অফার শেষ হতে বাকি:</span>
        <div className="flex items-center gap-0.5 font-mono font-bold text-amber-400 bg-black/50 px-1.5 py-0.5 rounded text-[11px] sm:text-xs border border-amber-400/20">
          <span>{toBengaliNumber(String(timeLeft.hours).padStart(2, '0'))}</span>:
          <span>{toBengaliNumber(String(timeLeft.minutes).padStart(2, '0'))}</span>:
          <span>{toBengaliNumber(String(timeLeft.seconds).padStart(2, '0'))}</span>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5 sm:py-3'
            : 'bg-slate-950/70 backdrop-blur-md py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white font-serif">
                  অ্যাডমিশন <span className="text-gradient-emerald">মাস্টার গাইড</span>
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
                সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('chapter-matrix')} className="hover:text-emerald-400 transition-colors">
              ৫০টি অধ্যায় বিশ্লেষণ
            </button>
            <button onClick={() => scrollToSection('roadmap')} className="hover:text-emerald-400 transition-colors">
              ১২ সপ্তাহের প্ল্যান
            </button>
            <button onClick={() => scrollToSection('daily-routine')} className="hover:text-emerald-400 transition-colors">
              দৈনিক রুটিন
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-400 transition-colors">
              ফি ও ডিসকাউন্ট
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-emerald-400 transition-colors">
              রিভিউ
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-400 transition-colors">
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenCheckout ? onOpenCheckout : () => scrollToSection('pricing')}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs sm:text-sm shadow-md"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600"></span>
              <span className="relative flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-950 rounded-[11px] text-white transition-all text-xs sm:text-sm">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>গাইডটি নিন</span>
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-4 py-4 space-y-2.5 animate-fadeIn">
            <button onClick={() => scrollToSection('chapter-matrix')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              📊 ৫০টি অধ্যায় প্রায়োরিটি ও স্কিপ-লিস্ট
            </button>
            <button onClick={() => scrollToSection('roadmap')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              📅 ১২ সপ্তাহের দিনভিত্তিক স্টাডি প্ল্যান
            </button>
            <button onClick={() => scrollToSection('daily-routine')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              ⏰ ৬-ব্লকের টেকসই দৈনিক রুটিন
            </button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              ⚡ সম্পূর্ণ মাস্টার গাইড ফি (৳২৯৯)
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              💬 শিক্ষার্থীদের রিভিউ
            </button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 border-b border-slate-900">
              ❓ সাধারণ জিজ্ঞাসা (FAQ)
            </button>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>সরাসরি WhatsApp হেল্পলাইনে কথা বলুন</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
