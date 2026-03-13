import { describe, it, expect, vi } from 'vitest'
import { fetchAllFlights } from './fetchAllFlights'
import * as airport from './api/airport'

const mockFlight = (dep: string, time: string) => ({
  airline: 'KE', flightNumber: 'KE001', departureAirport: dep,
  arrivalAirport: 'NRT', departureTime: time,
  operatingDays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
  periodStart: '2025.10.27', periodEnd: '2026.03.29',
})

describe('fetchAllFlights', () => {
  it('모든 공항 데이터를 병합해 정렬된 결과를 반환한다', async () => {
    vi.spyOn(airport, 'fetchScheduleByAirport')
      .mockResolvedValueOnce([mockFlight('ICN', '10:00')])
      .mockResolvedValue([mockFlight('GMP', '08:00')])

    const result = await fetchAllFlights()
    expect(result.flights[0].departureAirport).toBe('GMP')
    expect(result.fetchedAt).toBeDefined()
  })
})
