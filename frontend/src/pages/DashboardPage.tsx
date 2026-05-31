import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Camera, Plus } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import StageCard from '@/components/StageCard'
import BarrelProgress from '@/components/BarrelProgress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getMyStages } from '@/api/stages'
import { getMe } from '@/api/auth'
import type { StageKey, StageResponse, UserProfile, RewardKey } from '@/types'

const STAGE_KEYS = ['D', 'M_A', 'I', 'C'] as const

const STAGE_SLUG: Record<StageKey, string> = {
  D: 'd', M_A: 'ma', I: 'i', C: 'c',
}

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected',
}

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

  const initials = profile?.fullName
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '??'

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
          <Avatar className="h-14 w-14 border border-hl">
            <AvatarImage src={profile?.avatarUrl ?? ''} alt={profile?.fullName} />
            <AvatarFallback className="text-body font-semibold">{initials}</AvatarFallback>
          </Avatar>
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

          {STAGE_KEYS.map((key, i) => {
            const existing = stages.find((s) => s.stage === key)
            if (existing) {
              return <StageCard key={key} stage={existing} index={i} />
            }
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              >
                <div className="card flex items-center gap-4 opacity-50">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-s2 border border-hl-strong flex items-center justify-center ring-1 ring-hl/40 ring-offset-1 ring-offset-s1">
                    <span className="text-sm font-semibold text-ink-subtle leading-none">
                      {key === 'M_A' ? 'M/A' : key}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-ink">{t(`stage.${key}`)}</p>
                    <p className="text-caption text-ink-tertiary">Не начат</p>
                  </div>
                  <Link
                    to={`/dashboard/stage/${STAGE_SLUG[key]}`}
                    className="btn-secondary text-caption flex items-center gap-1.5 shrink-0"
                  >
                    <Plus size={12} />
                    Начать
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <BarrelProgress totalBarrels={totalBarrels} reward={reward} />

          {/* Progress status card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="eyebrow text-ink-subtle">Прогресс</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {STAGE_KEYS.map((key) => {
                  const s = stages.find((x) => x.stage === key)
                  const status = s?.status ?? 'DRAFT'
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-caption text-ink-subtle">{t(`stage.${key}`)}</span>
                      <Badge variant={STATUS_VARIANT[status]}>
                        {t(`stage.status.${status}`)}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
