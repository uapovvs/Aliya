import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle, Clock, PaperPlaneTilt, XCircle, NotePencil } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StageResponse } from '@/types'

const STAGE_META: Record<string, { label: string; deadline: string; letter: string }> = {
  D:   { label: 'Define',          deadline: '30.06.2026', letter: 'D' },
  M_A: { label: 'Measure+Analyze', deadline: '30.08.2026', letter: 'M/A' },
  I:   { label: 'Improve',         deadline: '30.11.2026', letter: 'I' },
  C:   { label: 'Control',         deadline: '20.12.2026', letter: 'C' },
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  DRAFT:     <NotePencil weight="regular" size={11} />,
  SUBMITTED: <PaperPlaneTilt weight="fill" size={11} />,
  APPROVED:  <CheckCircle weight="fill" size={11} />,
  REJECTED:  <XCircle weight="fill" size={11} />,
}

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT:     'draft',
  SUBMITTED: 'submitted',
  APPROVED:  'approved',
  REJECTED:  'rejected',
}

interface Props { stage: StageResponse; index?: number }

export default function StageCard({ stage, index = 0 }: Props) {
  const { t } = useTranslation()
  const meta = STAGE_META[stage.stage]
  const slug = stage.stage.toLowerCase().replace('_', '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{ y: -1 }}
    >
      <Card className="group hover:bg-s2 hover:border-hl-strong transition-colors duration-150 p-6">
        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            {/* Stage letter badge — double-bezel */}
            <div className="shrink-0 w-11 h-11 rounded-lg bg-s2 border border-hl-strong flex items-center justify-center ring-1 ring-hl/40 ring-offset-1 ring-offset-s1">
              <span className="text-sm font-semibold text-ink-subtle leading-none">{meta.letter}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-body font-medium text-ink truncate">{t(`stage.${stage.stage}`)}</h3>
                <Badge variant={STATUS_VARIANT[stage.status]} className="flex items-center gap-1 shrink-0">
                  {STATUS_ICON[stage.status]}
                  {t(`stage.status.${stage.status}`)}
                </Badge>
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
                  <div className="barrel text-xs w-7 h-7 mt-1">{stage.barrels}</div>
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
