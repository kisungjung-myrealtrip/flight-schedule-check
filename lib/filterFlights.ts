import { FlightSchedule } from './types'

export interface FilterState {
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  coverage: '' | 'naver_missing' | 'sky_missing' | 'both_missing';
}

export function filterFlights(flights: FlightSchedule[], filters: FilterState): FlightSchedule[] {
  return flights.filter(f => {
    if (filters.departureAirport && f.departureAirport !== filters.departureAirport) return false
    if (filters.arrivalAirport && !f.arrivalAirport.toLowerCase().includes(filters.arrivalAirport.toLowerCase())) return false
    if (filters.airline && !f.airline.toLowerCase().includes(filters.airline.toLowerCase()) && !f.flightNumber.toLowerCase().includes(filters.airline.toLowerCase())) return false
    if (filters.coverage === 'naver_missing' && f.naver) return false
    if (filters.coverage === 'sky_missing' && f.skyscanner) return false
    if (filters.coverage === 'both_missing' && (f.naver || f.skyscanner)) return false
    return true
  })
}
