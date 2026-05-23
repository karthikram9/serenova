'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MobileMenu } from './MobileMenu'
import { Leaf } from 'lucide-react'

export const NAV_LINKS: { href: Route; label: string }[] = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/approach', label: 'Approach' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-cream-200 shadow-soft'
          : 'bg-transparent'
      )}
    >
      <nav className="container-main flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Serenova home">
          <Leaf
            aria-hidden="true"
            size={22}
            className="text-primary-500 group-hover:text-primary-600 transition-colors"
          />
          <span className="font-display text-xl font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">
            Serenova
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                pathname === href
                  ? 'text-primary-600'
                  : 'text-stone-600'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-800">
              Sign In
            </Button>
          </Link>
          <Link href="/book">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-5">
              Book a Session
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <MobileMenu links={NAV_LINKS} />
      </nav>
    </header>
  )
}
