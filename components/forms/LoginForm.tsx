'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { signInWithGoogle, signInWithEmailOTP } from '@/actions/auth'
import { OTPVerifyForm } from '@/components/forms/OTPVerifyForm'
import { Globe, Loader2, Mail } from 'lucide-react'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    startTransition(async () => {
      const result = await signInWithEmailOTP(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSentEmail(email)
        setEmailSent(true)
      }
    })
  }

  if (emailSent) {
    return <OTPVerifyForm email={sentEmail} onBack={() => setEmailSent(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3 h-12 border-cream-300 hover:bg-cream-50 text-stone-700"
        onClick={() => startTransition(() => { signInWithGoogle() })}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Globe size={18} />
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <Separator className="bg-cream-200" />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-stone-400 text-xs">
          or continue with email
        </span>
      </div>

      {/* Email OTP Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-stone-700 text-sm">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="h-12 border-cream-300 bg-cream-50 focus:border-primary-400 focus:ring-primary-400"
          />
        </div>

        {error && (
          <p className="text-warm-500 text-sm bg-warm-50 border border-warm-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Mail size={18} />
          )}
          Send Sign-In Code
        </Button>
      </form>

      <p className="text-center text-stone-400 text-xs leading-relaxed">
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline hover:text-primary-600">Terms</a>
        {' '}and{' '}
        <a href="/privacy" className="underline hover:text-primary-600">Privacy Policy</a>.
        Your information is always kept confidential.
      </p>
    </div>
  )
}
