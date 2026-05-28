import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { AirplaneTilt, Trophy, Bag, Bookmark, User } from '@phosphor-icons/react'
import type { LeaderboardEntry } from '@/types'

interface Props { entries: LeaderboardEntry[] }

const REWARD_ICON: Record<string, React.ReactNode> = {
  JAPAN_TRIP:       <AirplaneTilt weight="fill" size={13} className="text-barrel" />,
  LEADERSHIP_AWARD: <Trophy weight="fill" size={13} className="text-accent" />,
  BRANDED_MERCH:    <Bag weight="fill" size={13} className="text-success" />,
  PROJECT_BADGE:    <Bookmark weight="fill" size={13} className="text-ink-subtle" />,
}

const RANK_STYLE = ['text-barrel', 'text-ink-muted', 'text-ink-subtle']

export default function Leaderboard({ entries }: Props) {
  const { t } = useTranslation()

  return (
    <div className="card-panel overflow-hidden p-0">
      <div className="px-6 py-4 border-b border-hl flex items-center justify-between">
        <div>
          <p className="eyebrow mb-0.5">{t('leaderboard.title')}</p>
          <p className="text-caption text-ink-tertiary">{entries.length} участников</p>
        </div>
      </div>

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
              <motion.tr
                key={entry.userId}
                className="hover:bg-s2 transition-colors duration-100"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                <td className="px-6 py-4">
                  <span className={`text-body font-semibold ${RANK_STYLE[i] ?? 'text-ink-tertiary'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-hl" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-s3 border border-hl flex items-center justify-center">
                        <User size={14} className="text-ink-subtle" />
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
                    <motion.span
                      className={`barrel ${entry.totalBarrels === 0 ? 'opacity-25' : ''}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {entry.totalBarrels}
                    </motion.span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {REWARD_ICON[entry.reward]}
                    <span className="text-caption text-ink-subtle">{t(`barrel.reward.${entry.reward}`)}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
