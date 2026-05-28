import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '@/types'

interface Props { entries: LeaderboardEntry[] }

export default function Leaderboard({ entries }: Props) {
  const { t } = useTranslation()

  return (
    <div className="card overflow-hidden p-0">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-xl">{t('leaderboard.title')}</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-left">{t('leaderboard.rank')}</th>
            <th className="px-6 py-3 text-left">{t('leaderboard.participant')}</th>
            <th className="px-6 py-3 text-center">{t('leaderboard.barrels')}</th>
            <th className="px-6 py-3 text-left hidden md:table-cell">{t('leaderboard.reward')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry, i) => (
            <tr key={entry.userId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-400">{i + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-kmg text-white flex items-center justify-center text-xs font-bold">
                      {entry.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{entry.fullName}</div>
                    {entry.position && <div className="text-xs text-gray-400">{entry.position}</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="barrel-icon text-base w-10 h-10">{entry.totalBarrels}</span>
              </td>
              <td className="px-6 py-4 hidden md:table-cell text-gray-600 text-xs">
                {t(`barrel.reward.${entry.reward}`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
