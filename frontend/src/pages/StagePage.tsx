import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import { getMyStages, saveStageContent, submitStage } from '@/api/stages'
import type { StageKey, StageResponse } from '@/types'

const STAGE_FIELDS: Record<StageKey, string[]> = {
  D:   ['Описание проблемы', 'Желаемый результат', 'Ключевые компоненты качества'],
  M_A: ['План сбора данных', 'Метрики производительности', 'Карта процесса', 'Первопричина проблемы'],
  I:   ['Предлагаемые решения', 'Результаты тестирования', 'Внедрённые изменения'],
  C:   ['План мониторинга', 'Ожидаемые результаты', 'Дата завершения'],
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
  const [fields, setFields] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  const isApproved = stageData?.status === 'APPROVED'
  const isSubmitted = stageData?.status === 'SUBMITTED'

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-gray-600 mb-2">
            ← Назад
          </button>
          <h1 className="text-2xl font-bold">{t(`stage.${stageKey}`)}</h1>
          {stageData?.adminComment && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <strong>Комментарий администратора:</strong> {stageData.adminComment}
            </div>
          )}
        </div>

        <div className="card space-y-5">
          {STAGE_FIELDS[stageKey].map((fieldName) => (
            <div key={fieldName}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{fieldName}</label>
              <textarea
                rows={4}
                value={fields[fieldName] ?? ''}
                onChange={(e) => setFields((prev) => ({ ...prev, [fieldName]: e.target.value }))}
                disabled={isApproved || isSubmitted}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-kmg resize-none
                           disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          ))}

          {!isApproved && (
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving || isSubmitted} className="btn-primary">
                {saving ? '...' : t('stage.save')}
              </button>
              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-kmg text-kmg text-sm font-medium
                             hover:bg-kmg hover:text-white transition-colors"
                >
                  {submitting ? '...' : t('stage.submit')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
