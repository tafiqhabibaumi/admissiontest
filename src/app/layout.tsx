import type { Metadata } from 'next';
import './globals.css';
import { getSiteConfig } from '@/lib/db';
import MetaPixel from '@/components/MetaPixel';
import ParticleBackground from '@/components/ParticleBackground';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSiteConfig();
  return {
    title: `${config.hero.title} ${config.hero.highlightTitle} | সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং ২০২৫`,
    description: config.hero.subtitle,
    keywords: [
      'BUET admission suggestion',
      'বুয়েট সাজেশন',
      'RUET CUET KUET suggestion',
      'CKReUT admission guide',
      'Engineering admission suggestion Bangladesh',
      'বুয়েট ভর্তি পরীক্ষা ২০২৫',
      'ইঞ্জিনিয়ারিং চ্যাপ্টার ভিত্তিক পড়ার সময়',
      'Admission what to skip list'
    ],
    openGraph: {
      title: `${config.hero.title} ${config.hero.highlightTitle}`,
      description: config.hero.subtitle,
      type: 'website',
      locale: 'bn_BD',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();

  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#07090e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#07090e] text-slate-100 antialiased min-h-screen relative selection:bg-emerald-500 selection:text-white overflow-x-hidden"
      >
        <MetaPixel
          pixelId={config.metaTracking.pixelId}
          enabled={config.metaTracking.enabled}
        />
        <ParticleBackground />
        <div className="relative z-10 w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
