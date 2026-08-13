export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function validateNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+234|234|0)(70|71|80|81|90|91|60|61|62|63|64|65|66|67|68|69)\d{7}$/.test(cleaned);
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
