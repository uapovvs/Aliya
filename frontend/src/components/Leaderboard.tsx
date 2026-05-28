import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '@/types'

interface Props { entries: LeaderboardEntry[] }

const REWARD_ICON: Record<string, string> = {
  JAPAN_TRIP:       '✈',
  LEADERSHIP_AWARD: '🏆',
  BRANDED_MERCH:    '🎒',
  PROJECT_BADGE:    '🔖',
}

export default function Leaderboard({ entries }: Props) {
  const { t } = useTranslation()

  return (
    <div className="card-panel overflow-hidden p-0 animate-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-hl flex items-center justify-between">
        <div>
          <p className="eyebrow mb-0.5">{t('leaderboard.title')}</p>
          <p className="text-caption text-ink-tertiary">{entries.length} участников</p>
        </div>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <div className="px-6 py-16 text-center text-ink-tertiary text-body">
          Нет данных
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-hl">
              <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary w-12">#</th>
              <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary">{t('leaderboard.participant')}</th>
              <th className="px-6 py-3 text-center text-eyebrow uppercase text-ink-tertiary">{t('leaderboard.barrels')}</th>
              <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary hidden md:table-cell">{t('leaderboard.reward')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hl">
            {entries.map((entry, i) => (
              <tr
                key={entry.userId}
                className="group hover:bg-s2 transition-colors duration-100"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-6 py-4">
                  <span className="text-body font-medium text-ink-tertiary">
                    {i < 3 ? ['01', '02', '03'][i] : String(i + 1).padStart(2, '0')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-hl" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-s3 border border-hl flex items-center justify-center text-caption font-semibold text-ink-subtle select-none">
                        {entry.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-body font-medium text-ink">{entry.fullName}</div>
                      {entry.position && (
                        <div className="text-caption text-ink-tertiary">{entry.position}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`barrel ${entry.totalBarrels === 0 ? 'opacity-30' : ''}`}>
                      {entry.totalBarrels}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="text-body">{REWARD_ICON[entry.reward]}</span>
                    <span className="text-caption text-ink-subtle">{t(`barrel.reward.${entry.reward}`)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
