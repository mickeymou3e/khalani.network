export function formatAddress(address: string, start = 6, end = 4): string {
  const prefix = address.slice(0, start);
  const suffix = address.slice(-end);
  return `${prefix}...${suffix}`;
}
