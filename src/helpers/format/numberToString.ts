export function numberToString(value: number | string) {
  return value.toLocaleString().replace(/\.|,/g, '');
}
