import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { SpinnerGap } from '@phosphor-icons/react'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Role } from '@/types'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login({ username, password })
      setAuth(data.token, data.role as Role, data.userId)
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch {
      setError(t('auth.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      {/* Subtle radial bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(91,141,238,0.10) 0%, transparent 70%)',
      }} />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Logo + title */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <img src="/KazMunayGas_logo.svg" alt="KMG"
            style={{ height: '48px', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
          <div className="text-center">
            <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: '4px' }}>
              {t('auth.title')}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--ink-tertiary)', fontWeight: 400 }}>
              DMAIC Platform · КазМунайГаз
            </p>
          </div>
        </div>

        {/* shadcn-style card */}
        <div style={{
          background: 'var(--s1)',
          border: '1px solid var(--hl)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.15)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)' }}>
                {t('auth.username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                autoFocus
                placeholder="Введите логин"
                style={{ borderRadius: '12px', height: '42px', fontSize: '14px' }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)' }}>
                {t('auth.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ borderRadius: '12px', height: '42px', fontSize: '14px' }}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: '13px', color: 'var(--danger)',
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: '10px', padding: '10px 14px', fontWeight: 500,
                }}
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '44px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700,
                background: 'var(--accent)', color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 200ms ease, transform 100ms ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--accent)')}
              onMouseDown={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(0.98)')}
              onMouseUp={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
            >
              {loading ? <SpinnerGap size={16} className="animate-spin" /> : null}
              {loading ? t('auth.loading') : t('auth.login')}
            </Button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link to="/"
            style={{ fontSize: '13px', color: 'var(--ink-tertiary)', fontWeight: 500, transition: 'color 150ms' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--ink-subtle)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--ink-tertiary)')}
          >
            ← {t('nav.home')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
