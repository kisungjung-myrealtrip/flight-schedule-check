import fs from 'fs'
import path from 'path'

const KOREAN_AIRPORTS = ['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ', 'KWJ']

// 도시코드 → 공항코드 매핑 (cityCode가 실제 IATA 공항코드와 다른 경우)
const CITY_TO_AIRPORTS: Record<string, string[]> = {
  TYO: ['NRT', 'HND'],
  OSA: ['KIX', 'ITM'],
  SPK: ['CTS'],
  SHA: ['PVG', 'SHA'],
  BJS: ['PEK', 'PKX'],
  SEL: ['ICN', 'GMP'],
  NYC: ['JFK', 'LGA', 'EWR'],
  PAR: ['CDG', 'ORY'],
  LON: ['LHR', 'LGW'],
  MIL: ['MXP', 'LIN'],
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(current); current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
}

function normalizeCode(code: string): string[] {
  const base = code.replace('@A', '').replace(/@\w*$/, '')
  if (base === 'KOR') return KOREAN_AIRPORTS
  return CITY_TO_AIRPORTS[base] ?? [base]
}

function buildRouteSet(csvPath: string): Set<string> {
  const set = new Set<string>()
  if (!fs.existsSync(csvPath)) return set

  const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').slice(1)
  for (const line of lines) {
    if (!line.trim()) continue
    const cols = parseCsvLine(line)
    const promoNm = cols[2]?.trim()
    if (!promoNm) continue

    const parts = promoNm.split('_')
    if (parts.length < 2) continue
    const airline = parts[0]
    const routePart = parts[1]
    const dashIdx = routePart.indexOf('-')
    if (dashIdx === -1) continue

    const deps = normalizeCode(routePart.slice(0, dashIdx))
    const arrs = normalizeCode(routePart.slice(dashIdx + 1))
    for (const dep of deps)
      for (const arr of arrs)
        set.add(`${airline}_${dep}_${arr}`)
  }
  return set
}

export function loadAutomationData() {
  const root = process.cwd()
  return {
    naver: buildRouteSet(path.join(root, 'int_automation - NVR.csv')),
    skyscanner: buildRouteSet(path.join(root, 'int_automation - SKY.csv')),
  }
}

export function checkCoverage(
  airline: string, dep: string, arr: string,
  data: ReturnType<typeof loadAutomationData>
) {
  const key = `${airline}_${dep}_${arr}`
  return { naver: data.naver.has(key), skyscanner: data.skyscanner.has(key) }
}
