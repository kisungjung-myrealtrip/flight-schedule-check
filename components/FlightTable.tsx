'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FlightSchedule } from '@/lib/types'
import { OperatingDaysCell } from './OperatingDaysCell'

type Pos = { top: number; left: number }

function CoverageCell({ covered }: { covered?: boolean }) {
  if (covered === undefined) return <span className="text-gray-300 text-xs">-</span>
  return covered
    ? <span className="text-green-600 font-bold text-sm">✓</span>
    : <span className="text-red-500 font-bold text-sm">✗</span>
}

type SortState = { col: string; dir: 'asc' | 'desc' } | null
type FilterableCol = 'airline' | 'departureAirport' | 'arrivalAirport' | 'naver' | 'skyscanner'

function cellValue(f: FlightSchedule, col: FilterableCol): string {
  if (col === 'naver') return f.naver ? '✓' : '✗'
  if (col === 'skyscanner') return f.skyscanner ? '✓' : '✗'
  return f[col] as string
}

function sortValue(f: FlightSchedule, col: string): string {
  switch (col) {
    case 'airline': return f.airline
    case 'flightNumber': return f.flightNumber
    case 'departureAirport': return f.departureAirport
    case 'arrivalAirport': return f.arrivalAirport
    case 'departureTime': return f.departureTime
    case 'periodStart': return f.periodStart
    default: return ''
  }
}

interface FilterDropdownProps {
  col: FilterableCol
  flights: FlightSchedule[]
  excluded: Partial<Record<FilterableCol, Set<string>>>
  pos: Pos
  anchor: HTMLElement
  onClose: () => void
  onToggle: (col: FilterableCol, value: string) => void
  onToggleAll: (col: FilterableCol, allValues: string[]) => void
}

function FilterDropdown({ col, flights, excluded, pos, anchor, onClose, onToggle, onToggleAll }: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node) && !anchor.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [anchor, onClose])

  const allValues = [...new Set(flights.map(f => cellValue(f, col)))].sort()
  const excl = excluded[col] ?? new Set<string>()
  const allSelected = allValues.every(v => !excl.has(v))

  return createPortal(
    <div
      ref={ref}
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
      className="bg-white border rounded shadow-lg min-w-[160px] py-1"
    >
      <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-xs font-semibold border-b">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => onToggleAll(col, allValues)}
        />
        전체 선택
      </label>
      <div className="max-h-52 overflow-y-auto">
        {allValues.map(v => (
          <label key={v} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={!excl.has(v)}
              onChange={() => onToggle(col, v)}
            />
            {v}
          </label>
        ))}
      </div>
    </div>,
    document.body
  )
}

export function FlightTable({ flights }: { flights: FlightSchedule[] }) {
  const [sort, setSort] = useState<SortState>(null)
  const [excluded, setExcluded] = useState<Partial<Record<FilterableCol, Set<string>>>>({})
  const [openFilter, setOpenFilter] = useState<FilterableCol | null>(null)
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [filterPos, setFilterPos] = useState<Pos>({ top: 0, left: 0 })

  function handleSort(col: string) {
    setSort(prev =>
      prev?.col === col
        ? prev.dir === 'asc' ? { col, dir: 'desc' } : null
        : { col, dir: 'asc' }
    )
  }

  function toggleValue(col: FilterableCol, value: string) {
    setExcluded(prev => {
      const current = new Set(prev[col] ?? [])
      if (current.has(value)) current.delete(value)
      else current.add(value)
      return { ...prev, [col]: current }
    })
  }

  function toggleAll(col: FilterableCol, allValues: string[]) {
    setExcluded(prev => {
      const excl = prev[col] ?? new Set<string>()
      const allExcluded = allValues.every(v => excl.has(v))
      return { ...prev, [col]: allExcluded ? new Set() : new Set(allValues) }
    })
  }

  function openColFilter(e: React.MouseEvent, col: FilterableCol) {
    e.stopPropagation()
    if (openFilter === col) {
      setOpenFilter(null)
      setFilterAnchor(null)
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setFilterPos({ top: rect.bottom, left: rect.left })
      setOpenFilter(col)
      setFilterAnchor(e.currentTarget as HTMLElement)
    }
  }

  // Apply column filters
  let displayed = flights.filter(f => {
    for (const [col, excl] of Object.entries(excluded) as [FilterableCol, Set<string>][]) {
      if (!excl || excl.size === 0) continue
      if (excl.has(cellValue(f, col))) return false
    }
    return true
  })

  // Apply sort
  if (sort) {
    const dir = sort.dir === 'asc' ? 1 : -1
    displayed = [...displayed].sort((a, b) =>
      sortValue(a, sort.col).localeCompare(sortValue(b, sort.col)) * dir
    )
  }

  function SortIcon({ col }: { col: string }) {
    if (sort?.col !== col) return <span className="text-gray-300 ml-1 text-xs">↕</span>
    return <span className="text-blue-500 ml-1 text-xs">{sort.dir === 'asc' ? '↑' : '↓'}</span>
  }

  function FilterIcon({ col }: { col: FilterableCol }) {
    const hasFilter = (excluded[col]?.size ?? 0) > 0
    return (
      <button
        className={`ml-1 text-xs leading-none ${hasFilter ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-600`}
        onClick={e => openColFilter(e, col)}
        title="필터"
      >
        ▼
      </button>
    )
  }

  function SortableTh({ col, label, filterable, className }: {
    col: string; label: string; filterable?: FilterableCol; className?: string
  }) {
    return (
      <th
        className={`border px-3 py-2 cursor-pointer select-none whitespace-nowrap ${className ?? ''}`}
        onClick={() => handleSort(col)}
      >
        {label}
        <SortIcon col={col} />
        {filterable && <FilterIcon col={filterable} />}
      </th>
    )
  }

  if (flights.length === 0) {
    return <p className="text-center py-12 text-gray-400">조회된 항공편이 없습니다.</p>
  }

  return (
    <>
      {openFilter && filterAnchor && (
        <FilterDropdown
          col={openFilter}
          flights={flights}
          excluded={excluded}
          pos={filterPos}
          anchor={filterAnchor}
          onClose={() => { setOpenFilter(null); setFilterAnchor(null) }}
          onToggle={toggleValue}
          onToggleAll={toggleAll}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <SortableTh col="airline" label="항공사" filterable="airline" />
              <SortableTh col="flightNumber" label="편명" />
              <SortableTh col="departureAirport" label="출발" filterable="departureAirport" />
              <SortableTh col="arrivalAirport" label="도착" filterable="arrivalAirport" />
              <SortableTh col="departureTime" label="출발시간" />
              <th className="border px-3 py-2">운항요일</th>
              <SortableTh col="periodStart" label="운항기간" />
              <th className="border px-3 py-2 text-center whitespace-nowrap">
                네이버 <FilterIcon col="naver" />
              </th>
              <th className="border px-3 py-2 text-center whitespace-nowrap">
                스카이스캐너 <FilterIcon col="skyscanner" />
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((f, i) => (
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
        {displayed.length < flights.length && (
          <p className="text-xs text-gray-400 mt-1">
            컬럼 필터 적용 중 — {flights.length}편 중 {displayed.length}편 표시
          </p>
        )}
      </div>
    </>
  )
}
