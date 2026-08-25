import { NextResponse } from 'next/server';
import { getSiteConfig, getOrders, saveOrder, saveTransaction, findPendingOrderByPhoneAndAmount } from '@/lib/db';
import { parseMfsSms, normalizePhoneNumber } from '@/lib/smsParser';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

// Process and match incoming SMS transaction with pending orders in realtime
async function processIncomingSms(smsText: string, origin: string) {
  const parsed = parseMfsSms(smsText);
  if (!parsed || (!parsed.trxId && parsed.amount <= 0)) {
    return { success: false, error: 'Could not extract valid transaction from SMS text' };
  }

  // 1. Save to transactions ledger buffer
  saveTransaction(parsed);

  const cleanTrx = parsed.trxId ? parsed.trxId.trim().toUpperCase() : '';
  const senderDigits = parsed.senderPhone ? normalizePhoneNumber(parsed.senderPhone) : '';

  // 2. Search pending orders by Phone & Amount OR by TrxID
  const orders = getOrders();
  let matchedOrder = orders.find((o) => {
    if (o.paymentStatus !== 'pending') return false;

    // Check TrxID match if provided
    if (cleanTrx && o.manualTrxId && o.manualTrxId.trim().toUpperCase() === cleanTrx) {
      return true;
    }

    // Check Phone & Amount match (realtime auto-verification)
    if (senderDigits && o.customerPhone && Math.abs(o.amount - parsed.amount) <= 1) {
      const orderPhone = normalizePhoneNumber(o.customerPhone);
      if (
        orderPhone === senderDigits ||
        orderPhone.slice(-10) === senderDigits.slice(-10) ||
        senderDigits.slice(-10) === orderPhone.slice(-10)
      ) {
        return true;
      }
    }

    return false;
  });

  if (matchedOrder) {
    matchedOrder.paymentStatus = 'completed';
    matchedOrder.transactionId = cleanTrx || matchedOrder.manualTrxId || `TRX-${Date.now().toString(36).toUpperCase()}`;
    matchedOrder.manualTrxId = matchedOrder.transactionId;
    matchedOrder.updatedAt = new Date().toISOString();

    saveOrder(matchedOrder);

    // Dispatch PDF email
    sendSuggestionEmail(matchedOrder, origin)
      .then((sent) => {
        if (sent) {
          matchedOrder.emailSent = true;
          saveOrder(matchedOrder);
        }
      })
      .catch((err) => console.error('Auto-email sending error:', err));

    // Dispatch Meta CAPI Purchase event
    sendMetaCapiEvent({
      eventName: 'Purchase',
      eventSourceUrl: `${origin}/order-status/${matchedOrder.id}`,
      userData: {
        email: matchedOrder.customerEmail,
        phone: matchedOrder.customerPhone,
        firstName: matchedOrder.customerName,
      },
      customData: {
        currency: 'BDT',
        value: matchedOrder.amount,
        contentName: matchedOrder.packageTitle,
        orderId: matchedOrder.id,
      },
    }).catch((err) => console.error('Meta CAPI error:', err));

    return {
      success: true,
      matched: true,
      orderId: matchedOrder.id,
      customerName: matchedOrder.customerName,
      customerPhone: matchedOrder.customerPhone,
      trxId: cleanTrx,
      amount: parsed.amount,
      provider: parsed.provider,
    };
  }

  return {
    success: true,
    matched: false,
    message: 'SMS parsed and logged to buffer. Ready for customer phone/amount verification.',
    trxId: cleanTrx,
    amount: parsed.amount,
    senderPhone: parsed.senderPhone,
    provider: parsed.provider,
  };
}

export async function POST(request: Request) {
  try {
    const config = getSiteConfig();
    const expectedKey = config.paymentSettings.smsWebhookKey || 'AumiWebhook2026';

    const url = new URL(request.url);
    const keyParam = url.searchParams.get('key') || url.searchParams.get('secret') || request.headers.get('x-webhook-key') || '';

    // Parse various JSON and Form payloads from different Android SMS apps
    let smsText = '';
    let sender = '';
    let payloadKey = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await request.json().catch(() => ({}));
      smsText = json.message || json.text || json.sms || json.body || json.content || json.msg || '';
      sender = json.from || json.sender || json.number || '';
      payloadKey = json.key || json.secret || json.token || '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => new FormData());
      smsText = (formData.get('message') || formData.get('text') || formData.get('sms') || formData.get('body') || formData.get('content') || '') as string;
      sender = (formData.get('from') || formData.get('sender') || formData.get('number') || '') as string;
      payloadKey = (formData.get('key') || formData.get('secret') || '') as string;
    } else {
      smsText = await request.text().catch(() => '');
    }

    // Verify secret key (if set)
    const providedKey = keyParam || payloadKey;
    if (expectedKey && providedKey && providedKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized: Invalid secret webhook key' }, { status: 401 });
    }

    if (!smsText) {
      return NextResponse.json({ error: 'Empty SMS text received' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || url.origin || 'http://localhost:3000';
    const result = await processIncomingSms(smsText, origin);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SMS Webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const smsText = url.searchParams.get('message') || url.searchParams.get('text') || url.searchParams.get('sms') || '';
  const keyParam = url.searchParams.get('key') || url.searchParams.get('secret') || '';

  const config = getSiteConfig();
  const expectedKey = config.paymentSettings.smsWebhookKey || 'AumiWebhook2026';

  if (expectedKey && keyParam && keyParam !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized: Invalid secret key' }, { status: 401 });
  }

  if (!smsText) {
    return NextResponse.json({
      status: 'active',
      service: 'bKash / Nagad / Rocket Realtime Auto-Validator',
      usage: 'Send HTTP POST with { "message": "You have received Tk 499.00 from 017... TrxID ..." }',
    });
  }

  const result = await processIncomingSms(smsText, url.origin);
  return NextResponse.json(result);
}
