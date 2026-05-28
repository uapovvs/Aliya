import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, CheckCircle, Clock, SpinnerGap, PaperPlaneTilt, LockSimple } from '@phosphor-icons/react'
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
    { label: 'План сбора данных',       hint: 'Как и какие данные будут собираться' },
    { label: 'Метрики производительности', hint: 'Какие показатели будут отслеживаться' },
    { label: 'Карта процесса',          hint: 'Описание текущего процесса' },
    { label: 'Первопричина проблемы',   hint: 'Выявленная первопричина по данным анализа' },
  ],
  I: [
    { label: 'Предлагаемые решения',    hint: 'Креативные решения для устранения проблемы' },
    { label: 'Результаты тестирования', hint: 'Как было протестировано решение' },
    { label: 'Внедрённые изменения',    hint: 'Что было реализовано' },
  ],
  C: [
    { label: 'План мониторинга',     hint: 'Как будет контролироваться результат' },
    { label: 'Ожидаемые результаты', hint: 'Снижение затрат, рост производительности и т.д.' },
    { label: 'Дата завершения',      hint: 'Планируемая дата финального отчёта' },
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
      setTimeout(() => setSaved(false), 2500)
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
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink-subtle mb-8 transition-colors"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -2 }}
        >
          <ArrowLeft size={13} />
          Мой кабинет
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-2">
            <p className="eyebrow">{t(`stage.status.${stageData?.status ?? 'DRAFT'}`)}</p>
            {locked && <LockSimple size={11} className="text-ink-tertiary" />}
          </div>
          <h1 className="text-headline text-ink mb-3">{t(`stage.${stageKey}`)}</h1>

          {stageData?.adminScore !== null && stageData?.adminScore !== undefined && (
            <motion.div
              className="flex items-center gap-4 p-4 card-lifted"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="barrel text-base w-12 h-12">{stageData.barrels}</div>
              <div>
                <p className="text-2xl font-semibold text-ink" style={{ letterSpacing: '-0.03em' }}>
                  {stageData.adminScore}%
                </p>
                <p className="text-caption text-ink-subtle">Оценка администратора</p>
              </div>
              {stageData.adminComment && (
                <p className="text-caption text-ink-muted border-l border-hl-strong pl-4 flex-1">
                  {stageData.adminComment}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Fields */}
        <motion.div
          className="card space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          {STAGE_FIELDS[stageKey].map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <label className="block text-caption text-ink-subtle mb-1.5">{field.label}</label>
              <textarea
                rows={4}
                value={fields[field.label] ?? ''}
                onChange={(e) => setFields((p) => ({ ...p, [field.label]: e.target.value }))}
                disabled={locked}
                placeholder={locked ? '' : field.hint}
                className="textarea"
              />
            </motion.div>
          ))}

          {!locked && (
            <div className="flex items-center gap-3 pt-2 border-t border-hl">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.span key="saving"><SpinnerGap size={14} className="animate-spin" /></motion.span>
                  ) : saved ? (
                    <motion.span key="saved" className="flex items-center gap-1.5 text-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <CheckCircle size={14} weight="fill" /> Сохранено
                    </motion.span>
                  ) : (
                    <motion.span key="save">{t('stage.save')}</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting
                  ? <SpinnerGap size={14} className="animate-spin" />
                  : <><PaperPlaneTilt size={14} />{t('stage.submit')}</>
                }
              </motion.button>
            </div>
          )}

          {locked && (
            <div className="pt-4 border-t border-hl flex items-center gap-2 text-caption text-ink-tertiary">
              <LockSimple size={12} />
              {stageData?.status === 'APPROVED'
                ? 'Этап одобрен. Редактирование недоступно.'
                : 'Этап отправлен на проверку. Ожидайте решения администратора.'}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
