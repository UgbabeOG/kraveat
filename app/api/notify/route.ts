import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { appendOrder } from '@/lib/orders-store';

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

    const summary = `New KraveEat order\nCustomer: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nItems: ${items.map((item: { name: string; quantity: number }) => `${item.name} x${item.quantity}`).join(', ')}\nTotal: ₦${Number(total).toLocaleString()}`;

    const whatsappUrl = `https://wa.me/2349030707047?text=${encodeURIComponent(summary)}`;

    return NextResponse.json({
      ok: true,
      orderId,
      whatsappUrl,
      summary,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to process order' }, { status: 500 });
  }
}
