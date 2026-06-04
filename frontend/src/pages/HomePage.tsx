import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Leaderboard from '@/components/Leaderboard'
import DMAICTimeline from '@/components/DMAICTimeline'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { HeroCanvas } from '@/components/ui/hero-canvas'
import { getLeaderboard } from '@/api/leaderboard'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import type { LeaderboardEntry } from '@/types'

const ease = [0.32, 0.72, 0, 1] as const

export default function HomePage() {
  const { t } = useTranslation()
  const { role } = useAuthStore()
  const { theme } = useThemeStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(setEntries).finally(() => setLoading(false))
  }, [])

  const cta = !role
    ? { to: '/login', label: t('home.cta_login') }
    : role === 'PARTICIPANT'
      ? { to: '/dashboard', label: t('home.cta_dashboard') }
      : { to: '/admin', label: t('home.cta_admin') }

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24" style={{ position: 'relative' }}>
        <HeroCanvas />
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease }}
        >
          {/* Logo + DMAIC Platform label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '32px', marginLeft: '-0px' }}>
            <img
              src="/KazMunayGas_logo.svg"
              alt="KazMunayGas"
              style={{
                height: '100px', width: 'auto',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
                opacity: theme === 'dark' ? 0.9 : 1,
                transition: 'filter 0.3s ease',
              }}
            />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
              <span className="eyebrow" style={{ color: 'var(--ink-subtle)' }}>DMAIC Platform</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 800, lineHeight: 1.04,
            letterSpacing: '-0.045em', color: 'var(--ink)',
            marginBottom: '20px', maxWidth: '700px',
          }}>
            <Trans
              i18nKey="home.hero_title"
              components={{ br: <br />, accent: <span style={{ color: 'var(--accent)' }} /> }}
            />
          </h1>

          <p style={{ fontSize: '1.0625rem', color: 'var(--ink-subtle)', maxWidth: '480px', lineHeight: 1.65, marginBottom: '36px', fontWeight: 400 }}>
            {t('home.hero_subtitle')}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link to={cta.to}>
                <motion.span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0px',
                  borderRadius: '9999px', background: 'var(--accent)',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  padding: '11px 20px', overflow: 'hidden', position: 'relative',
                }}>
                  <motion.span
                    variants={{
                      rest: { width: 0, opacity: 0, marginRight: 0 },
                      hover: { width: '18px', opacity: 1, marginRight: '6px' },
                    }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}
                  >
                    <ArrowRight size={14} weight="bold" />
                  </motion.span>
                  {cta.label}
                </motion.span>
              </Link>
            </motion.div>
            <span style={{ fontSize: '13px', color: 'var(--ink-tertiary)', fontWeight: 500 }}>
              {t('home.start_date')}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Leaderboard ───────────────────────────────────────────── */}
      <section id="leaderboard-section" style={{ marginBottom: '40px', scrollMarginTop: '80px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>{t('home.leaderboard_eyebrow')}</p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
            letterSpacing: '-0.04em', color: 'var(--ink)',
            lineHeight: 1.1, marginBottom: '12px',
          }}>
            {t('leaderboard.title')}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink-subtle)', fontWeight: 400, maxWidth: '420px' }}>
            {t('home.leaderboard_sub')}
          </p>
        </div>
        <ContainerScroll>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <motion.div
                style={{ fontSize: '14px', color: 'var(--ink-tertiary)' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('home.loading')}
              </motion.div>
            </div>
          ) : (
            <div style={{ height: '100%', overflowY: 'auto', padding: '4px' }}>
              <Leaderboard entries={entries} />
            </div>
          )}
        </ContainerScroll>
      </section>

      {/* ── DMAIC Timeline ────────────────────────────────────────── */}
      <section style={{ paddingBottom: '80px', scrollMarginTop: '80px' }}>
        <DMAICTimeline />
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </Layout>
  )
}
