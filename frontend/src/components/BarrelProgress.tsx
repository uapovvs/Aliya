import { useTranslation } from 'react-i18next'
import type { RewardKey } from '@/types'

interface Props {
  totalBarrels: number
  reward: RewardKey
}

const MAX_BARRELS = 20
const THRESHOLDS = [
  { min: 16, label: 'JAPAN_TRIP',       color: 'bg-yellow-400' },
  { min: 12, label: 'LEADERSHIP_AWARD', color: 'bg-blue-400'   },
  { min: 8,  label: 'BRANDED_MERCH',    color: 'bg-green-400'  },
  { min: 0,  label: 'PROJECT_BADGE',    color: 'bg-gray-400'   },
] as const

export default function BarrelProgress({ totalBarrels, reward }: Props) {
  const { t } = useTranslation()
  const pct = Math.min((totalBarrels / MAX_BARRELS) * 100, 100)
  const threshold = THRESHOLDS.find((th) => totalBarrels >= th.min) ?? THRESHOLDS[3]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{t('barrel.total')}</span>
        <span className="text-2xl font-bold text-barrel">{totalBarrels} / {MAX_BARRELS}</span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${threshold.color}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-3 text-sm font-medium text-gray-700">
        🏆 {t(`barrel.reward.${reward}`)}
      </p>
    </div>
  )
}
