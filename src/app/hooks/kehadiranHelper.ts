export const percentDisplay = (v: number) => (v / 100).toFixed(2)
export const percentPayload = (v: number) => Math.round(v * 100)
export const formatPercent = (value: string) => {
  const number = Number(value.replace(",", "."))
  if (isNaN(number)) return ""

  return number.toFixed(2)
}
