import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Plus, SpinnerGap, DotsThreeVertical, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { getAllUsers, createUser } from '@/api/admin'
import type { UserProfile } from '@/types'

type RoleFilter = 'ALL' | 'PARTICIPANT' | 'ADMIN'

export default function AdminPage() {
  const { t } = useTranslation()
  const [users, setUsers]             = useState<UserProfile[]>([])
  const [selected, setSelected]       = useState<Set<number>>(new Set())
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState<RoleFilter>('ALL')
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState({ username: '', password: '', fullName: '', position: '' })
  const [creating, setCreating]       = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => { getAllUsers().then(setUsers) }, [])

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
      if (search && !`${u.fullName} ${u.username}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [users, search, roleFilter])

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(filtered.map((u) => u.id)) : new Set())
  }

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

  const ROLE_LABELS: Record<RoleFilter, string> = {
    ALL: 'Все роли',
    PARTICIPANT: 'Участники',
    ADMIN: 'Администраторы',
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
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={14} />
          {t('admin.createUser')}
        </Button>
      </motion.div>

      {/* Create user dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.createUser')}</DialogTitle>
            <DialogDescription>Новый участник получит доступ к платформе</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-2">
              {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`field-${key}`}>{LABELS[key]}</Label>
                  <Input
                    id={`field-${key}`}
                    type={key === 'password' ? 'password' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    required={key !== 'position'}
                  />
                </div>
              ))}
              {error && <p className="text-caption text-danger">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? <SpinnerGap size={14} className="animate-spin" /> : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Flexi Filter Table */}
      <motion.div
        className="bg-s1 border border-hl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Filters bar */}
        <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center border-b border-hl">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <Input
              placeholder="Поиск по имени или логину…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="shrink-0">
                {ROLE_LABELS[roleFilter]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {(['ALL', 'PARTICIPANT', 'ADMIN'] as RoleFilter[]).map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRoleFilter(r)}>
                  {ROLE_LABELS[r]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selected.size > 0 && (
            <span className="text-caption text-ink-subtle ml-auto">
              {selected.size} выбрано
            </span>
          )}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-tertiary text-body">
            {users.length === 0 ? 'Нет участников. Создайте первого.' : 'Ничего не найдено.'}
          </div>
        ) : (
          <div className="max-h-[560px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-s1 z-10">
                <TableRow className="hover:bg-transparent border-hl">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onCheckedChange={(checked) => toggleAll(!!checked)}
                    />
                  </TableHead>
                  <TableHead className="text-eyebrow uppercase">Участник</TableHead>
                  <TableHead className="text-eyebrow uppercase hidden sm:table-cell">Логин</TableHead>
                  <TableHead className="text-eyebrow uppercase hidden md:table-cell">Должность</TableHead>
                  <TableHead className="text-eyebrow uppercase">Роль</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    className="border-b border-hl transition-colors hover:bg-s2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.has(u.id)}
                        onCheckedChange={() => toggleRow(u.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-hl shrink-0">
                          <AvatarImage src={u.avatarUrl ?? ''} alt={u.fullName} />
                          <AvatarFallback>
                            {u.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-body font-medium text-ink">{u.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <code className="text-caption text-ink-subtle font-mono">{u.username}</code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-caption text-ink-tertiary">
                      {u.position ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'ADMIN' ? 'approved' : 'default'}>
                        {u.role === 'ADMIN' ? 'Админ' : 'Участник'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <DotsThreeVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/review/${u.id}`} className="flex items-center gap-2">
                              <ArrowRight size={12} />
                              {t('admin.review')}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-hl text-caption text-ink-tertiary">
            Показано {filtered.length} из {users.length}
          </div>
        )}
      </motion.div>
    </Layout>
  )
}
