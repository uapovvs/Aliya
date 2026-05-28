import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? 'text-ink'
      : 'text-ink-subtle hover:text-ink'

  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav — Linear top-nav style */}
      <header className="sticky top-0 z-40 border-b border-hl bg-canvas/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/KazMunayGas_logo.svg" alt="KMG" className="h-6 brightness-0 invert opacity-90" />
            <span className="text-body text-ink-subtle hidden sm:block select-none">
              DMAIC
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-body">
            <Link to="/" className={`px-3 py-1.5 rounded-md transition-colors ${isActive('/') && location.pathname === '/' ? 'text-ink' : 'text-ink-subtle hover:text-ink'}`}>
              {t('nav.home')}
            </Link>
            {role === 'PARTICIPANT' && (
              <Link to="/dashboard" className={`px-3 py-1.5 rounded-md transition-colors ${isActive('/dashboard')}`}>
                {t('nav.dashboard')}
              </Link>
            )}
            {role === 'ADMIN' && (
              <Link to="/admin" className={`px-3 py-1.5 rounded-md transition-colors ${isActive('/admin')}`}>
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 text-caption text-ink-subtle border border-hl rounded-md hover:text-ink hover:border-hl-strong transition-colors"
            >
              {i18n.language === 'ru' ? 'ҚАЗ' : 'РУС'}
            </button>
            {role ? (
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="btn-ghost text-caption px-2.5 py-1"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-caption px-3 py-1.5">
                {t('auth.login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
