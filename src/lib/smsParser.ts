export interface ParsedMfsSms {
  provider: 'bkash' | 'nagad' | 'rocket' | 'unknown';
  trxId: string;
  amount: number;
  senderPhone?: string;
  rawSms: string;
  parsedAt: string;
}

/**
 * Intelligent RegEx Parser for bKash, Nagad, and Rocket incoming SMS messages
 */
export function parseMfsSms(smsText: string): ParsedMfsSms | null {
  if (!smsText || typeof smsText !== 'string') return null;

  const text = smsText.trim();
  const lowerText = text.toLowerCase();

  let provider: 'bkash' | 'nagad' | 'rocket' | 'unknown' = 'unknown';
  if (lowerText.includes('bkash') || lowerText.includes('বিকাশ') || lowerText.includes('fee tk 0.00')) {
    provider = 'bkash';
  } else if (lowerText.includes('nagad') || lowerText.includes('নগদ') || lowerText.includes('txnid:')) {
    provider = 'nagad';
  } else if (lowerText.includes('rocket') || lowerText.includes('রকেট') || lowerText.includes('dbbl') || lowerText.includes('16216')) {
    provider = 'rocket';
  }

  // 1. Extract TrxID / TxnID
  // Matches: TrxID 9J7X8KL9, TxnID: 71G78KL9, Trx ID: ABC123XYZ, etc.
  const trxMatch = text.match(/(?:TrxID|TxnID|Trx Id|Txn Id|Trx|Txn|Transaction ID|ট্রানজেকশন আইডি)[\s:.-]*([A-Za-z0-9]{6,16})/i);
  const trxId = trxMatch ? trxMatch[1].trim().toUpperCase() : '';

  // 2. Extract Amount
  // Matches: Tk 499.00, Tk. 499, Tk499, BDT 499, Amount: Tk 499, টাকা 499
  const amountMatch = text.match(/(?:Tk|TK|Tk\.|BDT|Amount:\s*Tk|টাকা)[\s]*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  let amount = 0;
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 3. Extract Sender Phone Number (Optional)
  // Matches: from 017XXXXXXXX, Sender: 018XXXXXXXX, A/C: 019XXXXXXXX
  const senderMatch = text.match(/(?:from|sender|a\/c|হতে|প্রেরক)[\s:]*(\+?8801[3-9]\d{8}|01[3-9]\d{8})/i);
  const senderPhone = senderMatch ? senderMatch[1].trim() : undefined;

  // Validate that at least TrxID was captured
  if (!trxId) {
    return null;
  }

  // If provider was unknown, infer from TrxID structure
  if (provider === 'unknown') {
    if (trxId.length >= 8) {
      provider = 'bkash';
    }
  }

  return {
    provider,
    trxId,
    amount,
    senderPhone,
    rawSms: text,
    parsedAt: new Date().toISOString(),
  };
}
