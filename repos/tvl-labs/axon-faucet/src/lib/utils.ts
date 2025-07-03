export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());


export function getAbbreviation(address: string, begin: number, end: number) {
  return `${address.substring(0, begin)}...${address.substring(address.length - end, address.length)}`;
}

export function formatValue(value: number, digits = 2, decimal = 18) {
  const left = `${Math.floor(value / 10 ** decimal)}`;

  if (digits > 0) {
    const right = `${Math.floor(
      (value % 10 ** digits) / 10 ** (decimal - digits),
    )}`.padStart(digits, '0');
    return `${left}.${right}`;
  }

  return left;
}
