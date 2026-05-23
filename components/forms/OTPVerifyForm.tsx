'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { verifyEmailOTP } from '@/actions/auth'
import { Loader2, ArrowLeft } from 'lucide-react'

interface OTPVerifyFormProps {
  email: string
  onBack: () => void
}

export function OTPVerifyForm({ email, onBack }: OTPVerifyFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const code = formData.get('code') as string

    startTransition(async () => {
      const result = await verifyEmailOTP(email, code)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-stone-500">
          We sent a 6-digit verification code to
          <br />
          <span className="font-medium text-stone-800">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifySubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-stone-700 text-sm">
            Verification Code
          </Label>
          <Input
            id="code"
            name="code"
            type="text"
            placeholder="123456"
            required
            maxLength={6}
            autoComplete="one-time-code"
            className="h-12 text-center text-lg tracking-widest border-cream-300 bg-cream-50 focus:border-primary-400 focus:ring-primary-400"
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
            'Verify & Sign In'
          )}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-stone-500 hover:text-stone-700 gap-2"
        onClick={onBack}
        disabled={isPending}
      >
        <ArrowLeft size={16} />
        Use a different email
      </Button>
    </div>
  )
}
