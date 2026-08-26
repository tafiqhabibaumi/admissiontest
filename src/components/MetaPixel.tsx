'use client';

import React, { useEffect } from 'react';
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

// Utility to get cookies for Meta _fbp and _fbc
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Generate shared Event ID for 100% accurate Browser & Server Deduplication
export function generateEventId(prefix: string = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Master event tracker that fires both Browser Pixel and Server-Side CAPI synchronously
export function trackPixelEvent(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'AddPaymentInfo' | 'Purchase' | 'Contact' | 'Lead',
  params: Record<string, any> = {},
  userData: Record<string, any> = {},
  customEventId?: string
) {
  const eventId = customEventId || generateEventId(eventName.toLowerCase());

  // 1. Fire Browser Meta Pixel
  if (typeof window !== 'undefined') {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', eventName, params, { eventID: eventId });
      } catch (e) {
        console.warn('Browser Pixel warning:', e);
      }
    } else {
      window._fbq = window._fbq || [];
      if (typeof window.fbq === 'undefined') {
        window.fbq = function () {
          window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
        };
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
      }
      try {
        window.fbq('track', eventName, params, { eventID: eventId });
      } catch (e) {}
    }
  }

  // 2. Fire Server-Side Meta Conversions API (CAPI)
  if (typeof window !== 'undefined') {
    try {
      const fbp = getCookie('_fbp');
      const fbc = getCookie('_fbc');

      fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventId,
          eventSourceUrl: window.location.href,
          userData: {
            ...userData,
            fbp,
            fbc,
          },
          customData: {
            currency: 'BDT',
            value: params.value !== undefined ? params.value : 299,
            contentName: params.content_name || 'Admission Master Guide 2025-26',
            contentCategory: params.content_category || 'Education',
            orderId: params.order_id,
            ...params,
          },
        }),
      }).catch(() => {});
    } catch (e) {
      // Non-blocking
    }
  }

  return eventId;
}

export default function MetaPixel({ pixelId = '1808726510148350', enabled = true }: MetaPixelProps) {
  const activePixelId = pixelId || '1808726510148350';

  useEffect(() => {
    if (!activePixelId || !enabled || typeof window === 'undefined') return;

    // Capture fbclid from URL to set first-party _fbc cookie if present
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const fbclid = urlParams.get('fbclid');
      if (fbclid && !getCookie('_fbc')) {
        const creationTime = Date.now();
        document.cookie = `_fbc=fb.1.${creationTime}.${fbclid}; path=/; max-age=7776000; SameSite=Lax`;
      }
    } catch (err) {}

    // Track PageView on mount with deduplication
    trackPixelEvent('PageView');
  }, [activePixelId, enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="beforeInteractive"
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
            fbq('init', '${activePixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${activePixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
