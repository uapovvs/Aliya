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

  const [stages, setStages]   = useState<StageResponse[]>([])
  const [scores, setScores]   = useState<Record<number, { score: string; comment: string }>>({})
  const [saving, setSaving]   = useState<number | null>(null)

  useEffect(() => {
    getSubmittedStages().then(setStages)
  }, [userId])

  const handleReview = async (stageId: number) => {
    const entry = scores[stageId]
    if (!entry?.score) return
    setSaving(stageId)
    try {
      const updated = await reviewStage(stageId, parseInt(entry.score), entry.comment)
      setStages((p) => p.map((s) => (s.id === stageId ? updated : s)))
    } finally {
      setSaving(null)
    }
  }

  const setScore = (id: number, field: 'score' | 'comment', val: string) =>
    setScores((p) => ({ ...p, [id]: { ...p[id], [field]: val } }))

  return (
    <Layout>
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink-subtle mb-8 transition-colors"
      >
        <span>←</span>
        <span>Панель администратора</span>
      </button>

      <div className="mb-8 animate-in">
        <p className="eyebrow mb-1">Проверка этапов</p>
        <h1 className="text-headline text-ink">Этапы на согласовании</h1>
      </div>

      {stages.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-body-lg text-ink-subtle mb-1">Нет этапов на проверке</p>
          <p className="text-caption text-ink-tertiary">Участники ещё не отправили свои этапы</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, i) => (
            <div
              key={stage.id}
              className="card animate-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Stage header */}
              <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-hl">
                <div>
                  <p className="eyebrow mb-1">{t(`stage.status.${stage.status}`)}</p>
                  <h3 className="text-card-title text-ink">{t(`stage.${stage.stage}`)}</h3>
                  {stage.submittedAt && (
                    <p className="text-caption text-ink-tertiary mt-1">
                      Отправлено: {new Date(stage.submittedAt).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
                {stage.adminScore !== null && (
                  <div className="flex items-center gap-3">
                    <div className="barrel">{stage.barrels}</div>
                    <div className="text-right">
                      <p className="text-headline font-semibold text-ink">{stage.adminScore}%</p>
                      <p className="text-caption text-ink-tertiary">оценка</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3 mb-6">
                {Object.entries(stage.content ?? {}).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-caption text-ink-tertiary mb-0.5">{k}</p>
                    <p className="text-body text-ink-muted leading-relaxed">{String(v)}</p>
                  </div>
                ))}
              </div>

              {/* Review panel */}
              <div className="flex flex-wrap gap-3 items-end pt-5 border-t border-hl">
                <div>
                  <label className="block text-caption text-ink-subtle mb-1.5">{t('admin.score')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={scores[stage.id]?.score ?? ''}
                      onChange={(e) => setScore(stage.id, 'score', e.target.value)}
                      className="input w-20"
                      placeholder="0–100"
                    />
                    <span className="text-caption text-ink-tertiary">%</span>
                  </div>
                </div>

                <div className="flex-1 min-w-48">
                  <label className="block text-caption text-ink-subtle mb-1.5">{t('admin.comment')}</label>
                  <input
                    type="text"
                    value={scores[stage.id]?.comment ?? ''}
                    onChange={(e) => setScore(stage.id, 'comment', e.target.value)}
                    className="input"
                    placeholder="Комментарий для участника..."
                  />
                </div>

                <button
                  onClick={() => handleReview(stage.id)}
                  disabled={saving === stage.id || !scores[stage.id]?.score}
                  className="btn-primary"
                >
                  {saving === stage.id ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : t('admin.approve')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
