import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const { role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleLang = () => {
    const next = i18n.language === 'ru' ? 'kz' : 'ru'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-kmg text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/KazMunayGas_logo.svg" alt="KMG" className="h-8 brightness-0 invert" />
            <span className="font-semibold text-lg hidden sm:block">DMAIC Platform</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="hover:text-amber-300 transition-colors">{t('nav.home')}</Link>
            {role === 'PARTICIPANT' && (
              <Link to="/dashboard" className="hover:text-amber-300 transition-colors">{t('nav.dashboard')}</Link>
            )}
            {role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-amber-300 transition-colors">{t('nav.admin')}</Link>
            )}
            <button onClick={toggleLang} className="px-2 py-1 border border-white/30 rounded text-xs hover:bg-white/10">
              {i18n.language === 'ru' ? 'ҚАЗ' : 'РУС'}
            </button>
            {role && (
              <button onClick={handleLogout} className="hover:text-red-300 transition-colors">
                {t('nav.logout')}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
