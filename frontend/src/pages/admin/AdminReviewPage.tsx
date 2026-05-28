import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowLeft, SpinnerGap } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { getSubmittedStages, reviewStage } from '@/api/admin'
import type { StageResponse } from '@/types'

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected',
}

function barrelsForScore(score: number): number {
  if (score >= 100) return 5
  if (score >= 80)  return 4
  if (score >= 50)  return 2
  if (score >= 40)  return 1
  return 0
}

export default function AdminReviewPage() {
  const { userId } = useParams<{ userId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [stages, setStages]   = useState<StageResponse[]>([])
  const [scores, setScores]   = useState<Record<number, { score: number; comment: string }>>({})
  const [saving, setSaving]   = useState<number | null>(null)
  const [confirm, setConfirm] = useState<number | null>(null)

  useEffect(() => {
    getSubmittedStages().then(setStages)
  }, [userId])

  const handleReview = async (stageId: number) => {
    const entry = scores[stageId]
    if (!entry) return
    setSaving(stageId)
    setConfirm(null)
    try {
      const updated = await reviewStage(stageId, entry.score, entry.comment)
      setStages((p) => p.map((s) => (s.id === stageId ? updated : s)))
    } finally {
      setSaving(null)
    }
  }

  const setField = (id: number, field: 'score' | 'comment', val: number | string) =>
    setScores((p) => ({ ...p, [id]: { score: p[id]?.score ?? 0, comment: p[id]?.comment ?? '', [field]: val } }))

  return (
    <Layout>
      <motion.button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink-subtle mb-8 transition-colors"
        whileHover={{ x: -2 }}
      >
        <ArrowLeft size={13} />
        Панель администратора
      </motion.button>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="eyebrow mb-1">Проверка этапов</p>
        <h1 className="text-headline text-ink">Этапы на согласовании</h1>
      </motion.div>

      {stages.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-body-lg text-ink-subtle mb-1">Нет этапов на проверке</p>
          <p className="text-caption text-ink-tertiary">Участники ещё не отправили свои этапы</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, i) => {
            const currentScore = scores[stage.id]?.score ?? 0
            const previewBarrels = barrelsForScore(currentScore)

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="overflow-hidden">
                  {/* Stage header */}
                  <CardHeader className="pb-4 border-b border-hl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={STATUS_VARIANT[stage.status]}>
                            {t(`stage.status.${stage.status}`)}
                          </Badge>
                        </div>
                        <h3 className="text-card-title text-ink">{t(`stage.${stage.stage}`)}</h3>
                        {stage.submittedAt && (
                          <p className="text-caption text-ink-tertiary mt-1">
                            Отправлено: {new Date(stage.submittedAt).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                      {stage.adminScore !== null && (
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="barrel">{stage.barrels}</div>
                          <div className="text-right">
                            <p className="text-headline font-semibold text-ink">{stage.adminScore}%</p>
                            <p className="text-caption text-ink-tertiary">оценка</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-5">
                    {/* Content fields */}
                    {Object.keys(stage.content ?? {}).length > 0 && (
                      <div className="space-y-3 mb-6">
                        {Object.entries(stage.content ?? {}).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-caption text-ink-tertiary mb-0.5">{k}</p>
                            <p className="text-body text-ink-muted leading-relaxed">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Review panel */}
                    <div className="pt-5 border-t border-hl space-y-4">
                      {/* Score slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{t('admin.score')}</Label>
                          <div className="flex items-center gap-2">
                            <span className="text-headline font-semibold text-ink" style={{ letterSpacing: '-0.02em' }}>
                              {currentScore}%
                            </span>
                            <span className="barrel w-7 h-7 text-xs">{previewBarrels}</span>
                          </div>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={currentScore}
                          onChange={(v) => setField(stage.id, 'score', v)}
                          className="py-2"
                        />
                        <div className="flex justify-between text-caption text-ink-tertiary">
                          <span>0%</span>
                          <span className="text-danger">40%</span>
                          <span className="text-barrel">80%</span>
                          <span className="text-success">100%</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="space-y-1.5">
                        <Label htmlFor={`comment-${stage.id}`}>{t('admin.comment')}</Label>
                        <Input
                          id={`comment-${stage.id}`}
                          type="text"
                          value={scores[stage.id]?.comment ?? ''}
                          onChange={(e) => setField(stage.id, 'comment', e.target.value)}
                          placeholder="Комментарий для участника..."
                        />
                      </div>

                      <Button
                        onClick={() => setConfirm(stage.id)}
                        disabled={saving === stage.id || !scores[stage.id]?.score}
                        className="w-full sm:w-auto"
                      >
                        {saving === stage.id ? (
                          <SpinnerGap size={14} className="animate-spin" />
                        ) : t('admin.approve')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirm !== null} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить оценку</DialogTitle>
            <DialogDescription>
              {confirm !== null && (
                <>Оценка <strong>{scores[confirm]?.score ?? 0}%</strong> — {barrelsForScore(scores[confirm]?.score ?? 0)} баррелей. Действие нельзя отменить.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(null)}>Отмена</Button>
            <Button onClick={() => confirm !== null && handleReview(confirm)}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
