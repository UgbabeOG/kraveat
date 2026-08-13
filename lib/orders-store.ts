import { promises as fs } from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

async function readOrders(): Promise<unknown[]> {
  try {
    await fs.access(ORDERS_FILE);
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders: unknown[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch {
    // ignore write errors
  }
}

export async function readAllOrders(): Promise<unknown[]> {
  return readOrders();
}

export async function appendOrder(order: unknown): Promise<void> {
  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const orders = await readOrders() as Array<{ id: string; [key: string]: unknown }>;
  const index = orders.findIndex((o) => o.id === orderId);
  if (index >= 0) {
    orders[index] = { ...orders[index], status };
    await writeOrders(orders);
  }
}
