import { describe, it, expect } from 'vitest'
import { parseOperatingDays, parseTime, parseDate, mergeAndSort } from './normalize'

describe('parseOperatingDays', () => {
  it('Y/N 필드를 OperatingDays 객체로 변환한다', () => {
    const result = parseOperatingDays('Y', 'N', 'Y', 'Y', 'Y', 'N', 'N')
    expect(result).toEqual({
      mon: true, tue: false, wed: true, thu: true, fri: true,
      sat: false, sun: false,
    })
  })
})

describe('parseTime', () => {
  it('"0740" → "07:40"', () => {
    expect(parseTime('0740')).toBe('07:40')
  })
  it('"1430" → "14:30"', () => {
    expect(parseTime('1430')).toBe('14:30')
  })
  it('이미 HH:MM 형식이면 그대로', () => {
    expect(parseTime('07:40')).toBe('07:40')
  })
})

describe('parseDate', () => {
  it('ISO 날짜문자열 → "YYYY.MM.DD"', () => {
    expect(parseDate('2025-10-27T00:00:00+09:00')).toBe('2025.10.27')
  })
})

describe('mergeAndSort', () => {
  it('두 배열을 합쳐 출발공항-출발시간 순으로 정렬한다', () => {
    const a = [{ departureAirport: 'ICN', departureTime: '10:00' }] as any
    const b = [{ departureAirport: 'GMP', departureTime: '08:00' }] as any
    const result = mergeAndSort(a, b)
    expect(result[0].departureAirport).toBe('GMP')
  })
})
