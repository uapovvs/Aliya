import { useTranslation } from 'react-i18next'
import type { RewardKey } from '@/types'

interface Props {
  totalBarrels: number
  reward: RewardKey
}

const MAX = 20
const TIERS = [
  { min: 16, label: 'JAPAN_TRIP' as RewardKey,       pct: 80 },
  { min: 12, label: 'LEADERSHIP_AWARD' as RewardKey, pct: 60 },
  { min: 8,  label: 'BRANDED_MERCH' as RewardKey,    pct: 40 },
  { min: 0,  label: 'PROJECT_BADGE' as RewardKey,    pct: 0  },
] as const

export default function BarrelProgress({ totalBarrels, reward }: Props) {
  const { t } = useTranslation()
  const pct = Math.min((totalBarrels / MAX) * 100, 100)

  return (
    <div className="card space-y-5 animate-in">
      <div>
        <p className="eyebrow mb-3">{t('barrel.total')}</p>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-semibold text-barrel" style={{ letterSpacing: '-0.03em' }}>
            {totalBarrels}
          </span>
          <span className="text-ink-tertiary text-caption">/ {MAX}</span>
        </div>

        {/* Track */}
        <div className="h-1.5 bg-s3 rounded-pill overflow-hidden">
          <div
            className="h-full bg-barrel rounded-pill transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Tier markers */}
        <div className="relative mt-1 h-3">
          {TIERS.slice(0, 3).map((tier) => (
            <div
              key={tier.min}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${tier.pct}%` }}
            >
              <div className="w-px h-1.5 bg-hl-strong" />
            </div>
          ))}
        </div>
      </div>

      {/* Current reward */}
      <div className="pt-4 border-t border-hl">
        <p className="eyebrow mb-1.5">Текущая награда</p>
        <p className="text-body-lg font-medium text-ink">{t(`barrel.reward.${reward}`)}</p>
      </div>

      {/* All tiers */}
      <div className="space-y-2">
        {TIERS.map((tier) => {
          const active = reward === tier.label
          return (
            <div
              key={tier.label}
              className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                active ? 'bg-barrel/10 border border-barrel/20' : 'opacity-40'
              }`}
            >
              <span className="text-caption text-ink-muted">{t(`barrel.reward.${tier.label}`)}</span>
              <span className={`text-caption font-medium ${active ? 'text-barrel' : 'text-ink-tertiary'}`}>
                {tier.min}+
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
