import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import Leaderboard from '@/components/Leaderboard'
import { getLeaderboard } from '@/api/leaderboard'
import { useAuthStore } from '@/store/authStore'
import type { LeaderboardEntry } from '@/types'

const STAGES = [
  { key: 'D',   label: 'Define',          deadline: '30.06.2026' },
  { key: 'M/A', label: 'Measure+Analyze', deadline: '30.08.2026' },
  { key: 'I',   label: 'Improve',         deadline: '30.11.2026' },
  { key: 'C',   label: 'Control',         deadline: '20.12.2026' },
]

export default function HomePage() {
  const { t } = useTranslation()
  const { role } = useAuthStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(setEntries).finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% -10%, rgba(94,106,210,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative">
        {/* Hero */}
        <div className="pt-8 pb-14 animate-in">
          <p className="eyebrow mb-4">КазМунайГаз · DMAIC Platform</p>
          <h1 className="text-display text-ink mb-4 max-w-2xl">
            Программа непрерывного совершенствования
          </h1>
          <p className="text-body-lg text-ink-subtle max-w-xl mb-8">
            Участники проходят 4 этапа DMAIC, получают баррели за каждый шаг
            и соревнуются за награды от председателя правления.
          </p>
          <div className="flex items-center gap-3">
            {!role ? (
              <Link to="/login" className="btn-primary">Войти в платформу</Link>
            ) : role === 'PARTICIPANT' ? (
              <Link to="/dashboard" className="btn-primary">Мой кабинет</Link>
            ) : (
              <Link to="/admin" className="btn-primary">Панель администратора</Link>
            )}
            <span className="text-caption text-ink-tertiary">Старт: 18 мая 2026</span>
          </div>
        </div>

        {/* DMAIC stages strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              className="card hover:bg-s2 transition-colors animate-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-md bg-s3 border border-hl flex items-center justify-center mb-3">
                <span className="text-body font-semibold text-ink-subtle">{s.key}</span>
              </div>
              <p className="text-body font-medium text-ink mb-1">{s.label}</p>
              <p className="text-caption text-ink-tertiary">{s.deadline}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-headline text-ink">{t('leaderboard.title')}</h2>
            <div className="flex items-center gap-2 text-caption text-ink-tertiary">
              <span className="barrel text-xs w-6 h-6">🛢</span>
              <span>до 20 баррелей</span>
            </div>
          </div>

          {loading ? (
            <div className="card text-center py-16 text-ink-tertiary animate-pulse">
              Загрузка рейтинга...
            </div>
          ) : (
            <Leaderboard entries={entries} />
          )}
        </div>
      </div>
    </Layout>
  )
}
