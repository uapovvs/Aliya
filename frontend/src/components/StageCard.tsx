import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { StageResponse } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  DRAFT:     'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED:  'bg-green-100 text-green-700',
  REJECTED:  'bg-red-100 text-red-700',
}

interface Props { stage: StageResponse }

export default function StageCard({ stage }: Props) {
  const { t } = useTranslation()
  const stageSlug = stage.stage.toLowerCase().replace('_', '')

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base truncate">{t(`stage.${stage.stage}`)}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[stage.status]}`}>
            {t(`stage.status.${stage.status}`)}
          </span>
          {stage.deadline && (
            <span className="text-xs text-gray-400">{t('stage.deadline')}: {stage.deadline}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {stage.adminScore !== null && (
          <div className="text-center">
            <div className="text-xl font-bold text-kmg">{stage.adminScore}%</div>
            <div className="barrel-icon">{stage.barrels}</div>
          </div>
        )}
        <Link to={`/dashboard/stage/${stageSlug}`} className="btn-primary text-xs">
          {stage.status === 'DRAFT' ? t('stage.save') : 'Открыть'}
        </Link>
      </div>
    </div>
  )
}
