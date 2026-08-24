import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'ইউজারনেম ও পাসওয়ার্ড দিন' }, { status: 400 });
    }

    const isValid = verifyAdmin(username, password);

    if (isValid) {
      // In a production setup, generate a secure signed JWT or session cookie
      // For fast seamless admin experience, return an admin session token
      const sessionToken = Buffer.from(`${username}:${Date.now()}:buet_admin_secret`).toString('base64');
      
      const response = NextResponse.json({ success: true, token: sessionToken, username });
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'লগইনে সমস্যা হয়েছে' }, { status: 500 });
  }
}
