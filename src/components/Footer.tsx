'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, MessageCircle, Phone, Mail, ShieldCheck, Lock } from 'lucide-react';
import { SiteConfig } from '@/types';

interface FooterProps {
  contact: SiteConfig['contact'];
}

export default function Footer({ contact }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-14 pb-10 px-3 sm:px-6 relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 border-b border-slate-800/60">
        {/* Col 1: Brand */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-white">
              অ্যাডমিশন <span className="text-gradient-emerald">মাস্টার গাইড</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            বাংলাদেশের সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষার জন্য ৫০টি অধ্যায়ের সম্পূর্ণ প্রায়োরিটি বিশ্লেষণ, স্কিপ-লিস্ট, ৩ মাসের দিনভিত্তিক স্টাডি প্ল্যান ও দৈনিক রুটিন সংবলিত পূর্ণাঙ্গ মাস্টার গাইডলাইন।
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>১০০% নিরাপদ ও নির্ভরযোগ্য এডুকেশন প্ল্যাটফর্ম</span>
          </div>
        </div>

        {/* Col 2: Fast Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            প্রয়োজনীয় লিংক
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#chapter-matrix" className="hover:text-emerald-400 transition-colors">
                • ৫০টি অধ্যায় প্রায়োরিটি ও স্কিপ-লিস্ট
              </a>
            </li>
            <li>
              <a href="#roadmap" className="hover:text-emerald-400 transition-colors">
                • ১২ সপ্তাহের দিনভিত্তিক স্টাডি প্ল্যান
              </a>
            </li>
            <li>
              <a href="#daily-routine" className="hover:text-emerald-400 transition-colors">
                • ৬-ব্লকের বিজ্ঞানসম্মত দৈনিক রুটিন
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                • মাস্টার গাইড ফি ও ডিসকাউন্ট
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
                • টপারদের রিভিউ ও ফলাফল
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-emerald-400 transition-colors">
                • সাধারণ জিজ্ঞাসা (FAQ)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact & 24/7 Helpline */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            যোগাযোগ ও সহায়তা
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a
                href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>হোয়াটসঅ্যাপ: {contact.whatsappNumber}</span>
              </a>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>হেল্পলাইন: {contact.helpline || contact.whatsappNumber}</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>ইমেইল: {contact.supportEmail}</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Payment Partners & Admin */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            পেমেন্ট মেথড
          </h4>
          <p className="text-xs text-slate-400">
            বিকাশ, নগদ ও রকেট সেন্ড মানির মাধ্যমে সরাসরি নিরাপদ পেমেন্ট ও অটোমেটেড ডেলিভারি।
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-1.5 bg-white border border-slate-700 rounded-lg flex items-center justify-center shadow-sm">
              <img src="/images/payment/bkash.svg" alt="bKash" className="h-5 object-contain" />
            </div>
            <div className="p-1.5 bg-white border border-slate-700 rounded-lg flex items-center justify-center shadow-sm">
              <img src="/images/payment/nagad.png" alt="Nagad" className="h-5 object-contain" />
            </div>
            <div className="p-1.5 bg-white border border-slate-700 rounded-lg flex items-center justify-center shadow-sm">
              <img src="/images/payment/rocket.svg" alt="Rocket" className="h-5 object-contain" />
            </div>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>এডমিন প্যানেল প্রবেশ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} All Science Admission Mentorship & Master Suggestion.</p>
        <p>Built for all university science & engineering admissions in Bangladesh</p>
      </div>
    </footer>
  );
}
