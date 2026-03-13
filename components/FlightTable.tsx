import { FlightSchedule } from '@/lib/types'
import { OperatingDaysCell } from './OperatingDaysCell'

function CoverageCell({ covered }: { covered?: boolean }) {
  if (covered === undefined) return <span className="text-gray-300 text-xs">-</span>
  return covered
    ? <span className="text-green-600 font-bold text-sm">✓</span>
    : <span className="text-red-500 font-bold text-sm">✗</span>
}

export function FlightTable({ flights }: { flights: FlightSchedule[] }) {
  if (flights.length === 0) {
    return <p className="text-center py-12 text-gray-400">조회된 항공편이 없습니다.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-left">
            <th className="border px-3 py-2">항공사</th>
            <th className="border px-3 py-2">편명</th>
            <th className="border px-3 py-2">출발</th>
            <th className="border px-3 py-2">도착</th>
            <th className="border px-3 py-2">출발시간</th>
            <th className="border px-3 py-2">운항요일</th>
            <th className="border px-3 py-2">운항기간</th>
            <th className="border px-3 py-2 text-center">네이버</th>
            <th className="border px-3 py-2 text-center">스카이스캐너</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b">
              <td className="border px-3 py-2 font-mono font-bold">{f.airline}</td>
              <td className="border px-3 py-2 font-mono">{f.flightNumber}</td>
              <td className="border px-3 py-2">{f.departureAirport}</td>
              <td className="border px-3 py-2">{f.arrivalAirport}</td>
              <td className="border px-3 py-2">{f.departureTime}</td>
              <td className="border px-3 py-2">
                <OperatingDaysCell days={f.operatingDays} />
              </td>
              <td className="border px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                {f.periodStart} ~ {f.periodEnd}
              </td>
              <td className="border px-3 py-2 text-center">
                <CoverageCell covered={f.naver} />
              </td>
              <td className="border px-3 py-2 text-center">
                <CoverageCell covered={f.skyscanner} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
