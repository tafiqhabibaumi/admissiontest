import fs from 'fs';
import path from 'path';
import { SiteConfig, Order } from '@/types';
import { defaultSiteConfig } from '@/data/defaultData';
import { ParsedMfsSms, normalizePhoneNumber } from '@/lib/smsParser';

const DATA_DIR = path.join(process.cwd(), 'data_storage');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

// In-memory runtime cache for serverless environments (e.g. Vercel)
let memoryConfig: SiteConfig = { ...defaultSiteConfig };
let memoryOrders: Order[] = [];
let memoryTransactions: ParsedMfsSms[] = [];
let isConfigLoaded = false;
let isOrdersLoaded = false;
let isTransactionsLoaded = false;

function safeEnsureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Read-only filesystem (e.g. Vercel serverless runtime)
  }
}

// Get site config with robust fallback
export function getSiteConfig(): SiteConfig {
  if (isConfigLoaded) {
    return memoryConfig;
  }

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryConfig = { ...defaultSiteConfig, ...parsed };
      isConfigLoaded = true;
      return memoryConfig;
    }
  } catch (err) {
    // Silently fallback to defaultSiteConfig
  }

  isConfigLoaded = true;
  return memoryConfig;
}

// Save updated site config
export function saveSiteConfig(newConfig: SiteConfig): boolean {
  memoryConfig = { ...newConfig };
  isConfigLoaded = true;
  safeEnsureDataDir();
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // File writing failed in serverless, in-memory updated
    return true;
  }
}

// Get all orders
export function getOrders(): Order[] {
  if (isOrdersLoaded) {
    return memoryOrders;
  }

  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      memoryOrders = JSON.parse(raw) || [];
      isOrdersLoaded = true;
      return memoryOrders;
    }
  } catch (err) {
    // Fallback
  }

  isOrdersLoaded = true;
  return memoryOrders;
}

// Save order
export function saveOrder(order: Order): boolean {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  memoryOrders = orders;
  isOrdersLoaded = true;

  safeEnsureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return true;
  }
}

// Delete order
export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  memoryOrders = filtered;
  isOrdersLoaded = true;

  safeEnsureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return true;
  }
}

// Update order fields
export function updateOrder(id: string, fields: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const updated = {
    ...orders[index],
    ...fields,
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updated;
  memoryOrders = orders;
  isOrdersLoaded = true;

  safeEnsureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    // Ignore serverless write error
  }
  return updated;
}

// Find order by ID
export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

// Find order by download token
export function getOrderByToken(token: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.downloadToken === token) || null;
}

// Find order by TrxID (case-insensitive)
export function findOrderByTrxId(trxId: string): Order | null {
  if (!trxId) return null;
  const cleanTrx = trxId.trim().toUpperCase();
  const orders = getOrders();
  return orders.find(
    (o) =>
      (o.manualTrxId && o.manualTrxId.trim().toUpperCase() === cleanTrx) ||
      (o.transactionId && o.transactionId.trim().toUpperCase() === cleanTrx)
  ) || null;
}

// Find pending order matching sender phone and amount (for real-time auto-verification)
export function findPendingOrderByPhoneAndAmount(phone: string, amount: number): Order | null {
  if (!phone) return null;
  const cleanPhone = normalizePhoneNumber(phone);
  const orders = getOrders();

  return orders.find((o) => {
    if (o.paymentStatus !== 'pending') return false;
    const amountMatch = Math.abs(o.amount - amount) <= 1;
    if (!amountMatch) return false;

    const orderPhone = normalizePhoneNumber(o.customerPhone);
    return (
      orderPhone === cleanPhone ||
      orderPhone.slice(-10) === cleanPhone.slice(-10) ||
      cleanPhone.slice(-10) === orderPhone.slice(-10)
    );
  }) || null;
}

// Find existing completed/verified order by Phone or Email (Lifetime Access Guarantee)
export function findCompletedOrderByPhoneOrEmail(phone?: string, email?: string): Order | null {
  if (!phone && !email) return null;
  const cleanPhone = phone ? normalizePhoneNumber(phone) : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const orders = getOrders();

  return orders.find((o) => {
    if (o.paymentStatus !== 'completed') return false;

    if (cleanPhone) {
      const orderPhone = normalizePhoneNumber(o.customerPhone);
      if (
        orderPhone === cleanPhone ||
        (cleanPhone.length >= 10 && orderPhone.slice(-10) === cleanPhone.slice(-10)) ||
        (orderPhone.length >= 10 && cleanPhone.slice(-10) === orderPhone.slice(-10))
      ) {
        return true;
      }
    }

    if (cleanEmail && o.customerEmail && o.customerEmail.trim().toLowerCase() === cleanEmail) {
      return true;
    }

    return false;
  }) || null;
}

// --- SMS Transaction Cache & Webhook Log ---
export function getTransactions(): ParsedMfsSms[] {
  if (isTransactionsLoaded) {
    return memoryTransactions;
  }

  try {
    if (fs.existsSync(TRANSACTIONS_FILE)) {
      const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
      memoryTransactions = JSON.parse(raw) || [];
      isTransactionsLoaded = true;
      return memoryTransactions;
    }
  } catch (err) {
    // Fallback
  }

  isTransactionsLoaded = true;
  return memoryTransactions;
}

export function saveTransaction(trx: ParsedMfsSms): boolean {
  const list = getTransactions();
  const cleanTrx = trx.trxId.trim().toUpperCase();
  const exists = list.find((t) => t.trxId.trim().toUpperCase() === cleanTrx);
  if (!exists) {
    list.unshift(trx);
    if (list.length > 300) list.pop();
  }
  memoryTransactions = list;
  isTransactionsLoaded = true;

  safeEnsureDataDir();
  try {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return true;
  }
}

export function findTransactionByTrxId(trxId: string): ParsedMfsSms | null {
  if (!trxId) return null;
  const cleanTrx = trxId.trim().toUpperCase();
  const list = getTransactions();
  return list.find((t) => t.trxId.trim().toUpperCase() === cleanTrx) || null;
}

// Find transaction by sender phone & amount (instant match without TrxID)
export function findTransactionByPhoneAndAmount(
  phone: string,
  amount: number,
  provider?: string
): ParsedMfsSms | null {
  if (!phone || !amount) return null;
  const cleanPhone = normalizePhoneNumber(phone);
  const list = getTransactions();

  return list.find((t) => {
    // 1. Amount match check (within ±1 Tk margin)
    const amountMatch = Math.abs(t.amount - amount) <= 1;
    if (!amountMatch) return false;

    // 2. Sender phone match check
    if (t.senderPhone) {
      const cleanSender = normalizePhoneNumber(t.senderPhone);
      if (
        cleanSender === cleanPhone ||
        cleanSender.slice(-10) === cleanPhone.slice(-10) ||
        cleanPhone.slice(-10) === cleanSender.slice(-10)
      ) {
        return true;
      }
    }

    // 3. Raw SMS text fallback match
    const rawDigits = t.rawSms.replace(/[^0-9]/g, '');
    const phoneDigits = cleanPhone.slice(-10);
    if (rawDigits.includes(phoneDigits)) {
      return true;
    }

    return false;
  }) || null;
}

// Verify Admin credentials
export function verifyAdmin(user: string, pass: string): boolean {
  const defaultAdmin = { username: 'admin', password: 'Aumi51260' };
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
      const admin = JSON.parse(raw);
      const validUser = user.toLowerCase() === admin.username.toLowerCase() || user.toLowerCase() === 'admin' || user.toLowerCase() === 'aumi';
      return validUser && pass === admin.password;
    }
  } catch (err) {
    // Fallback
  }
  return (user.toLowerCase() === 'admin' || user.toLowerCase() === 'aumi') && pass === defaultAdmin.password;
}

// Change Admin credentials
export function updateAdminCredentials(user: string, pass: string): boolean {
  safeEnsureDataDir();
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify({ username: user, password: pass }, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}
