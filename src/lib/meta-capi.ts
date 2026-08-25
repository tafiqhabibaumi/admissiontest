import { getSiteConfig } from './db';

export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  contentType?: string;
  numItems?: number;
  orderId?: string;
  status?: string;
}

export interface MetaCapiEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'AddPaymentInfo' | 'Purchase' | 'Contact' | 'Lead';
  eventSourceUrl: string;
  eventId?: string;
  userData?: MetaUserData;
  customData?: MetaCustomData;
}

// SHA-256 hash function compliant with Meta Conversions API specifications
async function sha256(str: string): Promise<string> {
  const normalized = str.trim().toLowerCase();
  const buffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Format Bangladeshi phone number for Meta (E.164 standard without plus: 8801XXXXXXXXX)
function formatPhoneForMeta(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '88' + digits;
  }
  return digits;
}

export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<boolean> {
  try {
    const config = getSiteConfig();
    const { pixelId, conversionsApiToken, testEventCode, enabled } = config.metaTracking;

    if (!enabled || !pixelId || !conversionsApiToken) {
      // Tracking is disabled or credentials not provided yet in admin settings
      return false;
    }

    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = payload.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Hash user identity fields for maximum Event Match Quality (EMQ)
    const em = payload.userData?.email ? [await sha256(payload.userData.email)] : undefined;
    const ph = payload.userData?.phone ? [await sha256(formatPhoneForMeta(payload.userData.phone))] : undefined;
    const fn = payload.userData?.firstName ? [await sha256(payload.userData.firstName.split(' ')[0])] : undefined;
    const country = [await sha256('bd')]; // Bangladesh

    const userDataObj: Record<string, any> = {
      country,
      client_ip_address: payload.userData?.clientIpAddress || undefined,
      client_user_agent: payload.userData?.clientUserAgent || undefined,
    };

    if (em) userDataObj.em = em;
    if (ph) userDataObj.ph = ph;
    if (fn) userDataObj.fn = fn;
    if (payload.userData?.fbp) userDataObj.fbp = payload.userData.fbp;
    if (payload.userData?.fbc) userDataObj.fbc = payload.userData.fbc;

    const formattedCustomData: Record<string, any> = {
      currency: payload.customData?.currency || 'BDT',
      value: payload.customData?.value !== undefined ? payload.customData.value : 299,
      content_name: payload.customData?.contentName || 'Admission Master Guide 2025-26',
      content_type: 'product',
      content_category: payload.customData?.contentCategory || 'Education/Exam Preparation',
    };

    if (payload.customData?.orderId) {
      formattedCustomData.order_id = payload.customData.orderId;
    }

    const eventData: any = {
      event_name: payload.eventName,
      event_time: eventTime,
      event_id: eventId,
      event_source_url: payload.eventSourceUrl,
      action_source: 'website',
      user_data: userDataObj,
      custom_data: formattedCustomData,
    };

    const requestBody: any = {
      data: [eventData],
    };

    if (testEventCode) {
      requestBody.test_event_code = testEventCode;
    }

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${conversionsApiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const resJson = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn('Meta CAPI response warning:', resJson);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Meta CAPI Network Error:', error);
    return false;
  }
}
