import { getSiteConfig } from './db';

interface MetaCapiEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase' | 'Contact' | 'Lead';
  eventSourceUrl: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    contentName?: string;
    contentCategory?: string;
    orderId?: string;
    predictedLtv?: number;
  };
}

// Simple SHA-256 hash function for User Data Normalization (Meta standard)
async function sha256(str: string): Promise<string> {
  const normalized = str.trim().toLowerCase();
  const buffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<boolean> {
  const config = getSiteConfig();
  const { pixelId, conversionsApiToken, testEventCode, enabled } = config.metaTracking;

  if (!enabled || !pixelId || !conversionsApiToken) {
    // Tracking is disabled or keys not configured yet
    return false;
  }

  try {
    const hashedEmail = payload.userData?.email ? await sha256(payload.userData.email) : undefined;
    const hashedPhone = payload.userData?.phone ? await sha256(payload.userData.phone.replace(/[^0-9]/g, '')) : undefined;

    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const body: any = {
      data: [
        {
          event_name: payload.eventName,
          event_time: eventTime,
          event_id: eventId,
          event_source_url: payload.eventSourceUrl,
          action_source: 'website',
          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            client_ip_address: payload.userData?.clientIpAddress,
            client_user_agent: payload.userData?.clientUserAgent,
          },
          custom_data: payload.customData,
        },
      ],
    };

    if (testEventCode) {
      body.test_event_code = testEventCode;
    }

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${conversionsApiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const resJson = await res.json();
    return res.ok && resJson.events_received > 0;
  } catch (error) {
    console.error('Meta CAPI Error:', error);
    return false;
  }
}
