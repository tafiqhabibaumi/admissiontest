import { NextResponse } from 'next/server';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventId, eventSourceUrl, userData, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Missing eventName' }, { status: 400 });
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('remote-addr') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    const success = await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || request.headers.get('referer') || '',
      testEventCode: body.testEventCode || undefined,
      userData: {
        ...userData,
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
      },
      customData,
    });

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Meta event API error:', error);
    return NextResponse.json({ error: 'Failed to record Meta event' }, { status: 500 });
  }
}
