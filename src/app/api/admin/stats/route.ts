import { NextResponse } from 'next/server';
import { getOrders, getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = getOrders();
    const config = getSiteConfig();

    const completedOrders = orders.filter((o) => o.paymentStatus === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = completedOrders.filter((o) => o.createdAt.startsWith(todayStr));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const productTitle = config.product?.title || 'All-University Science Admission Master Guide';

    return NextResponse.json({
      totalOrders: orders.length,
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount: orders.filter((o) => o.paymentStatus === 'pending').length,
      totalRevenue,
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      productTitle,
      recentOrders: orders.slice(0, 15),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
  }
}
