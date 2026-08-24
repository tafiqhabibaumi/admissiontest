export interface ChapterData {
  id: string;
  chapterNumber: number | string;
  subject: 'physics-1' | 'physics-2' | 'chem-1' | 'chem-2' | 'math-1' | 'math-2';
  subjectTitle: string;
  paper: '1st' | '2nd';
  chapterName: string;
  rating: 5 | 4 | 3 | 2;
  ratingLabel: string;
  prevFreq: string;
  buetImportance: string;
  otherUniImportance: string;
  whatToStudy: string;
  whatToSkip: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  dept: string;
  institution: string;
  batch: string;
  quote: string;
  rating: number;
  avatarUrl: string;
}

export interface PackageItem {
  id: string;
  title: string;
  tag: string;
  originalPrice: number;
  discountPrice: number;
  popular?: boolean;
  features: string[];
  universities: string[];
  pdfFileName: string;
  description: string;
}

export interface SingleProductConfig {
  title: string;
  subtitle: string;
  tag: string;
  originalPrice: number;
  discountPrice: number;
  features: string[];
  pdfFileName: string;
  universitiesCovered: string[];
}

export interface SiteConfig {
  hero: {
    badge: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    ctaButtonText: string;
    secondaryCtaText: string;
    offerCountdownEnd: string;
    bannerNotice: string;
  };
  product: SingleProductConfig;
  contact: {
    whatsappNumber: string;
    supportEmail: string;
    helpline: string;
    facebookPageUrl: string;
  };
  metaTracking: {
    pixelId: string;
    conversionsApiToken: string;
    testEventCode: string;
    enabled: boolean;
  };
  paymentSettings: {
    bkashMerchantNumber: string;
    nagadMerchantNumber: string;
    rocketMerchantNumber: string;
    smsWebhookKey?: string;
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    senderName: string;
    senderEmail: string;
  };
  chapters: ChapterData[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  targetUniversity: string;
  hscBatch: string;
  packageId: string;
  packageTitle: string;
  amount: number;
  currency: 'BDT';
  paymentMethod: string;
  manualTrxId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  downloadToken: string;
  downloadCount: number;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}
