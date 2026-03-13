import { FlightSchedule, OperatingDays } from './types'

export function parseOperatingDays(
  mon: string, tue: string, wed: string,
  thu: string, fri: string, sat: string, sun: string
): OperatingDays {
  const y = (v: string) => v === 'Y'
  return { mon: y(mon), tue: y(tue), wed: y(wed), thu: y(thu), fri: y(fri), sat: y(sat), sun: y(sun) }
}

export function parseTime(raw: string): string {
  if (raw.includes(':')) return raw
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`
}

export function parseDate(iso: string): string {
  // "2025-10-27T00:00:00+09:00" → "2025.10.27"
  return iso.slice(0, 10).replace(/-/g, '.')
}

export function mergeAndSort(a: FlightSchedule[], b: FlightSchedule[]): FlightSchedule[] {
  return [...a, ...b].sort((x, y) => {
    if (x.departureAirport < y.departureAirport) return -1
    if (x.departureAirport > y.departureAirport) return 1
    return x.departureTime.localeCompare(y.departureTime)
  })
}
