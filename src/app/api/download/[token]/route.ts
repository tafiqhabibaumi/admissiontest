import { NextResponse } from 'next/server';
import { getOrderByToken, saveOrder, getSiteConfig } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  if (!token) {
    return new NextResponse('Invalid token', { status: 400 });
  }

  const order = getOrderByToken(token);
  if (!order || order.paymentStatus !== 'completed') {
    return new NextResponse('Unauthorized: Order not found or payment pending.', { status: 403 });
  }

  // Increment download counter
  order.downloadCount += 1;
  order.updatedAt = new Date().toISOString();
  saveOrder(order);

  const config = getSiteConfig();
  const pdfFilename = config.product?.pdfFileName || 'all_science_admission_master_guide_2025.pdf';
  const uploadFilePath = path.join(process.cwd(), 'public', 'uploads', pdfFilename);

  // If a physical PDF was uploaded to public/uploads, serve it
  if (fs.existsSync(uploadFilePath)) {
    const fileBuffer = fs.readFileSync(uploadFilePath);
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(pdfFilename)}"`,
      },
    });
  }

  // Dynamically generate the formatted PDF guide
  const samplePdfContent = generateFullMasterPdf(order, config);
  
  return new NextResponse(new Uint8Array(samplePdfContent), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(pdfFilename)}"`,
    },
  });
}

function generateFullMasterPdf(order: any, config: any): Buffer {
  const buyer = order.customerName || 'Student';
  const phone = order.customerPhone || '';
  const orderId = order.id || '';
  const date = new Date().toLocaleDateString('en-GB');

  const pdfString = `%PDF-1.4
1 0 obj
<<
/Title (All Science University Admission Master Guide 2025)
/Author (Science Admission Mentorship)
/Creator (${buyer} - ${orderId})
/Producer (Admission Strategy Engine)
/CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)})
>>
endobj
2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj
3 0 obj
<<
/Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj
4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 595.28 841.89]
/Contents 5 0 R
/Resources <<
  /Font <<
    /F1 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica-Bold
    >>
    /F2 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica
    >>
  >>
>>
>>
endobj
5 0 obj
<<
/Length 1200
>>
stream
BT
/F1 18 Tf
40 800 Td
(ALL-UNIVERSITY SCIENCE ADMISSION MASTER SUGGESTION & STRATEGY) Tj
/F1 12 Tf
0 -25 Td
(BUET | CUET-RUET-KUET | IUT | DU A-UNIT | BUTEX | GST SCIENCE) Tj
/F2 9 Tf
0 -18 Td
(Authorized License: ${buyer} | Mobile: ${phone} | Order ID: ${orderId} | Date: ${date}) Tj
0 -20 Td
(==================================================================================================) Tj
0 -20 Td
/F1 11 Tf
(SECTION 1: 50-CHAPTER PRIORITY MATRIX & SKIP LIST SUMMARY) Tj
/F2 9 Tf
0 -15 Td
([5-STAR MUST-STUDY PHYSICS 1ST]: Vectors, Newtonian Mechanics, Work Power Energy, Gravitation, Periodic Motion, Waves) Tj
0 -13 Td
([5-STAR MUST-STUDY PHYSICS 2ND]: Current Electricity, Electrostatics, Semiconductors & Electronics, Modern Physics, Nuclear Physics) Tj
0 -13 Td
([5-STAR MUST-STUDY CHEM 1ST]: Qualitative Chem, Periodic Properties & Bonding, Chemical Changes) Tj
0 -13 Td
([5-STAR MUST-STUDY CHEM 2ND]: Organic Chemistry, Quantitative Chemistry, Electrochemistry) Tj
0 -13 Td
([5-STAR MUST-STUDY MATH 1ST]: Vectors, Function & Limits, Differentiation, Integration, Straight Line, Trig Ratios (Ch.7)) Tj
0 -13 Td
([5-STAR MUST-STUDY MATH 2ND]: Complex Numbers, Polynomials, Real Numbers & Inequalities, Conics, Dynamics (Motion of Particles)) Tj
0 -18 Td
/F1 11 Tf
(SECTION 2: WHAT CAN BE SKIPPED (CRITICAL TIME-SAVING STRATEGY)) Tj
/F2 9 Tf
0 -14 Td
(- Physics: Skip general-relativity extensions, obscure elastic-constants, advanced radiation derivations, 3-phase AC theory.) Tj
0 -14 Td
(- Chemistry: Skip rare bonding exceptions, detailed plant flow diagrams / manufacturing engineering, safe lab history.) Tj
0 -14 Td
(- Math: Skip epsilon-delta formal proofs, radical axis edge-cases, 4x4+ determinants, advanced axiomatic real number proofs.) Tj
0 -18 Td
/F1 11 Tf
(SECTION 3: 3-MONTH DAY-BY-DAY SCHEDULE & DAILY ROUTINE HIGHLIGHTS) Tj
/F2 9 Tf
0 -14 Td
(- Weeks 1-4: Concept Building (3-3.5 hrs focused subject blocks + 10-15 textbook MCQs)) Tj
0 -14 Td
(- Weeks 5-8: Topic Practice + Question Bank Drilling (20-25 admission MCQs/CQs per chapter)) Tj
0 -14 Td
(- Weeks 9-10: University PYQ Analysis (BUET, CKRUET, KUET, IUT targeted problem solving)) Tj
0 -14 Td
(- Weeks 11-12: Full Mock Tests & Mistake-Notebook Review (BUET Written 3hr & CKRUET MCQ Simulations)) Tj
0 -14 Td
(- Friday Protocol: Weekly Mixed Revision + Mistake-Notebook Logging (Spaced-Revision: +7d, +21d)) Tj
0 -25 Td
(==================================================================================================) Tj
0 -15 Td
(24/7 Helpline & Student WhatsApp Support: +8801700000000 | Best wishes for your admission journey!) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000224 00000 n 
0000000274 00000 n 
0000000332 00000 n 
0000000562 00000 n 
trailer
<<
/Size 6
/Root 2 0 R
/Info 1 0 R
>>
startxref
1850
%%EOF`;

  return Buffer.from(pdfString);
}
