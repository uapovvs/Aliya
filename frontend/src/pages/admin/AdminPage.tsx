import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, ArrowRight, User, SpinnerGap } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import { getAllUsers, createUser } from '@/api/admin'
import type { UserProfile } from '@/types'

export default function AdminPage() {
  const { t } = useTranslation()
  const [users, setUsers]       = useState<UserProfile[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ username: '', password: '', fullName: '', position: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => { getAllUsers().then(setUsers) }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const user = await createUser(form)
      setUsers((p) => [...p, user])
      setShowForm(false)
      setForm({ username: '', password: '', fullName: '', position: '' })
    } catch {
      setError('Ошибка при создании участника')
    } finally {
      setCreating(false)
    }
  }

  const LABELS: Record<keyof typeof form, string> = {
    fullName: 'Полное имя *',
    username: 'Логин *',
    password: 'Пароль *',
    position: 'Должность',
  }

  return (
    <Layout>
      <motion.div
        className="flex items-center justify-between mb-8 pb-6 border-b border-hl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="eyebrow mb-1">{t('nav.admin')}</p>
          <h1 className="text-headline text-ink">{users.length} участников</h1>
        </div>
        <motion.button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} />
          {showForm ? 'Отмена' : t('admin.createUser')}
        </motion.button>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleCreate}
            className="card mb-8 max-w-md"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-card-title text-ink mb-5">{t('admin.createUser')}</p>
            <div className="space-y-4">
              {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
                <div key={key}>
                  <label className="block text-caption text-ink-subtle mb-1.5">{LABELS[key]}</label>
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="input"
                    required={key !== 'position'}
                  />
                </div>
              ))}
            </div>
            {error && <p className="mt-3 text-caption text-danger">{error}</p>}
            <div className="flex gap-3 mt-5 pt-5 border-t border-hl">
              <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
                {creating ? <SpinnerGap size={14} className="animate-spin" /> : 'Создать'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Отмена</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Users table */}
      <motion.div
        className="card-panel overflow-hidden p-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {users.length === 0 ? (
          <div className="py-16 text-center text-ink-tertiary text-body">
            Нет участников. Создайте первого.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-hl">
                <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary">Участник</th>
                <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary hidden sm:table-cell">Логин</th>
                <th className="px-6 py-3 text-left text-eyebrow uppercase text-ink-tertiary hidden md:table-cell">Должность</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-hl">
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  className="hover:bg-s2 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-hl" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-s3 border border-hl flex items-center justify-center">
                          <User size={14} className="text-ink-subtle" />
                        </div>
                      )}
                      <span className="text-body font-medium text-ink">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <code className="text-caption text-ink-subtle font-mono">{u.username}</code>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-caption text-ink-tertiary">
                    {u.position ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/review/${u.id}`} className="btn-secondary text-caption flex items-center gap-1.5 ml-auto w-fit">
                      {t('admin.review')} <ArrowRight size={12} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </Layout>
  )
}

