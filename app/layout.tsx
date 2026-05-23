import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from '@/components/ui/toaster'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Serenova - Online Therapy & Relationship Counseling',
    template: '%s | Serenova',
  },
  description:
    'A safe, private space for mental health support and relationship counseling. Book an online session with a qualified therapist.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Serenova',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="grain-overlay antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
