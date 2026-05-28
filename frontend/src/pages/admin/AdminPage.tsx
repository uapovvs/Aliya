import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout'
import { getAllUsers, createUser } from '@/api/admin'
import type { UserProfile } from '@/types'

export default function AdminPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', fullName: '', position: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => { getAllUsers().then(setUsers) }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const newUser = await createUser(form)
      setUsers((prev) => [...prev, newUser])
      setShowForm(false)
      setForm({ username: '', password: '', fullName: '', position: '' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('nav.admin')}</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          + {t('admin.createUser')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4 max-w-md">
          {(['username', 'password', 'fullName', 'position'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                value={form[field]}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kmg"
                required={field !== 'position'}
              />
            </div>
          ))}
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? '...' : t('admin.createUser')}
          </button>
        </form>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Участник</th>
              <th className="px-6 py-3 text-left">Логин</th>
              <th className="px-6 py-3 text-left">Должность</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{u.fullName}</td>
                <td className="px-6 py-4 text-gray-500">{u.username}</td>
                <td className="px-6 py-4 text-gray-500">{u.position ?? '—'}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/admin/review/${u.id}`} className="btn-primary text-xs">
                    {t('admin.review')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
