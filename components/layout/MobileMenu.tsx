'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileMenuProps {
  links: { href: Route; label: string }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu aria-hidden="true" size={24} className="text-stone-800" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-cream-200">
            <span className="font-display text-xl font-semibold text-stone-800">
              Serenova
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close navigation menu"
              onClick={() => setIsOpen(false)}
            >
              <X aria-hidden="true" size={24} className="text-stone-800" />
            </Button>
          </div>

          <nav className="flex flex-col px-6 py-8 gap-6" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-6 flex flex-col gap-3">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-stone-600">
                Sign In
              </Button>
            </Link>
            <Link href="/book" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
