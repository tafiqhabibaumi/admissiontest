'use client';

import React from 'react';
import SingleProductPricing from './SingleProductPricing';
import { SingleProductConfig } from '@/types';

interface PricingSectionProps {
  product?: SingleProductConfig;
  onOpenCheckout: () => void;
}

export default function PricingSection({ product, onOpenCheckout }: PricingSectionProps) {
  const fallbackProduct: SingleProductConfig = product || {
    title: 'অল-ভার্সিটি সায়েন্স অ্যাডমিশন মাস্টার সাজেশন ও স্ট্র্যাটেজি গাইড ২০২৬-২৭',
    subtitle: '৫০টি অধ্যায়ের প্রায়োরিটি ও ৩ মাসের ফুল রোডম্যাপ',
    tag: 'একক কমপ্লিট মাস্টার এডিশন (All-in-One)',
    originalPrice: 999,
    discountPrice: 299,
    pdfFileName: 'all_science_admission_master_guide_2026.pdf',
    universitiesCovered: ['BUET', 'CUET', 'RUET', 'KUET', 'IUT', 'DU A-Unit', 'BUTEX', 'GST'],
    features: [
      'সব ৫০টি অধ্যায়ের সম্পূর্ণ প্রায়োরিটি বিশ্লেষণ',
      'বিগত ১৫ বছরের প্রশ্ন গুরুত্ব বিশ্লেষণ',
      'কী কী টপিক পড়বেন ও কী কী বাদ দেবেন (Time Saving Skip-List)',
      '৩ মাসের ১২ সপ্তাহের দিনভিত্তিক স্টাডি প্ল্যান ও মিস্টেক ট্র্যাকার'
    ]
  };

  return <SingleProductPricing product={fallbackProduct} onOpenCheckout={onOpenCheckout} />;
}
