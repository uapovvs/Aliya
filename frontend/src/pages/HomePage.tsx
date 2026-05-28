import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import Leaderboard from '@/components/Leaderboard'
import { getLeaderboard } from '@/api/leaderboard'
import type { LeaderboardEntry } from '@/types'

export default function HomePage() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-kmg">DMAIC Platform</h1>
        <p className="text-gray-500 mt-1">КазМунайГаз — Программа непрерывного совершенствования</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">Загрузка...</div>
      ) : (
        <Leaderboard entries={entries} />
      )}
    </Layout>
  )
}
