'use client'
import { FilterState } from '@/lib/filterFlights'

interface Props {
  airports: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FlightFilters({ airports, filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        className="border rounded px-3 py-1.5 text-sm bg-white"
        value={filters.departureAirport}
        onChange={e => onChange({ ...filters, departureAirport: e.target.value })}
      >
        <option value="">출발공항 전체</option>
        {airports.map(ap => <option key={ap} value={ap}>{ap}</option>)}
      </select>
      <input
        className="border rounded px-3 py-1.5 text-sm"
        placeholder="도착공항 검색..."
        value={filters.arrivalAirport}
        onChange={e => onChange({ ...filters, arrivalAirport: e.target.value })}
      />
      <input
        className="border rounded px-3 py-1.5 text-sm"
        placeholder="항공사 검색 (KE, OZ ...)"
        value={filters.airline}
        onChange={e => onChange({ ...filters, airline: e.target.value })}
      />
    </div>
  )
}
