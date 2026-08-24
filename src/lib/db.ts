import fs from 'fs';
import path from 'path';
import { SiteConfig, Order } from '@/types';
import { defaultSiteConfig } from '@/data/defaultData';
import { ParsedMfsSms } from '@/lib/smsParser';

const DATA_DIR = path.join(process.cwd(), 'data_storage');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get or initialize site config
export function getSiteConfig(): SiteConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultSiteConfig, null, 2), 'utf-8');
    return defaultSiteConfig;
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...defaultSiteConfig, ...parsed };
  } catch (err) {
    console.error('Error reading config file:', err);
    return defaultSiteConfig;
  }
}

// Save updated site config
export function saveSiteConfig(newConfig: SiteConfig): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving config file:', err);
    return false;
  }
}

// Get all orders
export function getOrders(): Order[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

// Save order
export function saveOrder(order: Order): boolean {
  ensureDataDir();
  try {
    const orders = getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving order:', err);
    return false;
  }
}

// Delete order
export function deleteOrder(id: string): boolean {
  ensureDataDir();
  try {
    const orders = getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length === orders.length) return false;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting order:', err);
    return false;
  }
}

// Update order fields
export function updateOrder(id: string, fields: Partial<Order>): Order | null {
  ensureDataDir();
  try {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const updated = {
      ...orders[index],
      ...fields,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error updating order:', err);
    return null;
  }
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

// --- SMS Transaction Cache & Webhook Log ---
export function getTransactions(): ParsedMfsSms[] {
  ensureDataDir();
  if (!fs.existsSync(TRANSACTIONS_FILE)) {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveTransaction(trx: ParsedMfsSms): boolean {
  ensureDataDir();
  try {
    const list = getTransactions();
    const cleanTrx = trx.trxId.trim().toUpperCase();
    const exists = list.find((t) => t.trxId.trim().toUpperCase() === cleanTrx);
    if (!exists) {
      list.unshift(trx);
      // Keep up to 200 recent incoming SMS logs
      if (list.length > 200) list.pop();
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    }
    return true;
  } catch (err) {
    console.error('Error saving transaction log:', err);
    return false;
  }
}

export function findTransactionByTrxId(trxId: string): ParsedMfsSms | null {
  if (!trxId) return null;
  const cleanTrx = trxId.trim().toUpperCase();
  const list = getTransactions();
  return list.find((t) => t.trxId.trim().toUpperCase() === cleanTrx) || null;
}

// Verify Admin credentials
export function verifyAdmin(user: string, pass: string): boolean {
  ensureDataDir();
  if (!fs.existsSync(ADMIN_FILE)) {
    const defaultAdmin = { username: 'admin', password: 'Aumi51260' };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2), 'utf-8');
    return (user.toLowerCase() === 'admin' || user.toLowerCase() === 'aumi') && pass === defaultAdmin.password;
  }
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
    const admin = JSON.parse(raw);
    const validUser = user.toLowerCase() === admin.username.toLowerCase() || user.toLowerCase() === 'admin' || user.toLowerCase() === 'aumi';
    return validUser && pass === admin.password;
  } catch (err) {
    return (user.toLowerCase() === 'admin' || user.toLowerCase() === 'aumi') && pass === 'Aumi51260';
  }
}

// Change Admin credentials
export function updateAdminCredentials(user: string, pass: string): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify({ username: user, password: pass }, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}
