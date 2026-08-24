import { NextResponse } from 'next/server';
import { getSiteConfig, getOrders, saveOrder, saveTransaction } from '@/lib/db';
import { parseMfsSms } from '@/lib/smsParser';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

// Process and match incoming SMS transaction with pending orders
async function processIncomingSms(smsText: string, origin: string) {
  const parsed = parseMfsSms(smsText);
  if (!parsed || !parsed.trxId) {
    return { success: false, error: 'Could not extract valid TrxID from SMS text' };
  }

  // 1. Save to transactions ledger buffer
  saveTransaction(parsed);

  const cleanTrx = parsed.trxId.trim().toUpperCase();

  // 2. Search pending orders
  const orders = getOrders();
  const matchedOrder = orders.find(
    (o) =>
      o.paymentStatus === 'pending' &&
      o.manualTrxId &&
      o.manualTrxId.trim().toUpperCase() === cleanTrx
  );

  if (matchedOrder) {
    matchedOrder.paymentStatus = 'completed';
    matchedOrder.transactionId = cleanTrx;
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
      trxId: cleanTrx,
      amount: parsed.amount,
      provider: parsed.provider,
    };
  }

  return {
    success: true,
    matched: false,
    message: 'SMS parsed and logged to buffer. Awaiting customer checkout submission.',
    trxId: cleanTrx,
    amount: parsed.amount,
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
      service: 'bKash / Nagad / Rocket Android SMS Webhook Auto-Validator',
      usage: 'Send HTTP POST with { "message": "You have received Tk 499.00 from ... TrxID 9J7X8KL9" }',
    });
  }

  const result = await processIncomingSms(smsText, url.origin);
  return NextResponse.json(result);
}
