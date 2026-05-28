import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import StageCard from '@/components/StageCard'
import BarrelProgress from '@/components/BarrelProgress'
import { getMyStages } from '@/api/stages'
import { getMe } from '@/api/auth'
import type { StageResponse, UserProfile, RewardKey } from '@/types'

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
        <div className="flex items-center justify-center py-32 text-ink-tertiary animate-pulse">
          Загрузка...
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Profile header */}
      <div className="flex items-center gap-5 mb-10 pb-8 border-b border-hl animate-in">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-14 h-14 rounded-full object-cover border border-hl"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-s3 border border-hl flex items-center justify-center text-headline font-semibold text-ink-subtle select-none">
            {profile?.fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-headline text-ink mb-0.5">{profile?.fullName}</h1>
          {profile?.position && (
            <p className="text-caption text-ink-tertiary">{profile.position}</p>
          )}
        </div>
        <div className="ml-auto">
          <Link to="/dashboard/avatar" className="btn-ghost text-caption">
            Сменить фото
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-card-title text-ink">Этапы DMAIC</h2>
            <p className="eyebrow">{stages.length} / 4</p>
          </div>

          {stages.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-body-lg text-ink-subtle mb-1">Начните первый этап</p>
              <p className="text-caption text-ink-tertiary mb-4">
                Заполните этап D (Define) до 30.06.2026
              </p>
              <Link to="/dashboard/stage/d" className="btn-primary">
                Начать этап D
              </Link>
            </div>
          ) : (
            stages.map((s) => <StageCard key={s.id} stage={s} />)
          )}
        </div>

        {/* Progress sidebar */}
        <div className="space-y-4">
          <BarrelProgress totalBarrels={totalBarrels} reward={reward} />

          {/* Quick stats */}
          <div className="card space-y-3 animate-in" style={{ animationDelay: '100ms' }}>
            <p className="eyebrow">Прогресс</p>
            {(['D', 'M_A', 'I', 'C'] as const).map((key) => {
              const s = stages.find((x) => x.stage === key)
              const status = s?.status ?? 'DRAFT'
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-caption text-ink-subtle">{t(`stage.${key}`)}</span>
                  <span className={
                    status === 'APPROVED'  ? 'badge-approved'  :
                    status === 'SUBMITTED' ? 'badge-submitted' :
                    'badge-draft'
                  }>
                    {t(`stage.status.${status}`)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
