import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

  const FIELD_LABELS: Record<keyof typeof form, string> = {
    fullName: 'Полное имя',
    username: 'Логин',
    password: 'Пароль',
    position: 'Должность',
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-hl animate-in">
        <div>
          <p className="eyebrow mb-1">{t('nav.admin')}</p>
          <h1 className="text-headline text-ink">{users.length} участников</h1>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? 'Отмена' : `+ ${t('admin.createUser')}`}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="card mb-8 max-w-md animate-in"
        >
          <p className="text-card-title text-ink mb-5">{t('admin.createUser')}</p>
          <div className="space-y-4">
            {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
              <div key={key}>
                <label className="block text-caption text-ink-subtle mb-1.5">
                  {FIELD_LABELS[key]}
                  {key !== 'position' && <span className="text-danger ml-0.5">*</span>}
                </label>
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
          {error && (
            <p className="mt-3 text-caption text-danger border border-danger/20 bg-danger/5 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 mt-5 pt-5 border-t border-hl">
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Создать'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Users table */}
      <div className="card-panel overflow-hidden p-0 animate-in">
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
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-s2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-hl" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-s3 border border-hl flex items-center justify-center text-caption font-semibold text-ink-subtle">
                          {u.fullName.charAt(0)}
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
                    <Link to={`/admin/review/${u.id}`} className="btn-secondary text-caption">
                      {t('admin.review')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
