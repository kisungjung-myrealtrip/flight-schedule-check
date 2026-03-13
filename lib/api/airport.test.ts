import { describe, it, expect, vi } from 'vitest'
import { fetchScheduleByAirport } from './airport'

describe('fetchScheduleByAirport', () => {
  it('OUT 타입만 파싱해서 FlightSchedule 배열로 반환한다', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => `<?xml version="1.0"?>
        <response><header><resultCode>00</resultCode></header>
        <body><items>
          <item>
            <airlineEnglish>ALL NIPPON AIRWAYS (NH)</airlineEnglish>
            <airportCode>GMP</airportCode><cityCode>HND</cityCode>
            <internationalNum>NH862</internationalNum>
            <internationalTime>0740</internationalTime>
            <internationalIoType>OUT</internationalIoType>
            <internationalMon>Y</internationalMon><internationalTue>Y</internationalTue>
            <internationalWed>Y</internationalWed><internationalThu>Y</internationalThu>
            <internationalFri>Y</internationalFri><internationalSat>Y</internationalSat>
            <internationalSun>Y</internationalSun>
            <internationalStdate>2025-10-27T00:00:00+09:00</internationalStdate>
            <internationalEddate>2026-03-29T00:00:00+09:00</internationalEddate>
          </item>
          <item>
            <internationalIoType>IN</internationalIoType>
            <internationalNum>NH861</internationalNum>
            <airportCode>HND</airportCode><cityCode>GMP</cityCode>
            <internationalTime>0600</internationalTime>
            <internationalMon>Y</internationalMon><internationalTue>Y</internationalTue>
            <internationalWed>Y</internationalWed><internationalThu>Y</internationalThu>
            <internationalFri>Y</internationalFri><internationalSat>Y</internationalSat>
            <internationalSun>Y</internationalSun>
            <internationalStdate>2025-10-27T00:00:00+09:00</internationalStdate>
            <internationalEddate>2026-03-29T00:00:00+09:00</internationalEddate>
          </item>
        </items><numOfRows>2</numOfRows><pageNo>1</pageNo><totalCount>2</totalCount></body></response>`,
    } as any)

    const result = await fetchScheduleByAirport('GMP', '20260313')
    // IN 타입은 제외, OUT만 반환
    expect(result).toHaveLength(1)
    expect(result[0].airline).toBe('NH')
    expect(result[0].flightNumber).toBe('NH862')
    expect(result[0].departureAirport).toBe('GMP')
    expect(result[0].arrivalAirport).toBe('HND')
    expect(result[0].departureTime).toBe('07:40')
    expect(result[0].operatingDays.mon).toBe(true)
    expect(result[0].periodStart).toBe('2025.10.27')
    expect(result[0].periodEnd).toBe('2026.03.29')
  })
})
