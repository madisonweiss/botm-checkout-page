// Great tool for easily formatting currency
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Helper used to convert pricing back from cents -> dollars
export const formatPrice = (cents: number) => currency.format(cents / 100)

// A date like "2026-09-29" (with no time or timezone) gets parsed by `new Date()` 
// as midnight UTC. In US time zones that's still the evening before locally, 
// so displaying it as is can show the wrong day. To mitigate this, we can build the 
// date from its year/month/day parts directly which uses local time. Full 
// timestamps (which already carry their own time/timezone) are parsed normally.
export function formatShipDate(value: string): string {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
