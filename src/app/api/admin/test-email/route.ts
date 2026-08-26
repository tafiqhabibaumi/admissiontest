import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const config = getSiteConfig();
    const { smtpHost, smtpPort, smtpUser, smtpPass, senderName, senderEmail } = config.emailSettings;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'অনুগ্রহ করে আগে SMTP Username ও App Password সেভ করুন।' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || 465,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send a real test email to the sender's own email address
    await transporter.sendMail({
      from: `"${senderName || 'Admission Mentorship'}" <${senderEmail || smtpUser}>`,
      to: smtpUser,
      subject: '✅ টেস্ট ইমেইল - আপনার Gmail SMTP সফলভাবে কানেক্ট হয়েছে!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b101d; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #10b981;">
          <h2 style="color: #10b981; margin-top: 0;">🎉 অভিনন্দন! আপনার জিমেইল SMTP কানেকশন সফল হয়েছে!</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            আপনার ওয়েবসাইট থেকে এখন যেকোনো শিক্ষার্থী বিকাশ/নগদে পেমেন্ট সম্পন্ন করলেই তার কাছে স্বয়ংক্রিয়ভাবে সাজেশন PDF ডাউনলোড লিংক ও অর্ডার কপি চলে যাবে।
          </p>
          <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${senderEmail || smtpUser}</p>
            <p style="margin: 4px 0;"><strong>SMTP Host:</strong> ${smtpHost}:${smtpPort}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Connected & Verified</p>
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
        error: error.message || 'Gmail SMTP কানেকশন ফেইল করেছে। অনুগ্রহ করে নিশ্চিত করুন আপনি সঠিক 16-অক্ষরের App Password দিয়েছেন।',
      },
      { status: 500 }
    );
  }
}
