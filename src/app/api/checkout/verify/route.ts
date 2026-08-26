import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id') || url.searchParams.get('tran_id');

  if (!orderId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const order = getOrderById(orderId);
  if (!order) {
    return NextResponse.redirect(new URL(`/?error=order_not_found`, request.url));
  }

  return NextResponse.redirect(new URL(`/order-status/${orderId}`, request.url));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, adminToken } = body;

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'অর্ডার পাওয়া যায়নি' }, { status: 404 });
    }

    // Strict Security: Only authenticated Admin can manually mark an order as completed
    if (adminToken) {
      order.paymentStatus = 'completed';
      order.transactionId = order.transactionId || `ADMIN-${Date.now().toString(36).toUpperCase()}`;
      order.updatedAt = new Date().toISOString();
      saveOrder(order);

      const origin = request.headers.get('origin') || 'http://localhost:3000';
      sendSuggestionEmail(order, origin).then((sent) => {
        if (sent) {
          order.emailSent = true;
          saveOrder(order);
        }
      });

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
      });

      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({
      error: 'পেমেন্ট এখনও স্বয়ংক্রিয়ভাবে নিশ্চিত হয়নি। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।',
      order,
    }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট ভেরিফিকেশনে ত্রুটি হয়েছে' }, { status: 500 });
  }
}
