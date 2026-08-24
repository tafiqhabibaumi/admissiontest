import { NextResponse } from 'next/server';
import { getSiteConfig, saveOrder, findTransactionByTrxId } from '@/lib/db';
import { Order } from '@/types';
import { generateOrderId, generateToken } from '@/lib/utils';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, targetUniversity, hscBatch, paymentMethod, manualTrxId } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে আপনার নাম, ইমেইল ও মোবাইল নম্বর দিন' }, { status: 400 });
    }

    const config = getSiteConfig();
    const product = config.product;

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const orderId = generateOrderId();
    const downloadToken = generateToken();

    // Check if the SMS for this TrxID already arrived via Webhook
    const cleanTrx = manualTrxId ? manualTrxId.trim().toUpperCase() : '';
    const cachedTrx = cleanTrx ? findTransactionByTrxId(cleanTrx) : null;
    const isAutoVerified = !!cachedTrx;

    const order: Order = {
      id: orderId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      targetUniversity: targetUniversity || 'সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং',
      hscBatch: hscBatch || 'HSC 2024/2025',
      packageId: 'all-science-master-guide',
      packageTitle: product.title,
      amount: product.discountPrice,
      currency: 'BDT',
      paymentMethod: paymentMethod || 'manual_bkash',
      manualTrxId: cleanTrx || undefined,
      transactionId: isAutoVerified ? cleanTrx : undefined,
      paymentStatus: isAutoVerified ? 'completed' : 'pending',
      downloadToken: downloadToken,
      downloadCount: 0,
      emailSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrder(order);

    if (isAutoVerified) {
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
          email,
          phone,
          firstName: name,
        },
        customData: {
          currency: 'BDT',
          value: product.discountPrice,
          contentName: product.title,
          orderId: orderId,
        },
      }).catch((err) => console.error('Meta CAPI Purchase error:', err));
    } else {
      sendMetaCapiEvent({
        eventName: 'InitiateCheckout',
        eventSourceUrl: `${origin}/`,
        userData: {
          email,
          phone,
          firstName: name,
        },
        customData: {
          currency: 'BDT',
          value: product.discountPrice,
          contentName: product.title,
          orderId: orderId,
        },
      }).catch((err) => console.error('Meta CAPI trigger error:', err));
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: product.discountPrice,
      autoVerified: isAutoVerified,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: 'চেকআউট তৈরিতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
