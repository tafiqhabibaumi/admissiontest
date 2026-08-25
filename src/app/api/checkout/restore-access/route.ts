import { NextResponse } from 'next/server';
import { findCompletedOrderByPhoneOrEmail } from '@/lib/db';
import { sendSuggestionEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body; // Can be phone or email

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'আপনার মোবাইল নম্বর অথবা ইমেইল লিখুন' }, { status: 400 });
    }

    const clean = query.trim();
    const isEmail = clean.includes('@');
    const order = isEmail
      ? findCompletedOrderByPhoneOrEmail(undefined, clean)
      : findCompletedOrderByPhoneOrEmail(clean, undefined);

    if (!order) {
      return NextResponse.json({
        found: false,
        error: 'এই নম্বর বা ইমেইলে কোনো ভেরিফাইড অর্ডার পাওয়া যায়নি। অনুগ্রহ করে নতুন করে অর্ডার করুন।',
      }, { status: 404 });
    }

    // Re-send fresh download email
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    sendSuggestionEmail(order, origin).catch(() => {});

    return NextResponse.json({
      found: true,
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      downloadToken: order.downloadToken,
      message: 'আপনার লাইফটাইম এক্সেস ভেরিফাইড! সরাসরি ডাউনলোড পেজে নিয়ে যাওয়া হচ্ছে...',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'রিকভারিতে ত্রুটি হয়েছে।' }, { status: 500 });
  }
}
