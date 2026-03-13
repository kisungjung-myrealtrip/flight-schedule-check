import { OperatingDays } from '@/lib/types'

const DAYS: { key: keyof OperatingDays; label: string }[] = [
  { key: 'mon', label: '월' }, { key: 'tue', label: '화' },
  { key: 'wed', label: '수' }, { key: 'thu', label: '목' },
  { key: 'fri', label: '금' }, { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
]

export function OperatingDaysCell({ days }: { days: OperatingDays }) {
  return (
    <div className="flex gap-1">
      {DAYS.map(({ key, label }) => (
        <span
          key={key}
          className={`w-5 text-center text-xs ${days[key] ? 'text-blue-600 font-medium' : 'text-gray-300'}`}
          title={label}
        >
          {days[key] ? '✈' : '-'}
        </span>
      ))}
    </div>
  )
}
