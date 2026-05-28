import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import { getMyStages, saveStageContent, submitStage } from '@/api/stages'
import type { StageKey, StageResponse } from '@/types'

const STAGE_FIELDS: Record<StageKey, { label: string; hint: string }[]> = {
  D: [
    { label: 'Описание проблемы',           hint: 'Опишите суть проблемы и её причины' },
    { label: 'Желаемый результат',           hint: 'Какой результат ожидается по завершении' },
    { label: 'Ключевые компоненты качества', hint: 'Что определяет качество в данном процессе' },
  ],
  M_A: [
    { label: 'План сбора данных',     hint: 'Как и какие данные будут собираться' },
    { label: 'Метрики производительности', hint: 'Какие показатели будут отслеживаться' },
    { label: 'Карта процесса',        hint: 'Описание текущего процесса' },
    { label: 'Первопричина проблемы', hint: 'Выявленная первопричина по данным анализа' },
  ],
  I: [
    { label: 'Предлагаемые решения',   hint: 'Креативные решения для устранения проблемы' },
    { label: 'Результаты тестирования', hint: 'Как было протестировано решение' },
    { label: 'Внедрённые изменения',   hint: 'Что было реализовано' },
  ],
  C: [
    { label: 'План мониторинга',    hint: 'Как будет контролироваться результат' },
    { label: 'Ожидаемые результаты', hint: 'Снижение затрат, рост производительности и т.д.' },
    { label: 'Дата завершения',     hint: 'Планируемая дата финального отчёта' },
  ],
}

function slugToStage(slug: string): StageKey {
  const map: Record<string, StageKey> = { d: 'D', ma: 'M_A', i: 'I', c: 'C' }
  return map[slug] ?? 'D'
}

export default function StagePage() {
  const { stage: slug = 'd' } = useParams<{ stage: string }>()
  const stageKey = slugToStage(slug)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [stageData, setStageData] = useState<StageResponse | null>(null)
  const [fields, setFields]       = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    getMyStages().then((stages) => {
      const s = stages.find((x) => x.stage === stageKey)
      if (s) {
        setStageData(s)
        setFields(Object.fromEntries(
          Object.entries(s.content ?? {}).map(([k, v]) => [k, String(v)])
        ))
      }
    })
  }, [stageKey])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await saveStageContent(stageKey, fields)
      setStageData(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitStage(stageKey)
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  const locked = stageData?.status === 'APPROVED' || stageData?.status === 'SUBMITTED'

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink-subtle mb-8 transition-colors"
        >
          <span>←</span>
          <span>Мой кабинет</span>
        </button>

        {/* Stage header */}
        <div className="mb-8 animate-in">
          <p className="eyebrow mb-2">{t(`stage.status.${stageData?.status ?? 'DRAFT'}`)}</p>
          <h1 className="text-headline text-ink mb-3">{t(`stage.${stageKey}`)}</h1>

          {stageData?.adminScore !== null && stageData?.adminScore !== undefined && (
            <div className="flex items-center gap-4 p-4 card-lifted mt-4">
              <div className="barrel text-lg w-12 h-12">{stageData.barrels}</div>
              <div>
                <p className="text-card-title font-semibold text-ink">{stageData.adminScore}%</p>
                <p className="text-caption text-ink-subtle">Оценка администратора</p>
              </div>
              {stageData.adminComment && (
                <p className="text-caption text-ink-muted border-l border-hl-strong pl-4 ml-2 flex-1">
                  {stageData.adminComment}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="card space-y-6 animate-in" style={{ animationDelay: '60ms' }}>
          {STAGE_FIELDS[stageKey].map((field, i) => (
            <div key={field.label} style={{ animationDelay: `${80 + i * 40}ms` }}>
              <label className="block text-caption text-ink-subtle mb-1.5">
                {field.label}
              </label>
              <textarea
                rows={4}
                value={fields[field.label] ?? ''}
                onChange={(e) => setFields((p) => ({ ...p, [field.label]: e.target.value }))}
                disabled={locked}
                placeholder={locked ? '' : field.hint}
                className="textarea"
              />
            </div>
          ))}

          {!locked && (
            <div className="flex items-center gap-3 pt-2 border-t border-hl">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-secondary"
              >
                {saving ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                ) : saved ? '✓ Сохранено' : t('stage.save')}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : t('stage.submit')}
              </button>
            </div>
          )}

          {locked && (
            <div className="pt-4 border-t border-hl">
              <p className="text-caption text-ink-tertiary">
                {stageData?.status === 'APPROVED'
                  ? 'Этап одобрен. Редактирование недоступно.'
                  : 'Этап отправлен на проверку. Ожидайте решения администратора.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
