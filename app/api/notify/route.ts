import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const summary = body.summary || 'New KraveEat order';

  const whatsappUrl = `https://wa.me/2349030707047?text=${encodeURIComponent(summary)}`;
  const adminEmail = 'admin@kraveat.com';

  return NextResponse.json({
    ok: true,
    whatsappUrl,
    adminEmail,
    summary
  });
}
