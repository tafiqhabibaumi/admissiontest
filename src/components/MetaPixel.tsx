'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId?: string;
  enabled?: boolean;
}

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export function trackPixelEvent(
  eventName: string,
  params?: Record<string, any>,
  customData?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, {
      ...params,
      ...customData,
    });
  }

  // Also send to server-side Meta Conversions API (CAPI)
  try {
    fetch('/api/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        customData: {
          ...params,
          ...customData,
        },
      }),
    }).catch(() => {});
  } catch (e) {
    // Ignore fetch error
  }
}

export default function MetaPixel({ pixelId, enabled = true }: MetaPixelProps) {
  useEffect(() => {
    if (pixelId && enabled) {
      trackPixelEvent('PageView');
    }
  }, [pixelId, enabled]);

  if (!pixelId || !enabled) return null;

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
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
  );
}
