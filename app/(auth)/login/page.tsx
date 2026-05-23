import { Metadata } from 'next'
import { LoginForm } from '@/components/forms/LoginForm'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Leaf size={24} />
            <span className="font-display text-2xl font-semibold text-stone-800">
              Serenova
            </span>
          </Link>
          <p className="text-stone-500 text-sm mt-2">
            A safe space begins here
          </p>
        </div>

        {/* Card */}
        <div className="card-surface p-8">
          <h1 className="font-display text-2xl text-stone-800 mb-2">
            Welcome back
          </h1>
          <p className="text-stone-500 text-sm mb-8">
            Sign in to continue your journey
          </p>
          <LoginForm />
        </div>

        {/* Back to site */}
        <p className="text-center text-stone-400 text-sm mt-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
