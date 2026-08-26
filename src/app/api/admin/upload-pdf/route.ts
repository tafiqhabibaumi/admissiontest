import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getSiteConfig, saveSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'কোনো ফাইল সিলেক্ট করা হয়নি' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Keep the exact original file name that the user uploaded
    const exactFileName = file.name;
    const filePath = path.join(uploadsDir, exactFileName);

    fs.writeFileSync(filePath, buffer);

    // Automatically update site config with the exact uploaded PDF file name
    const config = getSiteConfig();
    config.product = {
      ...config.product,
      pdfFileName: exactFileName,
    };
    saveSiteConfig(config);

    return NextResponse.json({
      success: true,
      fileName: exactFileName,
      url: `/uploads/${exactFileName}`,
      message: `পিডিএফ ফাইল "${exactFileName}" সফলভাবে আপলোড ও সেভ করা হয়েছে`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'ফাইল আপলোডে সমস্যা হয়েছে' }, { status: 500 });
  }
}
