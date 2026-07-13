export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return false;

  return date.getTime() <= Date.now();
}
