export const formatINR = (value: number | string) => {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if(isNaN(n)) return String(value)
  return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n)
}
export const cn = (...c: (string|false|undefined)[])=> c.filter(Boolean).join(' ')
