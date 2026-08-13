import { KRAVEAT_WHATSAPP_NUMBER } from './products';
import { CartItem } from './cart';
import { formatNaira } from './utils';

export function generateWhatsAppOrderMessage(params: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
}): string {
  const { customerName, customerPhone, customerAddress, items } = params;

  const lines = [
    'Hello KraveEat 👋',
    '',
    "I'd like to place an order.",
    '',
    `Customer: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Delivery address: ${customerAddress}`,
    '',
    'Order:',
  ];

  for (const item of items) {
    const lineTotal = item.product.price * item.quantity;
    lines.push(
      `• ${item.product.name} x${item.quantity} — ${formatNaira(lineTotal)}`,
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  lines.push('');
  lines.push(`Total: ${formatNaira(total)}`);
  lines.push('');
  lines.push('Please confirm my order.');

  return lines.join('\n');
}

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${KRAVEAT_WHATSAPP_NUMBER}?text=${encoded}`;
}
