import { NextResponse } from 'next/server';
import { getSiteConfig, saveOrder, findTransactionByTrxId, findTransactionByPhoneAndAmount, findCompletedOrderByPhoneOrEmail } from '@/lib/db';
import { Order } from '@/types';
import { generateOrderId, generateToken } from '@/lib/utils';
import { sendSuggestionEmail } from '@/lib/mailer';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, senderPhone, targetUniversity, hscBatch, paymentMethod, manualTrxId } = body;

    // Use sender phone if provided, otherwise customer phone
    const effectivePhone = (senderPhone || phone || '').trim();

    if (!name || !email || !effectivePhone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে আপনার নাম, ইমেইল ও মোবাইল নম্বর দিন' }, { status: 400 });
    }

    const config = getSiteConfig();
    const product = config.product;
    const amount = product.discountPrice || 499;

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // 0. LIFETIME ACCESS: Check if this phone number or email already paid in the past
    const existingCompletedOrder = findCompletedOrderByPhoneOrEmail(effectivePhone, email);
    if (existingCompletedOrder) {
      // Re-send fresh download email
      sendSuggestionEmail(existingCompletedOrder, origin).catch(() => {});

      return NextResponse.json({
        success: true,
        orderId: existingCompletedOrder.id,
        amount: existingCompletedOrder.amount,
        autoVerified: true,
        alreadyPaid: true,
        message: 'আপনার পূর্ববর্তী পেমেন্ট ভেরিফাইড পাওয়া গেছে! লাইফটাইম এক্সেস চালু রয়েছে।',
      });
    }

    const orderId = generateOrderId();
    const downloadToken = generateToken();

    // 1. Check if SMS already arrived matching phone & amount OR TrxID
    const cleanTrx = manualTrxId ? manualTrxId.trim().toUpperCase() : '';
    let cachedTrx = cleanTrx ? findTransactionByTrxId(cleanTrx) : null;

    if (!cachedTrx) {
      cachedTrx = findTransactionByPhoneAndAmount(effectivePhone, amount);
    }

    const isAutoVerified = !!cachedTrx;
    const finalTrxId = cachedTrx ? cachedTrx.trxId : cleanTrx;

    const order: Order = {
      id: orderId,
      customerName: name,
      customerEmail: email,
      customerPhone: effectivePhone,
      targetUniversity: targetUniversity || 'সকল বিশ্ববিদ্যালয় বিজ্ঞান ও ইঞ্জিনিয়ারিং',
      hscBatch: hscBatch || 'HSC 2024/2025',
      packageId: 'all-science-master-guide',
      packageTitle: product.title,
      amount: amount,
      currency: 'BDT',
      paymentMethod: paymentMethod || (cachedTrx ? `manual_${cachedTrx.provider}` : 'manual_bkash'),
      manualTrxId: finalTrxId || undefined,
      transactionId: isAutoVerified ? finalTrxId : undefined,
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
      }).catch((err) => console.error('Auto-email sending error:', err));

      sendMetaCapiEvent({
        eventName: 'Purchase',
        eventSourceUrl: `${origin}/order-status/${order.id}`,
        userData: {
          email,
          phone: effectivePhone,
          firstName: name,
        },
        customData: {
          currency: 'BDT',
          value: amount,
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
          phone: effectivePhone,
          firstName: name,
        },
        customData: {
          currency: 'BDT',
          value: amount,
          contentName: product.title,
          orderId: orderId,
        },
      }).catch((err) => console.error('Meta CAPI trigger error:', err));
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amount,
      autoVerified: isAutoVerified,
      trxId: finalTrxId,
      alreadyPaid: false,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: 'চেকআউট তৈরিতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
