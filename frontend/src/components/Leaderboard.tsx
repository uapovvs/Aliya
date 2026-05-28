import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { AirplaneTilt, Trophy, Bag, Bookmark } from '@phosphor-icons/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import BarrelIcon from '@/components/BarrelIcon'
import type { LeaderboardEntry } from '@/types'

interface Props { entries: LeaderboardEntry[] }

const REWARD_ICON: Record<string, React.ReactNode> = {
  JAPAN_TRIP:        <AirplaneTilt weight="fill" size={13} className="text-barrel" />,
  LEADERSHIP_AWARD:  <Trophy weight="fill" size={13} className="text-accent" />,
  BRANDED_MERCH:     <Bag weight="fill" size={13} className="text-success" />,
  PROJECT_BADGE:     <Bookmark weight="fill" size={13} className="text-ink-subtle" />,
}

const RANK_STYLE = ['text-barrel font-bold', 'text-ink-muted font-semibold', 'text-ink-subtle font-semibold']

const MAX_BARRELS = 20

export default function Leaderboard({ entries }: Props) {
  const { t } = useTranslation()

  return (
    <div className="bg-s1 overflow-hidden" style={{ height: '100%' }}>
      {entries.length === 0 ? (
        <div className="px-6 py-16 text-center text-ink-tertiary text-body">
          {t('home.no_data')}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-eyebrow uppercase">#</TableHead>
              <TableHead className="text-eyebrow uppercase">{t('leaderboard.participant')}</TableHead>
              <TableHead className="text-eyebrow uppercase">{t('leaderboard.barrels')}</TableHead>
              <TableHead className="text-eyebrow uppercase hidden md:table-cell">{t('leaderboard.reward')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, i) => (
              <motion.tr
                key={entry.userId}
                className="border-b border-hl transition-colors hover:bg-s2"
                style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(91,141,238,0.025)' }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                {/* Rank */}
                <TableCell>
                  {i < 3 ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: i === 0 ? 'linear-gradient(135deg,#f0b429,#d97706)' : i === 1 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : 'linear-gradient(135deg,#cd7c3a,#92400e)',
                      fontSize: '11px', fontWeight: 800, color: '#fff',
                    }}>
                      {i + 1}
                    </span>
                  ) : (
                    <span className={`text-body ${RANK_STYLE[i] ?? 'text-ink-tertiary font-medium'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </TableCell>

                {/* Participant */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-hl">
                      <AvatarImage src={entry.avatarUrl ?? ''} alt={entry.fullName} />
                      <AvatarFallback>
                        {entry.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-body font-medium text-ink">{entry.fullName}</div>
                      {entry.position && (
                        <div className="text-caption text-ink-tertiary">{entry.position}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Barrels + progress */}
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <motion.span
                      className={`barrel shrink-0 flex items-center gap-1 ${entry.totalBarrels === 0 ? 'opacity-25' : ''}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <BarrelIcon size={13} color="var(--barrel)" strokeWidth={1.6} />
                      {entry.totalBarrels}
                    </motion.span>
                    <div className="flex-1 h-1 bg-hl rounded-pill overflow-hidden">
                      <motion.div
                        className="h-full bg-barrel rounded-pill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry.totalBarrels / MAX_BARRELS) * 100}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 + 0.2 }}
                      />
                    </div>
                    <span className="text-caption text-ink-tertiary w-10 text-right shrink-0">
                      /{MAX_BARRELS}
                    </span>
                  </div>
                </TableCell>

                {/* Reward */}
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {REWARD_ICON[entry.reward]}
                    <span className="text-caption text-ink-subtle">{t(`barrel.reward.${entry.reward}`)}</span>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
