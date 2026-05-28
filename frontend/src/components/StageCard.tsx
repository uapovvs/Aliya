import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { StageResponse } from '@/types'

const STAGE_META: Record<string, { letter: string; deadline: string }> = {
  D:   { letter: 'D', deadline: '30.06.2026' },
  M_A: { letter: 'M', deadline: '30.08.2026' },
  I:   { letter: 'I', deadline: '30.11.2026' },
  C:   { letter: 'C', deadline: '20.12.2026' },
}

interface Props { stage: StageResponse }

export default function StageCard({ stage }: Props) {
  const { t } = useTranslation()
  const meta = STAGE_META[stage.stage]
  const slug = stage.stage.toLowerCase().replace('_', '')

  const badgeClass =
    stage.status === 'APPROVED'  ? 'badge-approved'  :
    stage.status === 'SUBMITTED' ? 'badge-submitted' :
    stage.status === 'REJECTED'  ? 'badge-rejected'  : 'badge-draft'

  return (
    <div className="card group hover:bg-s2 hover:border-hl-strong transition-colors duration-150 animate-in">
      <div className="flex items-start gap-4">
        {/* Stage letter */}
        <div className="shrink-0 w-10 h-10 rounded-lg bg-s3 border border-hl flex items-center justify-center">
          <span className="text-card-title font-semibold text-ink-subtle">{meta.letter}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-body-lg font-medium text-ink truncate">
              {t(`stage.${stage.stage}`)}
            </h3>
            <span className={badgeClass}>{t(`stage.status.${stage.status}`)}</span>
          </div>
          <p className="text-caption text-ink-tertiary">
            {t('stage.deadline')}: {stage.deadline ?? meta.deadline}
          </p>

          {stage.adminComment && (
            <p className="mt-2 text-caption text-ink-subtle border-l-2 border-accent pl-3">
              {stage.adminComment}
            </p>
          )}
        </div>

        {/* Score + barrels */}
        <div className="shrink-0 flex items-center gap-4">
          {stage.adminScore !== null && (
            <div className="text-right">
              <div className="text-headline font-semibold text-ink">{stage.adminScore}%</div>
              <div className="text-caption text-ink-subtle">{stage.barrels} бар.</div>
            </div>
          )}
          {stage.barrels > 0 && (
            <div className="barrel">{stage.barrels}</div>
          )}
          <Link
            to={`/dashboard/stage/${slug}`}
            className="btn-secondary text-caption shrink-0"
          >
            Открыть
          </Link>
        </div>
      </div>
    </div>
  )
}
