import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const config = getSiteConfig();
    
    const smtpHost = body.smtpHost || config.emailSettings.smtpHost || 'smtp.gmail.com';
    const smtpPort = body.smtpPort || config.emailSettings.smtpPort || 465;
    const smtpUser = body.smtpUser || config.emailSettings.smtpUser || 'kocchopgroup@gmail.com';
    const smtpPass = body.smtpPass || config.emailSettings.smtpPass || 'aysxdwcnsowhfljo';
    const senderName = body.senderName || config.emailSettings.senderName || 'Science Admission Mentorship';
    const senderEmail = body.senderEmail || config.emailSettings.senderEmail || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'অনুগ্রহ করে আগে SMTP Username ও App Password দিন।' },
        { status: 400 }
      );
    }

    let transporter: nodemailer.Transporter;
    let isConnected = false;
    let lastError: any = null;

    // Strategy 1: Try Port 465 (SSL Direct)
    try {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 465,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      await transporter.verify();
      isConnected = true;
    } catch (err: any) {
      lastError = err;
      // Strategy 2: Fallback to Port 587 (STARTTLS)
      try {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        });

        await transporter.verify();
        isConnected = true;
      } catch (err2: any) {
        lastError = err2;
      }
    }

    if (!isConnected || !transporter!) {
      throw new Error(lastError?.message || 'SMTP Connection failed. Check your App Password or server firewall.');
    }

    // Send a real test email to the sender's own email address
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: smtpUser,
      subject: '✅ টেস্ট ইমেইল - আপনার Gmail SMTP সফলভাবে কানেক্ট হয়েছে!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b101d; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #10b981;">
          <h2 style="color: #10b981; margin-top: 0;">🎉 অভিনন্দন! আপনার জিমেইল SMTP কানেকশন সফল হয়েছে!</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            আপনার ওয়েবসাইট থেকে এখন যেকোনো শিক্ষার্থী বিকাশ/নগদে পেমেন্ট সম্পন্ন করলেই তার কাছে স্বয়ংক্রিয়ভাবে সাজেশন PDF ডাউনলোড লিংক ও অর্ডার কপি চলে যাবে।
          </p>
          <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${senderEmail}</p>
            <p style="margin: 4px 0;"><strong>SMTP Host:</strong> ${smtpHost}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Connected & Verified ✅</p>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            BUET & University Science Admission System Automation
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `টেস্ট ইমেইল সফলভাবে ${smtpUser} ঠিকানায় পাঠানো হয়েছে! অনুগ্রহ করে আপনার ইনবক্স চেক করুন।`,
    });
  } catch (error: any) {
    console.error('SMTP verification error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Gmail SMTP কানেকশন ফেইল করেছে।',
      },
      { status: 500 }
    );
  }
}
