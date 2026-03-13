import { ApiResponse, FlightSchedule } from './types'
import { fetchScheduleByAirport } from './api/airport'
import { mergeAndSort } from './normalize'

const AIRPORTS = ['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ']

const KOREAN_AIRPORTS = new Set(['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ', 'KWJ', 'RSU', 'KUV', 'WJU', 'YNY', 'USN', 'HIN', 'POH'])

function queryDates(): string[] {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return [0, 3, 6, 9, 12].map(months => {
    const d = new Date(kst)
    d.setMonth(d.getMonth() + months)
    return d.toISOString().slice(0, 10).replace(/-/g, '')
  })
}

export async function fetchAllFlights(): Promise<ApiResponse> {
  const dates = queryDates()
  const results = await Promise.all(
    dates.flatMap(schDate => AIRPORTS.map(code => fetchScheduleByAirport(code, schDate)))
  )
  const seen = new Map<string, FlightSchedule>()
  for (const flight of results.flat()) {
    if (KOREAN_AIRPORTS.has(flight.departureAirport) && KOREAN_AIRPORTS.has(flight.arrivalAirport)) continue
    const key = `${flight.flightNumber}_${flight.departureAirport}`
    if (!seen.has(key)) seen.set(key, flight)
  }
  const flights = mergeAndSort([], [...seen.values()])
  return { flights, fetchedAt: new Date().toISOString() }
}
