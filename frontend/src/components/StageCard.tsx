import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle, Clock, PaperPlaneTilt, XCircle, NotePencil } from '@phosphor-icons/react'
import type { StageResponse } from '@/types'

const STAGE_META: Record<string, { label: string; deadline: string }> = {
  D:   { label: 'Define',          deadline: '30.06.2026' },
  M_A: { label: 'Measure+Analyze', deadline: '30.08.2026' },
  I:   { label: 'Improve',         deadline: '30.11.2026' },
  C:   { label: 'Control',         deadline: '20.12.2026' },
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  DRAFT:     <NotePencil weight="regular" size={13} />,
  SUBMITTED: <PaperPlaneTilt weight="fill" size={13} />,
  APPROVED:  <CheckCircle weight="fill" size={13} />,
  REJECTED:  <XCircle weight="fill" size={13} />,
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     'bg-s2 text-ink-subtle',
  SUBMITTED: 'bg-accent/15 text-accent',
  APPROVED:  'bg-success/15 text-success',
  REJECTED:  'bg-danger/15 text-danger',
}

interface Props { stage: StageResponse; index?: number }

export default function StageCard({ stage, index = 0 }: Props) {
  const { t } = useTranslation()
  const meta = STAGE_META[stage.stage]
  const slug = stage.stage.toLowerCase().replace('_', '')

  return (
    <motion.div
      className="card group hover:bg-s2 hover:border-hl-strong transition-colors duration-150"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{ y: -1 }}
    >
      <div className="flex items-center gap-4">
        {/* Letter badge */}
        <div className="shrink-0 w-10 h-10 rounded-lg bg-s3 border border-hl flex items-center justify-center">
          <span className="text-base font-semibold text-ink-subtle">{meta.label[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-body font-medium text-ink truncate">{t(`stage.${stage.stage}`)}</h3>
            <span className={`badge ${STATUS_COLOR[stage.status]} flex items-center gap-1`}>
              {STATUS_ICON[stage.status]}
              {t(`stage.status.${stage.status}`)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-caption text-ink-tertiary">
            <Clock weight="regular" size={11} />
            <span>{t('stage.deadline')}: {stage.deadline ?? meta.deadline}</span>
          </div>
          {stage.adminComment && (
            <p className="mt-2 text-caption text-ink-subtle border-l-2 border-accent pl-3 line-clamp-1">
              {stage.adminComment}
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-4">
          {stage.adminScore !== null && (
            <div className="text-right">
              <div className="text-xl font-semibold text-ink" style={{ letterSpacing: '-0.02em' }}>
                {stage.adminScore}%
              </div>
              <div className="barrel text-xs w-7 h-7">{stage.barrels}</div>
            </div>
          )}
          <Link
            to={`/dashboard/stage/${slug}`}
            className="btn-secondary text-caption flex items-center gap-1.5 group-hover:border-hl-strong"
          >
            Открыть
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
