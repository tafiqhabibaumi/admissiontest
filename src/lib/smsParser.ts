export interface ParsedMfsSms {
  provider: 'bkash' | 'nagad' | 'rocket' | 'unknown';
  trxId: string;
  amount: number;
  senderPhone?: string;
  rawSms: string;
  parsedAt: string;
}

/**
 * Clean phone numbers to standard 11-digit or 10-digit format for matching
 */
export function normalizePhoneNumber(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  // If starts with 880, strip 88 to get 01XXXXXXXXX (11 digits)
  if (digits.startsWith('880') && digits.length >= 13) {
    return digits.slice(2, 13);
  }
  // Return last 11 digits or whatever is available (min 10)
  return digits.slice(-11);
}

/**
 * Intelligent RegEx Parser for bKash, Nagad, and Rocket incoming SMS messages
 */
export function parseMfsSms(smsText: string): ParsedMfsSms | null {
  if (!smsText || typeof smsText !== 'string') return null;

  const text = smsText.trim();
  const lowerText = text.toLowerCase();

  let provider: 'bkash' | 'nagad' | 'rocket' | 'unknown' = 'unknown';
  if (lowerText.includes('bkash') || lowerText.includes('বিকাশ') || lowerText.includes('fee tk 0.00') || lowerText.includes('you have received tk')) {
    provider = 'bkash';
  } else if (lowerText.includes('nagad') || lowerText.includes('নগদ') || lowerText.includes('txnid:') || lowerText.includes('টাকা প্রাপ্তি')) {
    provider = 'nagad';
  } else if (lowerText.includes('rocket') || lowerText.includes('রকেট') || lowerText.includes('dbbl') || lowerText.includes('16216')) {
    provider = 'rocket';
  }

  // 1. Extract TrxID / TxnID
  const trxMatch = text.match(/(?:TrxID|TxnID|Trx Id|Txn Id|Trx|Txn|Transaction ID|ট্রানজেকশন আইডি)[\s:.-]*([A-Za-z0-9]{6,16})/i);
  const trxId = trxMatch ? trxMatch[1].trim().toUpperCase() : '';

  // 2. Extract Amount
  // Matches: Tk 499.00, Tk. 499, Tk499, BDT 499, Amount: Tk 499, টাকা 499
  const amountMatch = text.match(/(?:Tk|TK|Tk\.|BDT|Amount:\s*Tk|টাকা|পরিমাণ)[\s:]*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  let amount = 0;
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 3. Extract Sender Phone Number
  // Matches:
  // "from 017XXXXXXXX"
  // "from +88017XXXXXXXX"
  // "From: 018XXXXXXXX"
  // "হতে 017XXXXXXXX"
  // "থেকে 017XXXXXXXX"
  // "প্রেরক: 018XXXXXXXX"
  // "A/C: 019XXXXXXXX"
  let senderPhone: string | undefined = undefined;

  const senderPatterns = [
    /(?:from|sender|a\/c|হতে|থেকে|প্রেরক)[\s:.-]*(\+?8801[3-9]\d{8}|01[3-9]\d{8})/i,
    /(\+?8801[3-9]\d{8}|01[3-9]\d{8})[\s]*(?:হতে|থেকে|from)/i,
    /\b(01[3-9]\d{8})\b/i, // General 11-digit Bangladeshi mobile number
  ];

  for (const pattern of senderPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      senderPhone = normalizePhoneNumber(match[1]);
      break;
    }
  }

  // Validate that at least TrxID or Amount was captured
  if (!trxId && amount <= 0) {
    return null;
  }

  // Fallback synthetic TrxID if SMS had amount and sender but no explicit TrxID
  const finalTrxId = trxId || `SMS-${Date.now().toString(36).toUpperCase()}`;

  if (provider === 'unknown') {
    provider = 'bkash';
  }

  return {
    provider,
    trxId: finalTrxId,
    amount,
    senderPhone,
    rawSms: text,
    parsedAt: new Date().toISOString(),
  };
}
