import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getSiteConfig();
    const publicConfig = {
      hero: config.hero,
      product: config.product,
      contact: config.contact,
      metaTracking: {
        pixelId: config.metaTracking.pixelId,
        enabled: config.metaTracking.enabled,
      },
      paymentSettings: {
        bkashMerchantNumber: config.paymentSettings.bkashMerchantNumber,
        nagadMerchantNumber: config.paymentSettings.nagadMerchantNumber,
        rocketMerchantNumber: config.paymentSettings.rocketMerchantNumber,
      },
      chapters: config.chapters,
      testimonials: config.testimonials,
      faqs: config.faqs,
    };
    return NextResponse.json(publicConfig);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = saveSiteConfig(body);
    if (success) {
      return NextResponse.json({ success: true, message: 'Configuration saved successfully' });
    }
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
