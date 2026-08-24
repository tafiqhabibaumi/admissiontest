import { NextResponse } from 'next/server';
import { getOrders, saveOrder, getOrderById, deleteOrder, updateOrder } from '@/lib/db';
import { sendSuggestionEmail } from '@/lib/mailer';
import { generateDownloadToken, generateOrderId } from '@/lib/utils';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, newStatus, orderData } = body;

    // 1. Create New Order Manually
    if (action === 'create_order') {
      if (!orderData || !orderData.customerName || !orderData.customerPhone || !orderData.customerEmail) {
        return NextResponse.json({ error: 'নাম, ফোন ও ইমেইল অবশ্যই পূরণ করতে হবে' }, { status: 400 });
      }

      const newOrder: Order = {
        id: generateOrderId(),
        customerName: orderData.customerName.trim(),
        customerPhone: orderData.customerPhone.trim(),
        customerEmail: orderData.customerEmail.trim().toLowerCase(),
        targetUniversity: orderData.targetUniversity || 'All Engineering',
        hscBatch: orderData.hscBatch || 'HSC 25/26',
        packageId: orderData.packageId || 'all-in-one-master-guide',
        packageTitle: orderData.packageTitle || 'অল-ভার্সিটি সায়েন্স মাস্টার সাজেশন ২০২৫',
        amount: Number(orderData.amount) || 499,
        currency: 'BDT',
        paymentMethod: orderData.paymentMethod || 'manual',
        transactionId: orderData.transactionId || `MANUAL-${Date.now().toString().slice(-6)}`,
        paymentStatus: orderData.paymentStatus || 'completed',
        downloadToken: generateDownloadToken(),
        downloadCount: 0,
        emailSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveOrder(newOrder);
      return NextResponse.json({ success: true, order: newOrder, message: 'নতুন অর্ডার তৈরি হয়েছে' });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // 2. Delete Order
    if (action === 'delete_order') {
      const deleted = deleteOrder(orderId);
      if (deleted) {
        return NextResponse.json({ success: true, message: 'অর্ডারটি সফলভাবে ডিলিট করা হয়েছে' });
      }
      return NextResponse.json({ error: 'অর্ডার ডিলিট করা যায়নি' }, { status: 404 });
    }

    // 3. Update Order Details (Edit Name, Phone, Email, Amount, TrxID, Target, Status, etc.)
    if (action === 'update_order') {
      if (!orderData) {
        return NextResponse.json({ error: 'Missing orderData' }, { status: 400 });
      }

      const updated = updateOrder(orderId, {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        targetUniversity: orderData.targetUniversity,
        hscBatch: orderData.hscBatch,
        packageTitle: orderData.packageTitle,
        amount: Number(orderData.amount),
        paymentMethod: orderData.paymentMethod,
        transactionId: orderData.transactionId,
        paymentStatus: orderData.paymentStatus,
        downloadCount: Number(orderData.downloadCount) || 0,
        emailSent: Boolean(orderData.emailSent),
      });

      if (updated) {
        return NextResponse.json({ success: true, order: updated, message: 'অর্ডার তথ্য আপডেট হয়েছে' });
      }
      return NextResponse.json({ error: 'অর্ডার পাওয়া যায়নি' }, { status: 404 });
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 4. Resend Email
    if (action === 'resend_email') {
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const sent = await sendSuggestionEmail(order, origin);
      if (sent) {
        order.emailSent = true;
        order.updatedAt = new Date().toISOString();
        saveOrder(order);
        return NextResponse.json({ success: true, message: 'ইমেইল সফলভাবে পাঠানো হয়েছে' });
      }
      return NextResponse.json({ error: 'ইমেইল পাঠাতে সমস্যা হয়েছে' }, { status: 500 });
    }

    // 5. Update Quick Status
    if (action === 'update_status' && newStatus) {
      order.paymentStatus = newStatus;
      order.updatedAt = new Date().toISOString();
      saveOrder(order);
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error processing order' }, { status: 500 });
  }
}
