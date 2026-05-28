import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight, Cylinder, Flag, ChartBar, Lightning, CheckCircle } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Leaderboard from '@/components/Leaderboard'
import { getLeaderboard } from '@/api/leaderboard'
import { useAuthStore } from '@/store/authStore'
import type { LeaderboardEntry } from '@/types'

const STAGES = [
  { key: 'D',   label: 'Define',          sub: 'Определение проблемы',      deadline: '30.06.2026', icon: <Flag weight="regular" size={16} /> },
  { key: 'M/A', label: 'Measure+Analyze', sub: 'Измерение и анализ данных', deadline: '30.08.2026', icon: <ChartBar weight="regular" size={16} /> },
  { key: 'I',   label: 'Improve',         sub: 'Оптимизация процесса',       deadline: '30.11.2026', icon: <Lightning weight="regular" size={16} /> },
  { key: 'C',   label: 'Control',         sub: 'Контроль результатов',       deadline: '20.12.2026', icon: <CheckCircle weight="regular" size={16} /> },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

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
      <div
        className="fixed inset-0 pointer-events-none -z-0"
        style={{ background: 'radial-gradient(ellipse 80% 30% at 50% -10%, rgba(94,106,210,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative">
        {/* Hero */}
        <motion.div
          className="pt-6 pb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-4 flex items-center gap-1.5">
            <Cylinder weight="regular" size={11} />
            КазМунайГаз · DMAIC Platform
          </p>
          <h1 className="text-display text-ink mb-4 max-w-xl">
            Программа непрерывного совершенствования
          </h1>
          <p className="text-body-lg text-ink-subtle max-w-lg mb-8">
            Участники проходят 4 этапа DMAIC, получают баррели за каждый шаг
            и соревнуются за награды от председателя правления.
          </p>
          <div className="flex items-center gap-3">
            {!role ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/login" className="btn-primary flex items-center gap-2">
                  Войти в платформу <ArrowRight size={14} />
                </Link>
              </motion.div>
            ) : role === 'PARTICIPANT' ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                Мой кабинет <ArrowRight size={14} />
              </Link>
            ) : (
              <Link to="/admin" className="btn-primary flex items-center gap-2">
                Панель администратора <ArrowRight size={14} />
              </Link>
            )}
            <span className="text-caption text-ink-tertiary">Старт: 18 мая 2026</span>
          </div>
        </motion.div>

        {/* DMAIC stages */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {STAGES.map((s) => (
            <motion.div
              key={s.key}
              variants={item}
              className="card hover:bg-s2 hover:border-hl-strong transition-colors cursor-default"
              whileHover={{ y: -2 }}
            >
              <div className="w-8 h-8 rounded-md bg-s3 border border-hl flex items-center justify-center mb-3 text-ink-subtle">
                {s.icon}
              </div>
              <p className="text-body font-semibold text-ink mb-0.5">{s.label}</p>
              <p className="text-caption text-ink-subtle mb-3 leading-snug">{s.sub}</p>
              <p className="text-caption text-ink-tertiary">{s.deadline}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-headline text-ink">{t('leaderboard.title')}</h2>
            <div className="flex items-center gap-1.5 text-caption text-ink-tertiary">
              <Cylinder weight="regular" size={12} />
              <span>до 20 баррелей</span>
            </div>
          </div>

          {loading ? (
            <div className="card text-center py-16 text-ink-tertiary text-body">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Загрузка рейтинга...
              </motion.div>
            </div>
          ) : (
            <Leaderboard entries={entries} />
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
