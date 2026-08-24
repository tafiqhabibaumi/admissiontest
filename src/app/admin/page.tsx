'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  RefreshCw,
  Download
} from 'lucide-react';
import { formatBDT, toBengaliNumber } from '@/lib/utils';
import { Order } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            এডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            মাস্টার সাজেশন সেলস অ্যানালিটিক্স ও রিয়েলটাইম অর্ডার
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">সর্বমোট বিক্রয়</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              {stats ? formatBDT(stats.totalRevenue) : '৳০'}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              ✓ সম্পন্ন অর্ডার থেকে
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">আজকের বিক্রয়</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              {stats ? formatBDT(stats.todayRevenue) : '৳০'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              আজকের অর্ডার: {stats ? toBengaliNumber(stats.todayOrdersCount) : '০'} টি
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/80 to-slate-900 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300">মোট অর্ডার</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              {stats ? toBengaliNumber(stats.totalOrders) : '০'}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              সফল: {stats ? toBengaliNumber(stats.completedOrdersCount) : '০'} টি
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">অপেক্ষমাণ পেমেন্ট</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              {stats ? toBengaliNumber(stats.pendingOrdersCount) : '০'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">পেমেন্ট অপেক্ষমাণ</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          <span>সাম্প্রতিক অর্ডারসমূহ</span>
        </h2>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">এখনো কোনো অর্ডার তৈরি হয়নি।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">অর্ডার আইডি</th>
                  <th className="pb-3 font-semibold">শিক্ষার্থীর নাম</th>
                  <th className="pb-3 font-semibold">মোবাইল</th>
                  <th className="pb-3 font-semibold">টার্গেট</th>
                  <th className="pb-3 font-semibold">মূল্য</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                  <th className="pb-3 font-semibold">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats?.recentOrders?.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-emerald-400 font-bold">{order.id}</td>
                    <td className="py-3 text-slate-200 font-bold">{order.customerName}</td>
                    <td className="py-3 text-slate-400">{order.customerPhone}</td>
                    <td className="py-3 text-slate-300">{order.targetUniversity}</td>
                    <td className="py-3 font-serif font-bold text-emerald-400">
                      {formatBDT(order.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.paymentStatus === 'completed' ? '✓ পেইড' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
