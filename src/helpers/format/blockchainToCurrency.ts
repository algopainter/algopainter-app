export function blockchainToCurrency(value: number, decimalPlaces: number) {
  return value / Math.pow(10, decimalPlaces);
}
