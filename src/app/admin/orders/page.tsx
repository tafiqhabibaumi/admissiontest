'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  RefreshCw,
  Download,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Send,
  Loader2,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  DollarSign,
  User,
  CreditCard,
  Building,
  Filter
} from 'lucide-react';
import { Order } from '@/types';
import { formatBDT, toBengaliNumber } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Modals state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // New Order Form state
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    targetUniversity: 'BUET',
    packageTitle: 'অল-ভার্সিটি সায়েন্স মাস্টার সাজেশন ২০২৬-২৭',
    amount: 299,
    paymentMethod: 'bkash',
    transactionId: '',
    paymentStatus: 'completed' as const,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Quick Resend Email
  const handleResendEmail = async (orderId: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend_email', orderId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ সাজেশন পিডিএফ ও এক্সেস লিংক ইমেইলে সফলভাবে পাঠানো হয়েছে!');
        fetchOrders();
      } else {
        alert(data.error || 'ইমেইল পাঠাতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('ইমেইল পাঠানো যায়নি');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick Status Change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', orderId, newStatus }),
      });
      showToast('✓ পেমেন্ট স্ট্যাটাস আপডেট করা হয়েছে');
      fetchOrders();
    } catch (e) {
      alert('স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে');
    }
  };

  // Save Edited Order
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_order',
          orderId: editingOrder.id,
          orderData: editingOrder,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ অর্ডারের সকল তথ্য সফলভাবে আপডেট হয়েছে!');
        setEditingOrder(null);
        fetchOrders();
      } else {
        alert(data.error || 'আপডেট করা যায়নি');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setSaveLoading(false);
    }
  };

  // Confirm Delete Order
  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_order',
          orderId: deletingOrder.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ অর্ডারটি স্থায়ীভাবে ডিলিট করা হয়েছে');
        setDeletingOrder(null);
        fetchOrders();
      } else {
        alert(data.error || 'ডিলিট করা যায়নি');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setSaveLoading(false);
    }
  };

  // Create Manual Order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          orderData: newOrderForm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ নতুন অর্ডার সফলভাবে তালিকায় যুক্ত হয়েছে!');
        setIsCreateOpen(false);
        setNewOrderForm({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          targetUniversity: 'BUET',
          packageTitle: 'অল-ভার্সিটি সায়েন্স মাস্টার সাজেশন ২০২৬-২৭',
          amount: 299,
          paymentMethod: 'bkash',
          transactionId: '',
          paymentStatus: 'completed',
        });
        fetchOrders();
      } else {
        alert(data.error || 'অর্ডার তৈরি করা যায়নি');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setSaveLoading(false);
    }
  };

  // Metrics Calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'completed')
    .reduce((acc, o) => acc + (o.amount || 0), 0);

  const completedCount = orders.filter((o) => o.paymentStatus === 'completed').length;
  const pendingCount = orders.filter((o) => o.paymentStatus === 'pending').length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === 'all' || o.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            অর্ডার ও ডেলিভারি তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            অর্ডার পর্যবেক্ষণ, তথ্য সম্পাদনা, ম্যানুয়াল এন্ট্রি ও ডেলিভারি নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অর্ডার যুক্ত করুন</span>
          </button>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Real-Time Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs font-medium text-slate-400 block">মোট অর্ডার</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">
            {toBengaliNumber(orders.length)} টি
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 shadow">
          <span className="text-xs font-medium text-emerald-400 block">মোট সংগৃহীত আয়</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {formatBDT(totalRevenue)}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs font-medium text-slate-400 block">সফল ডেলিভারি (Paid)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">
            {toBengaliNumber(completedCount)} টি
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 shadow">
          <span className="text-xs font-medium text-amber-400 block">পেন্ডিং / রিভিউ</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1 block">
            {toBengaliNumber(pendingCount)} টি
          </span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="নাম, ফোন নম্বর, ইমেইল, TrxID বা অর্ডার আইডি দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">সকল স্ট্যাটাস ({toBengaliNumber(orders.length)})</option>
            <option value="completed">✓ পেইড ({toBengaliNumber(completedCount)})</option>
            <option value="pending">⏳ পেন্ডিং ({toBengaliNumber(pendingCount)})</option>
            <option value="failed">✕ ফেইলড</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">সকল পেমেন্ট মেথড</option>
            <option value="supportkori">SupportKori গেটওয়ে</option>
            <option value="bkash">বিকাশ (bKash)</option>
            <option value="nagad">নগদ (Nagad)</option>
            <option value="rocket">রকেট (Rocket)</option>
            <option value="manual">ম্যানুয়াল এন্ট্রি</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-4 sm:p-6 shadow-xl">
        {filteredOrders.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">অর্ডার আইডি ও তারিখ</th>
                  <th className="pb-3 font-semibold">শিক্ষার্থীর তথ্য</th>
                  <th className="pb-3 font-semibold">টার্গেট ও মেথড</th>
                  <th className="pb-3 font-semibold">মূল্য</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                  <th className="pb-3 font-semibold">ডেলিভারি ট্র্যাকিং</th>
                  <th className="pb-3 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredOrders.map((order) => {
                  const isSuccess = order.paymentStatus === 'completed';

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 font-mono text-indigo-300 font-bold">
                        <a
                          href={`/order-status/${order.id}`}
                          target="_blank"
                          className="hover:underline inline-flex items-center gap-1"
                          title="ইনভয়েস ভিউ করুন"
                        >
                          <span>{order.id}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleString('bn-BD', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 text-slate-200">
                        <p className="font-bold text-white text-sm">{order.customerName}</p>
                        <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{order.customerPhone}</span>
                        </p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{order.customerEmail}</span>
                        </p>
                      </td>

                      {/* Target, Method & TrxID */}
                      <td className="py-4">
                        <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 mb-1">
                          {order.targetUniversity}
                        </span>
                        <div className="text-[11px] text-slate-300 flex items-center gap-1">
                          <span className="capitalize font-semibold text-slate-200">{order.paymentMethod}</span>
                          {order.transactionId && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1 rounded border border-slate-800">
                              {order.transactionId}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 font-bold text-emerald-400 text-sm font-mono">
                        {formatBDT(order.amount)}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            isSuccess
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : order.paymentStatus === 'pending'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <option value="completed">✓ পেইড (Completed)</option>
                          <option value="pending">⏳ পেন্ডিং (Pending)</option>
                          <option value="failed">✕ ফেইলড (Failed)</option>
                        </select>
                      </td>

                      {/* Download token / count */}
                      <td className="py-4 text-[11px] text-slate-400">
                        <p className="text-slate-300">
                          ডাউনলোড: <strong className="text-white font-mono">{toBengaliNumber(order.downloadCount || 0)}</strong> বার
                        </p>
                        <span className={`text-[10px] font-medium ${order.emailSent ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {order.emailSent ? '✓ ইমেইল প্রেরিত' : 'ইমেইল বাকি'}
                        </span>
                      </td>

                      {/* Actions: Edit, Email, Delete */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Details */}
                          <button
                            onClick={() => setEditingOrder({ ...order })}
                            title="অর্ডার তথ্য এডিট করুন"
                            className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Resend Email */}
                          <button
                            onClick={() => handleResendEmail(order.id)}
                            disabled={actionLoadingId === order.id}
                            title="পিডিএফ ইমেইল পাঠান"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            {actionLoadingId === order.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            ) : (
                              <Send className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>

                          {/* Delete Order */}
                          <button
                            onClick={() => setDeletingOrder(order)}
                            title="অর্ডার ডিলিট করুন"
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= EDIT ORDER MODAL ================= */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-indigo-400" />
                  <span>অর্ডার তথ্য সম্পাদনা</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {editingOrder.id}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">শিক্ষার্থীর নাম</label>
                <input
                  type="text"
                  required
                  value={editingOrder.customerName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customerPhone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    required
                    value={editingOrder.customerEmail}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">টার্গেট বিশ্ববিদ্যালয়</label>
                  <input
                    type="text"
                    value={editingOrder.targetUniversity}
                    onChange={(e) => setEditingOrder({ ...editingOrder, targetUniversity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">পরিশোধিত মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingOrder.amount}
                    onChange={(e) => setEditingOrder({ ...editingOrder, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={editingOrder.paymentMethod}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="supportkori">SupportKori</option>
                    <option value="bkash">bKash (বিকাশ)</option>
                    <option value="nagad">Nagad (নগদ)</option>
                    <option value="rocket">Rocket (রকেট)</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                  <input
                    type="text"
                    value={editingOrder.transactionId || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, transactionId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">পেমেন্ট স্ট্যাটাস</label>
                  <select
                    value={editingOrder.paymentStatus}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="completed">✓ পেইড (Completed)</option>
                    <option value="pending">⏳ পেন্ডিং (Pending)</option>
                    <option value="failed">✕ ফেইলড (Failed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ডাউনলোড কাউন্ট</label>
                  <input
                    type="number"
                    value={editingOrder.downloadCount || 0}
                    onChange={(e) => setEditingOrder({ ...editingOrder, downloadCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold inline-flex items-center gap-1.5 shadow transition-all"
                >
                  {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>আপডেট সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">অর্ডারটি ডিলিট করতে চান?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                অর্ডার আইডি: <strong className="text-white font-mono">{deletingOrder.id}</strong> ({deletingOrder.customerName})<br />
                ডিলিট করলে এই অর্ডারের রেকর্ড স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={saveLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all inline-flex items-center gap-1.5"
              >
                {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE MANUAL ORDER MODAL ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>নতুন ম্যানুয়াল অর্ডার এন্ট্রি</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সাকিব হাসান"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ইমেইল ঠিকানা *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">টার্গেট বিশ্ববিদ্যালয়</label>
                  <input
                    type="text"
                    value={newOrderForm.targetUniversity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, targetUniversity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">পরিশোধিত মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newOrderForm.amount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={newOrderForm.paymentMethod}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="bkash">bKash (বিকাশ)</option>
                    <option value="nagad">Nagad (নগদ)</option>
                    <option value="rocket">Rocket (রকেট)</option>
                    <option value="supportkori">SupportKori</option>
                    <option value="manual">Manual / Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">TrxID / নোট</label>
                  <input
                    type="text"
                    placeholder="Bkash TrxID"
                    value={newOrderForm.transactionId}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, transactionId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow transition-all"
                >
                  {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>অর্ডার তৈরি করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
