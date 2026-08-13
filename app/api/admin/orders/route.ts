import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readAllOrders, updateOrderStatus, appendOrder } from '@/lib/orders-store';

type OrderRow = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: string;
  total: number;
  status: string;
};

function mapOrder(row: Record<string, unknown>): OrderRow {
  return {
    id: String(row.id),
    customerName: String(row.customer_name || row.customerName || ''),
    customerPhone: String(row.customer_phone || row.customerPhone || ''),
    customerAddress: String(row.customer_address || row.customerAddress || ''),
    items: String(row.items || ''),
    total: Number(row.total || 0),
    status: String(row.status || 'NEW'),
  };
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get('kraveat-admin-session')?.value;
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        orders: (data as Record<string, unknown>[]).map(mapOrder),
      });
    }

    const orders = await readAllOrders();
    return NextResponse.json({
      orders: (orders as Record<string, unknown>[]).map(mapOrder),
    });
  } catch {
    const orders = await readAllOrders();
    return NextResponse.json({
      orders: (orders as Record<string, unknown>[]).map(mapOrder),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, items, total } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const order = {
      id: orderId,
      customerName: String(customerName),
      customerPhone: String(customerPhone),
      customerAddress: String(customerAddress),
      items: JSON.stringify(items),
      total: Number(total),
      status: 'NEW',
    };

    if (supabase) {
      const { error } = await supabase.from('orders').insert({
        id: orderId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        items,
        total,
        status: 'NEW',
      });

      if (error) throw error;
    }

    await appendOrder(order);

    return NextResponse.json({ ok: true, orderId });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    }

    await updateOrderStatus(orderId, status);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to update order' }, { status: 500 });
  }
}
