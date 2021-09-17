export function numberToString(value: number) {
  return value.toLocaleString().replace(/\.|,/g, '');
}
