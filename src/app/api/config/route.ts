import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const config = getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = saveSiteConfig(body);
    if (success) {
      return NextResponse.json({ success: true, message: 'Configuration saved successfully', config: getSiteConfig() });
    }
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
