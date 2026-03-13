import { describe, it, expect, vi } from 'vitest'
import { fetchScheduleByAirport } from './airport'

describe('fetchScheduleByAirport', () => {
  it('IN/OUT 타입 모두 파싱해서 FlightSchedule 배열로 반환한다', async () => {
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
    // IN/OUT 둘 다 반환
    expect(result).toHaveLength(2)
    const outFlight = result.find(f => f.flightNumber === 'NH862')!
    expect(outFlight.airline).toBe('NH')
    expect(outFlight.departureAirport).toBe('GMP')
    expect(outFlight.arrivalAirport).toBe('HND')
    const inFlight = result.find(f => f.flightNumber === 'NH861')!
    expect(inFlight.departureAirport).toBe('HND')
    expect(inFlight.arrivalAirport).toBe('GMP')
    expect(outFlight.departureTime).toBe('07:40')
    expect(outFlight.operatingDays.mon).toBe(true)
    expect(outFlight.periodStart).toBe('2025.10.27')
    expect(outFlight.periodEnd).toBe('2026.03.29')
  })
})
