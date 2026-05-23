import Link from 'next/link'
import type { Route } from 'next'
import { Leaf } from 'lucide-react'

const FOOTER_NAV: { href: Route; label: string }[] = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/approach', label: 'Approach' },
  { href: '/book', label: 'Book Session' },
  { href: '/contact', label: 'Contact' },
]

const LEGAL_NAV: { href: Route; label: string }[] = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Serenova home">
              <Leaf aria-hidden="true" size={20} className="text-primary-400" />
              <span className="font-display text-xl text-white">Serenova</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              A compassionate space for mental health support and relationship
              counseling. Your privacy and wellbeing are always our first priority.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {LEGAL_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">
            © {new Date().getFullYear()} Serenova. All rights reserved.
          </p>
          <p className="text-stone-500 text-xs italic">
            &quot;Healing is not linear — and that&apos;s perfectly okay.&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}
