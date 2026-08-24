'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UniversityLogosBanner from '@/components/UniversityLogosBanner';
import Cinematic3DWalkthrough from '@/components/Cinematic3DWalkthrough';
import ChapterAnalyzer from '@/components/ChapterAnalyzer';
import BookPreviewCarousel from '@/components/BookPreviewCarousel';
import RoadmapSection from '@/components/RoadmapSection';
import DailyRoutineSection from '@/components/DailyRoutineSection';
import SingleProductPricing from '@/components/SingleProductPricing';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import StickyCtaBar from '@/components/StickyCtaBar';
import LiveSalesTicker from '@/components/LiveSalesTicker';
import Footer from '@/components/Footer';
import CheckoutModal from '@/components/CheckoutModal';
import { defaultSiteConfig } from '@/data/defaultData';
import { SiteConfig } from '@/types';
import { trackPixelEvent } from '@/components/MetaPixel';

export default function LandingPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log('Loaded default config', err));

    trackPixelEvent('ViewContent', {
      content_name: 'All University Science Admission Master Guide Landing Page',
      content_category: 'Admission Preparation',
    });
  }, []);

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 relative selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        onOpenCheckout={handleOpenCheckout}
        whatsappNumber={config.contact.whatsappNumber}
      />

      {/* 3D Hero Section */}
      <HeroSection
        hero={config.hero}
        product={config.product}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Top University Logos Ribbon */}
      <UniversityLogosBanner />

      {/* 3D Cinematic Interactive Playthrough / Walkthrough */}
      <Cinematic3DWalkthrough
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 50-Chapter Priority & Skip Matrix */}
      <ChapterAnalyzer
        chapters={config.chapters}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 3D Look-Inside PDF Carousel */}
      <BookPreviewCarousel
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 12-Week Day-by-Day Roadmap */}
      <RoadmapSection
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Sustainable Daily Routine */}
      <DailyRoutineSection />

      {/* Single Master Product Pricing Section */}
      <SingleProductPricing
        product={config.product}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Verified Student Reviews */}
      <Testimonials
        testimonials={config.testimonials}
      />

      {/* FAQ Accordion */}
      <FaqSection
        faqs={config.faqs}
      />

      {/* Footer */}
      <Footer
        contact={config.contact}
      />

      {/* Sticky Conversion Bar */}
      <StickyCtaBar
        onOpenCheckout={handleOpenCheckout}
        product={config.product}
      />

      {/* Live Purchase Social Proof Ticker */}
      <LiveSalesTicker />

      {/* Single Product Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={config.product}
        paymentSettings={config.paymentSettings}
      />
    </main>
  );
}
