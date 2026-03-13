import { describe, it, expect } from 'vitest'
import { filterFlights, FilterState } from './filterFlights'
import { FlightSchedule } from './types'

const days = { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
const sample: FlightSchedule[] = [
  { airline: 'KE', flightNumber: 'KE123', departureAirport: 'ICN', arrivalAirport: 'NRT', departureTime: '09:00', operatingDays: days, periodStart: '2025.10.27', periodEnd: '2026.03.29' },
  { airline: 'OZ', flightNumber: 'OZ101', departureAirport: 'GMP', arrivalAirport: 'HND', departureTime: '07:45', operatingDays: days, periodStart: '2025.11.01', periodEnd: '2026.03.28' },
]

describe('filterFlights', () => {
  it('출발공항 필터', () => {
    const result = filterFlights(sample, { departureAirport: 'ICN', arrivalAirport: '', airline: '' })
    expect(result).toHaveLength(1)
    expect(result[0].airline).toBe('KE')
  })

  it('도착공항 검색 (대소문자 무관)', () => {
    const result = filterFlights(sample, { departureAirport: '', arrivalAirport: 'hnd', airline: '' })
    expect(result).toHaveLength(1)
    expect(result[0].airline).toBe('OZ')
  })

  it('항공사 검색', () => {
    const result = filterFlights(sample, { departureAirport: '', arrivalAirport: '', airline: 'KE' })
    expect(result).toHaveLength(1)
  })

  it('필터 없으면 전체 반환', () => {
    const result = filterFlights(sample, { departureAirport: '', arrivalAirport: '', airline: '' })
    expect(result).toHaveLength(2)
  })
})
