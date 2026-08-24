import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { getSiteConfig } from './db';
import { Order } from '@/types';
import { formatBDT } from './utils';

export async function sendSuggestionEmail(order: Order, baseUrl: string): Promise<boolean> {
  const config = getSiteConfig();
  const { smtpHost, smtpPort, smtpUser, smtpPass, senderName, senderEmail } = config.emailSettings;

  const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}`;
  const orderPageUrl = `${baseUrl}/order-status/${order.id}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="bn">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>আপনার ইঞ্জিনিয়ারিং ভর্তি পরীক্ষার সাজেশন ও গাইডলাইন</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1117; color: #e6edf3; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #161b22; border-radius: 12px; border: 1px solid #30363d; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">অভিনন্দন, ${order.customerName}! 🎓</h1>
        <p style="color: #e0e7ff; margin: 8px 0 0; font-size: 15px;">আপনার বুয়েট ও ইঞ্জিনিয়ারিং ভর্তি প্রস্তুতি শুরু হোক সেরা স্ট্র্যাটেজিতে</p>
      </div>

      <!-- Content -->
      <div style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6; color: #c9d1d9;">
          প্রিয় শিক্ষার্থী, আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। আপনার নির্বাচিত <strong>${order.packageTitle}</strong> সাজেশন পিডিএফ ফাইলটি এখন ডাউনলোডের জন্য প্রস্তুত।
        </p>

        <!-- Order Summary Box -->
        <div style="background: #21262d; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #10b981;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #8b949e;">অর্ডার নম্বর:</td>
              <td style="padding: 6px 0; color: #58a6ff; font-weight: bold; text-align: right;">${order.id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8b949e;">প্যাকেজ:</td>
              <td style="padding: 6px 0; color: #f0f6fc; text-align: right;">${order.packageTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8b949e;">পরিশোধিত মূল্য:</td>
              <td style="padding: 6px 0; color: #3fb950; font-weight: bold; text-align: right;">${formatBDT(order.amount)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8b949e;">টার্গেট ইউনিভার্সিটি:</td>
              <td style="padding: 6px 0; color: #f0f6fc; text-align: right;">${order.targetUniversity || 'ইঞ্জিনিয়ারিং ও এ-ইউনিট'}</td>
            </tr>
          </table>
        </div>

        <!-- Download Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
            📥 এখনই সাজেশন PDF ডাউনলোড করুন
          </a>
        </div>

        <!-- Instructions -->
        <div style="background: #1c2128; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; color: #8b949e; line-height: 1.6;">
          <strong style="color: #f0883e;">💡 বিশেষ পড়ার পরামর্শ:</strong>
          <ul style="margin: 8px 0 0; padding-left: 20px;">
            <li>প্রথমে অধ্যায়ভিত্তিক পড়ার সময়সীমা টেবিলটি দেখে আপনার ডেইলি রুটিন সাজিয়ে নিন।</li>
            <li>৫-স্টার ও ৩-স্টার চিহ্নিত প্রায়োরিটি টপিকগুলো সবার আগে রিভিশন করুন।</li>
            <li>'কী কী বাদ দিতে হবে' (Skip Topics) অংশটি খেয়াল করে অপ্রয়োজনীয় চাপ এড়িয়ে চলুন।</li>
          </ul>
        </div>

        <p style="font-size: 13px; color: #8b949e; text-align: center; margin-top: 25px;">
          কোনো সমস্যা বা সহায়তার জন্য আমাদের WhatsApp করুন: 
          <a href="https://wa.me/${config.contact.whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #58a6ff; text-decoration: none;">${config.contact.whatsappNumber}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #0d1117; padding: 15px; text-align: center; border-top: 1px solid #30363d; font-size: 12px; color: #8b949e;">
        © ${new Date().getFullYear()} BUET Admission Mentorship & Suggestion. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  // If SMTP is not configured, simulate success in logs
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(`[Email Simulation] Sent suggestion email to ${order.customerEmail} for order ${order.id}. Download link: ${downloadUrl}`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail || smtpUser}>`,
      to: order.customerEmail,
      subject: `🎓 আপনার সাজেশন ডাউনলোড লিঙ্ক - ${order.packageTitle} (অর্ডার #${order.id})`,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    return false;
  }
}
