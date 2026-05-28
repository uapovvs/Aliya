import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import StageCard from '@/components/StageCard'
import BarrelProgress from '@/components/BarrelProgress'
import { getMyStages } from '@/api/stages'
import { getMe } from '@/api/auth'
import type { StageResponse, UserProfile, RewardKey } from '@/types'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stages, setStages] = useState<StageResponse[]>([])
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

  if (loading) return <Layout><div className="text-center py-16 text-gray-400">Загрузка...</div></Layout>

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-kmg" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-kmg text-white flex items-center justify-center text-xl font-bold">
            {profile?.fullName.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile?.fullName}</h1>
          {profile?.position && <p className="text-gray-500 text-sm">{profile.position}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Этапы DMAIC</h2>
          {stages.map((s) => <StageCard key={s.id} stage={s} />)}
          {stages.length === 0 && (
            <p className="text-gray-400 text-sm">Этапы появятся после начала заполнения</p>
          )}
        </div>
        <div>
          <BarrelProgress totalBarrels={totalBarrels} reward={reward} />
        </div>
      </div>
    </Layout>
  )
}
