import { NextResponse } from 'next/server';
import { getOrderById, saveOrder, findTransactionByPhoneAndAmount, findTransactionByTrxId } from '@/lib/db';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const phone = url.searchParams.get('phone');
    const amountStr = url.searchParams.get('amount');
    const amount = amountStr ? parseFloat(amountStr) : 299;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 1. If already completed, return immediately
    if (order.paymentStatus === 'completed') {
      return NextResponse.json({
        verified: true,
        orderId: order.id,
        trxId: order.transactionId || order.manualTrxId,
        downloadToken: order.downloadToken,
      });
    }

    // 2. Search for any freshly arrived SMS transaction by phone & amount
    const lookupPhone = phone || order.customerPhone;
    const matchedTrx = findTransactionByPhoneAndAmount(lookupPhone, amount);

    if (matchedTrx) {
      order.paymentStatus = 'completed';
      order.transactionId = matchedTrx.trxId;
      order.manualTrxId = matchedTrx.trxId;
      order.updatedAt = new Date().toISOString();
      saveOrder(order);

      const origin = request.headers.get('origin') || url.origin || 'http://localhost:3000';
      sendSuggestionEmail(order, origin).then((sent) => {
        if (sent) {
          order.emailSent = true;
          saveOrder(order);
        }
      }).catch((err) => console.error('Email error:', err));

      sendMetaCapiEvent({
        eventName: 'Purchase',
        eventSourceUrl: `${origin}/order-status/${order.id}`,
        userData: {
          email: order.customerEmail,
          phone: order.customerPhone,
          firstName: order.customerName,
        },
        customData: {
          currency: 'BDT',
          value: order.amount,
          contentName: order.packageTitle,
          orderId: order.id,
        },
      }).catch(() => {});

      return NextResponse.json({
        verified: true,
        orderId: order.id,
        trxId: matchedTrx.trxId,
        downloadToken: order.downloadToken,
      });
    }

    // 3. Still pending (waiting for Android forwarder SMS)
    return NextResponse.json({
      verified: false,
      orderId: order.id,
      paymentStatus: 'pending',
    });
  } catch (error: any) {
    console.error('Polling error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
