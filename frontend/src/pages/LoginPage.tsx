import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
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
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      {/* Ambient glow — taste-skill subtle depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,106,210,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/KazMunayGas_logo.svg" alt="KMG" className="h-8 mx-auto brightness-0 invert opacity-80 mb-6" />
          <h1 className="text-headline text-ink mb-1">{t('auth.title')}</h1>
          <p className="text-caption text-ink-tertiary">DMAIC Platform · КазМунайГаз</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-caption text-ink-subtle mb-1.5">{t('auth.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
              autoComplete="username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-caption text-ink-subtle mb-1.5">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-caption text-danger border border-danger/20 bg-danger/5 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : t('auth.login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-caption text-ink-tertiary hover:text-ink-subtle transition-colors">
            ← {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
