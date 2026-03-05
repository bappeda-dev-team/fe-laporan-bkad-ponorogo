export function formatPercent(angka: number | undefined) {
  const hasil = (angka === undefined) ? 0 : angka
  const percent = hasil * 100
  return `${percent}%`;
}
