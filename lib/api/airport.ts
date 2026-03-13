import { FlightSchedule } from '../types'
import { parseOperatingDays, parseTime, parseDate } from '../normalize'

const BASE_URL = 'http://openapi.airport.co.kr/service/rest/FlightScheduleList/getIflightScheduleList'
const PAGE_SIZE = 1000

export async function fetchScheduleByAirport(
  airportCode: string,
  schDate: string // YYYYMMDD
): Promise<FlightSchedule[]> {
  const all: FlightSchedule[] = []
  let page = 1

  while (true) {
    const params = new URLSearchParams({
      ServiceKey: process.env.AIRPORT_API_KEY!,
      encoded: 'true',
      schDeptCityCode: airportCode,
      schDate,
      pageNo: String(page),
      numOfRows: String(PAGE_SIZE),
    })

    const res = await fetch(`${BASE_URL}?${params}`)
    if (!res.ok) throw new Error(`Airport API ${airportCode} error: ${res.status}`)

    const xml = await res.text()
    const items = parseXmlItems(xml)

    const outFlights = items
      .filter((item: any) => item.internationalIoType === 'OUT')
      .map((item: any): FlightSchedule => ({
        airline: item.internationalNum?.slice(0, 2) ?? '',
        flightNumber: item.internationalNum ?? '',
        departureAirport: item.airportCode ?? airportCode,
        arrivalAirport: item.cityCode ?? '',
        departureTime: parseTime(item.internationalTime ?? '0000'),
        operatingDays: parseOperatingDays(
          item.internationalMon, item.internationalTue, item.internationalWed,
          item.internationalThu, item.internationalFri, item.internationalSat, item.internationalSun
        ),
        periodStart: parseDate(item.internationalStdate ?? ''),
        periodEnd: parseDate(item.internationalEddate ?? ''),
      }))

    all.push(...outFlights)

    const totalCount = parseTotalCount(xml)
    if (page * PAGE_SIZE >= totalCount) break
    page++
  }

  return all
}

function parseXmlItems(xml: string): any[] {
  const matches = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []
  return matches.map(itemXml => {
    const obj: Record<string, string> = {}
    const fieldMatches = itemXml.matchAll(/<(\w+)>([^<]*)<\/\1>/g)
    for (const [, key, value] of fieldMatches) {
      obj[key] = value
    }
    return obj
  })
}

function parseTotalCount(xml: string): number {
  const match = xml.match(/<totalCount>(\d+)<\/totalCount>/)
  return match ? parseInt(match[1], 10) : 0
}
