'use client';

import React, { useEffect } from 'react';

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
    }
  }

  // 2. Fire Server-Side Meta Conversions API (CAPI)
  if (typeof window !== 'undefined') {
    try {
      const fbp = getCookie('_fbp');
      const fbc = getCookie('_fbc');
      const urlParams = new URLSearchParams(window.location.search);
      const testEventCode = urlParams.get('test_event_code') || undefined;

      fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventId,
          eventSourceUrl: window.location.href,
          testEventCode,
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

    // Send Server-side CAPI PageView
    trackPixelEvent('PageView');
  }, [activePixelId, enabled]);

  return null;
}
