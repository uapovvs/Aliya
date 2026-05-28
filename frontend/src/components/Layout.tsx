import { MiniNavbar } from '@/components/ui/mini-navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <MiniNavbar />
      <main className="max-w-6xl mx-auto px-6 py-6 pt-24">
        {children}
      </main>
    </div>
  )
}
