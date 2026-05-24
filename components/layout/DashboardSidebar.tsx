/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/actions/auth'
import { 
  CalendarDays, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Clock,
  Settings
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  user: {
    full_name: string
    avatar_url: string | null
    email: string
  }
  role: 'client' | 'therapist'
}

export function DashboardSidebar({ user, role }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // Close sidebar on escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close sidebar when route changes
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [pathname])

  const clientLinks = [
    { label: 'Upcoming Sessions', href: '/dashboard', icon: CalendarDays },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
  ]

  const therapistLinks = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Bookings', href: '/dashboard/admin/bookings', icon: CalendarDays },
    { label: 'Availability', href: '/dashboard/admin/availability', icon: Clock },
    { label: 'Clients', href: '/dashboard/admin/clients', icon: User },
    { label: 'Messages', href: '/dashboard/admin/messages', icon: MessageCircle },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ]

  const links = role === 'client' ? clientLinks : therapistLinks
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  async function handleSignOut(e: React.FormEvent) {
    e.preventDefault()
    await signOut()
    router.push('/')
  }

  return (
    <>
      {/* Mobile Hamburger Toggle Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-cream-200 fixed top-0 left-0 right-0 z-40 w-full">
        <span className="text-primary-700 font-display text-lg font-semibold tracking-wide flex items-center gap-2">
          🌿 Serenova
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-stone-600 hover:text-primary-700 hover:bg-cream-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-expanded={isOpen}
          aria-label="Open side menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Backdrop for Mobile Slide Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-45 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        ref={sidebarRef}
        className={cn(
          "w-64 bg-white border-r border-cream-200 flex flex-col fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header Area */}
        <div className="px-6 py-6 md:py-8 flex items-center justify-between border-b border-cream-100 bg-cream-50/50">
          <Link href={"/dashboard" as any} className="text-primary-700 font-display text-xl font-semibold tracking-wide flex items-center gap-2">
            🌿 Serenova
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-stone-400 hover:text-stone-700 hover:bg-cream-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close side menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Sidebar Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-primary-500",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-stone-600 hover:text-primary-700 hover:bg-cream-50/60"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary-600" : "text-stone-400 group-hover:text-primary-600"
                  )}
                />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer / User Profile Area */}
        <div className="p-4 border-t border-cream-100 bg-cream-50/20">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <Avatar className="h-10 w-10 border border-primary-100 shadow-sm">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.full_name} referrerPolicy="no-referrer" />
              ) : null}
              <AvatarFallback className="bg-primary-50 text-primary-700 font-semibold text-xs leading-none">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate leading-tight font-display">
                {user.full_name}
              </p>
              <p className="text-xs text-stone-400 truncate leading-tight mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSignOut} className="mt-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-warm-600 hover:text-red-600 hover:bg-red-50/50 border border-warm-100 hover:border-red-100 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Layout offset spacing helper for mobile views */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  )
}
