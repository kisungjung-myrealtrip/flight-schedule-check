import { ApiResponse } from './types'
import { fetchScheduleByAirport } from './api/airport'
import { mergeAndSort } from './normalize'

const AIRPORTS = ['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ']

const KOREAN_AIRPORTS = new Set(['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ', 'KWJ', 'RSU', 'KUV', 'WJU', 'YNY', 'USN', 'HIN', 'POH'])

function todayKST(): string {
  // YYYYMMDD 형식, 한국 시간 기준
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10).replace(/-/g, '')
}

export async function fetchAllFlights(): Promise<ApiResponse> {
  const schDate = todayKST()
  const results = await Promise.all(
    AIRPORTS.map(code => fetchScheduleByAirport(code, schDate))
  )
  const all = results.flat().filter(
    f => !(KOREAN_AIRPORTS.has(f.departureAirport) && KOREAN_AIRPORTS.has(f.arrivalAirport))
  )
  const flights = mergeAndSort([], all)
  return { flights, fetchedAt: new Date().toISOString() }
}
