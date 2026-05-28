import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import { getSubmittedStages, reviewStage } from '@/api/admin'
import type { StageResponse } from '@/types'

export default function AdminReviewPage() {
  const { userId } = useParams<{ userId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [stages, setStages] = useState<StageResponse[]>([])
  const [scores, setScores] = useState<Record<number, { score: string; comment: string }>>({})
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    getSubmittedStages().then((all) => {
      // In full impl: filter by userId via project relation; here show all submitted for demo
      setStages(all)
    })
  }, [userId])

  const handleReview = async (stageId: number) => {
    const entry = scores[stageId]
    if (!entry) return
    setSaving(stageId)
    try {
      const updated = await reviewStage(stageId, parseInt(entry.score), entry.comment)
      setStages((prev) => prev.map((s) => (s.id === stageId ? updated : s)))
    } finally {
      setSaving(null)
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
        ← Назад
      </button>
      <h1 className="text-2xl font-bold mb-6">Проверка этапов</h1>

      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t(`stage.${stage.stage}`)}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {t(`stage.status.${stage.status}`)}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-700">
              {Object.entries(stage.content ?? {}).map(([k, v]) => (
                <div key={k}>
                  <span className="font-medium">{k}:</span> {String(v)}
                </div>
              ))}
            </div>

            <div className="flex gap-3 items-end pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('admin.score')}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={scores[stage.id]?.score ?? ''}
                  onChange={(e) => setScores((p) => ({ ...p, [stage.id]: { ...p[stage.id], score: e.target.value } }))}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-kmg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('admin.comment')}</label>
                <input
                  type="text"
                  value={scores[stage.id]?.comment ?? ''}
                  onChange={(e) => setScores((p) => ({ ...p, [stage.id]: { ...p[stage.id], comment: e.target.value } }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-kmg"
                  placeholder="Комментарий..."
                />
              </div>
              <button
                onClick={() => handleReview(stage.id)}
                disabled={saving === stage.id || !scores[stage.id]?.score}
                className="btn-primary"
              >
                {saving === stage.id ? '...' : t('admin.approve')}
              </button>
            </div>
          </div>
        ))}
        {stages.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">Нет этапов на проверке</p>
        )}
      </div>
    </Layout>
  )
}
