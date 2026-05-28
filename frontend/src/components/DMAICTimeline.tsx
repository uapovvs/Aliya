import { useTranslation } from 'react-i18next'
import { Target, BarChart2, Zap, CheckCircle2 } from 'lucide-react'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

const DMAIC_DATA = [
  {
    id: 1,
    title: 'D — Define',
    date: '30.06.2026',
    content: 'Определение проблемы и целей проекта. Составление устава проекта, карты процесса и голоса клиента (VOC).',
    category: 'Define',
    icon: Target,
    relatedIds: [2],
    status: 'in-progress' as const,
    energy: 65,
  },
  {
    id: 2,
    title: 'M/A — Measure',
    date: '30.08.2026',
    content: 'Сбор и анализ данных. Измерение текущего состояния процесса, выявление коренных причин отклонений.',
    category: 'Measure',
    icon: BarChart2,
    relatedIds: [1, 3],
    status: 'pending' as const,
    energy: 30,
  },
  {
    id: 3,
    title: 'I — Improve',
    date: '30.11.2026',
    content: 'Разработка и внедрение решений. Оптимизация процесса на основе данных анализа, пилотное тестирование.',
    category: 'Improve',
    icon: Zap,
    relatedIds: [2, 4],
    status: 'pending' as const,
    energy: 15,
  },
  {
    id: 4,
    title: 'C — Control',
    date: '20.12.2026',
    content: 'Контроль и закрепление результатов. Разработка плана управления, документирование улучшений.',
    category: 'Control',
    icon: CheckCircle2,
    relatedIds: [3],
    status: 'pending' as const,
    energy: 5,
  },
]

export default function DMAICTimeline() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Section header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="eyebrow" style={{ marginBottom: '8px' }}>
          {t('timeline.section_label')}
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: '8px',
        }}>
          {t('timeline.section_title')}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-tertiary)', fontWeight: 400 }}>
          Нажмите на узел, чтобы узнать подробности этапа
        </p>
      </div>

      {/* Radial orbital timeline */}
      <div style={{ height: '600px' }}>
        <RadialOrbitalTimeline timelineData={DMAIC_DATA} />
      </div>
    </div>
  )
}
