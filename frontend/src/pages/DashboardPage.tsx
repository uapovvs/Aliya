import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Camera, User, ArrowRight } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import StageCard from '@/components/StageCard'
import BarrelProgress from '@/components/BarrelProgress'
import { getMyStages } from '@/api/stages'
import { getMe } from '@/api/auth'
import type { StageResponse, UserProfile, RewardKey } from '@/types'

const STAGE_KEYS = ['D', 'M_A', 'I', 'C'] as const

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stages, setStages]   = useState<StageResponse[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyStages(), getMe()])
      .then(([s, p]) => { setStages(s); setProfile(p) })
      .finally(() => setLoading(false))
  }, [])

  const totalBarrels = stages.reduce((sum, s) => sum + s.barrels, 0)
  const reward: RewardKey =
    totalBarrels >= 16 ? 'JAPAN_TRIP' :
    totalBarrels >= 12 ? 'LEADERSHIP_AWARD' :
    totalBarrels >= 8  ? 'BRANDED_MERCH' : 'PROJECT_BADGE'

  if (loading) {
    return (
      <Layout>
        <motion.div
          className="flex items-center justify-center py-32 text-ink-tertiary text-body"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Загрузка...
        </motion.div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Profile header */}
      <motion.div
        className="flex items-center gap-5 mb-10 pb-8 border-b border-hl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-hl" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-s3 border border-hl flex items-center justify-center">
              <User size={22} className="text-ink-subtle" />
            </div>
          )}
          <Link
            to="/dashboard/avatar"
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-s2 border border-hl flex items-center justify-center hover:bg-s3 transition-colors"
          >
            <Camera size={11} className="text-ink-subtle" />
          </Link>
        </div>

        <div>
          <h1 className="text-headline text-ink mb-0.5">{profile?.fullName}</h1>
          {profile?.position && (
            <p className="text-caption text-ink-tertiary">{profile.position}</p>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-card-title text-ink">Этапы DMAIC</h2>
            <p className="eyebrow">{stages.length} / 4</p>
          </div>

          {stages.length === 0 ? (
            <motion.div
              className="card text-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-body-lg text-ink-subtle mb-1">Начните первый этап</p>
              <p className="text-caption text-ink-tertiary mb-4">
                Заполните этап D (Define) до 30.06.2026
              </p>
              <Link to="/dashboard/stage/d" className="btn-primary inline-flex items-center gap-2">
                Начать этап D <ArrowRight size={13} />
              </Link>
            </motion.div>
          ) : (
            stages.map((s, i) => <StageCard key={s.id} stage={s} index={i} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <BarrelProgress totalBarrels={totalBarrels} reward={reward} />

          {/* Stage status quick view */}
          <motion.div
            className="card space-y-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="eyebrow">Прогресс</p>
            {STAGE_KEYS.map((key) => {
              const s = stages.find((x) => x.stage === key)
              const status = s?.status ?? 'DRAFT'
              const badgeClass =
                status === 'APPROVED'  ? 'badge-approved'  :
                status === 'SUBMITTED' ? 'badge-submitted' : 'badge-draft'
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-caption text-ink-subtle">{t(`stage.${key}`)}</span>
                  <span className={`badge ${badgeClass}`}>{t(`stage.status.${status}`)}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
