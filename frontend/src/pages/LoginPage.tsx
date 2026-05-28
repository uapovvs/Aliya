import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { User, Lock, ArrowRight, SpinnerGap } from '@phosphor-icons/react'
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
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(94,106,210,0.07) 0%, transparent 70%)' }}
      />

      <motion.div
        className="w-full max-w-sm relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-10">
          <motion.img
            src="/KazMunayGas_logo.svg"
            alt="KMG"
            className="h-9 mx-auto brightness-0 invert opacity-80 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <h1 className="text-headline text-ink mb-1">{t('auth.title')}</h1>
          <p className="text-caption text-ink-tertiary">DMAIC Platform · КазМунайГаз</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {/* Username */}
          <div>
            <label className="block text-caption text-ink-subtle mb-1.5">{t('auth.username')}</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-8"
                required
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-caption text-ink-subtle mb-1.5">{t('auth.password')}</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-8"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <motion.p
              className="text-caption text-danger border border-danger/20 bg-danger/5 rounded-md px-3 py-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center gap-2 mt-1"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <SpinnerGap size={15} className="animate-spin" />
            ) : (
              <>
                {t('auth.login')}
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-caption text-ink-tertiary hover:text-ink-subtle transition-colors">
            ← {t('nav.home')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
