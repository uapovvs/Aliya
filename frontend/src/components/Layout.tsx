import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  House, Gauge, ShieldCheck, SignOut, Globe,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const { role, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const toggleLang = () => {
    const next = i18n.language === 'ru' ? 'kz' : 'ru'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const active = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <div className="min-h-screen bg-canvas">
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 border-b border-hl bg-canvas/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/KazMunayGas_logo.svg" alt="KMG" className="h-6 brightness-0 invert opacity-80" />
            <span className="text-body text-ink-subtle hidden sm:block select-none tracking-wide">
              DMAIC
            </span>
          </Link>

          <nav className="flex items-center gap-0.5 text-body">
            {[
              { to: '/', icon: <House weight="regular" size={15} />, label: t('nav.home') },
              role === 'PARTICIPANT' && { to: '/dashboard', icon: <Gauge weight="regular" size={15} />, label: t('nav.dashboard') },
              role === 'ADMIN' && { to: '/admin', icon: <ShieldCheck weight="regular" size={15} />, label: t('nav.admin') },
            ].filter(Boolean).map((item: any) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors duration-150 ${
                  active(item.to)
                    ? 'text-ink bg-s1'
                    : 'text-ink-subtle hover:text-ink hover:bg-s1/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1 text-caption text-ink-subtle border border-hl rounded-md hover:text-ink hover:border-hl-strong transition-colors"
            >
              <Globe size={12} />
              {i18n.language === 'ru' ? 'ҚАЗ' : 'РУС'}
            </button>
            {role ? (
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-caption text-ink-subtle hover:text-danger transition-colors"
              >
                <SignOut size={13} />
                {t('nav.logout')}
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-caption px-3 py-1.5">
                {t('auth.login')}
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
