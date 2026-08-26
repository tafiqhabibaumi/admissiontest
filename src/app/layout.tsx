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
  const pixelId = config.metaTracking?.pixelId || '1808726510148350';
  const isMetaEnabled = config.metaTracking?.enabled !== false;

  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#07090e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Official Meta Pixel Script in <head> for Instant Execution */}
        {isMetaEnabled && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body
        className="bg-[#07090e] text-slate-100 antialiased min-h-screen relative selection:bg-emerald-500 selection:text-white overflow-x-hidden"
      >
        <MetaPixel
          pixelId={pixelId}
          enabled={isMetaEnabled}
        />
        <ParticleBackground />
        <div className="relative z-10 w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
