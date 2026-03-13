'use client'
import { useState, useMemo } from 'react'
import { FlightSchedule } from '@/lib/types'
import { FilterState, filterFlights } from '@/lib/filterFlights'
import { FlightTable } from './FlightTable'
import { FlightFilters } from './FlightFilters'

interface Props {
  flights: FlightSchedule[];
  fetchedAt: string;
}

export function FlightSchedulePage({ flights, fetchedAt }: Props) {
  const [filters, setFilters] = useState<FilterState>({ departureAirport: '', arrivalAirport: '', airline: '' })
  const airports = useMemo(() => [...new Set(flights.map(f => f.departureAirport))].sort(), [flights])
  const filtered = useMemo(() => filterFlights(flights, filters), [flights, filters])

  return (
    <div>
      <FlightFilters airports={airports} filters={filters} onChange={setFilters} />
      <p className="text-sm text-gray-500 mb-2">{filtered.length}편 표시 중</p>
      <FlightTable flights={filtered} />
      <p className="text-xs text-gray-400 mt-4">
        마지막 업데이트: {new Date(fetchedAt).toLocaleString('ko-KR')}
      </p>
    </div>
  )
}
