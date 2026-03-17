import { fetchAllFlights } from '@/lib/fetchAllFlights'
import { FlightSchedulePage } from '@/components/FlightSchedulePage'

export const revalidate = 86400 // 1일

export default async function Home() {
  const { flights, fetchedAt } = await fetchAllFlights()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">한국 출발 국제선 스케줄</h1>
      <FlightSchedulePage flights={flights} fetchedAt={fetchedAt} />
    </main>
  )
}
