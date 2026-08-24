import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const packageId = formData.get('packageId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'কোনো ফাইল সিলেক্ট করা হয়নি' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = `${packageId || 'custom'}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeFileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName: safeFileName,
      url: `/uploads/${safeFileName}`,
      message: 'পিডিএফ ফাইল সফলভাবে আপলোড করা হয়েছে',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'ফাইল আপলোডে সমস্যা হয়েছে' }, { status: 500 });
  }
}
