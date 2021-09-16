export function currencyToBlockchain(value: number, decimalPlaces: number) {
  return value * Math.pow(10, decimalPlaces);
}
