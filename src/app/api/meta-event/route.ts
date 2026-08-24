import { NextResponse } from 'next/server';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventSourceUrl, userData, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Missing eventName' }, { status: 400 });
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('remote-addr') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const success = await sendMetaCapiEvent({
      eventName,
      eventSourceUrl: eventSourceUrl || request.headers.get('referer') || '',
      userData: {
        ...userData,
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
      },
      customData,
    });

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Meta event error:', error);
    return NextResponse.json({ error: 'Failed to record Meta event' }, { status: 500 });
  }
}
