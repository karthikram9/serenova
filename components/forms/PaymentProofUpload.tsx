'use client'

import { useRef, useState, useTransition } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { submitPaymentProof } from '@/actions/bookings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PaymentProofUploadProps {
  bookingId: string
  onSubmitted: () => void
}

export function PaymentProofUpload({ bookingId, onSubmitted }: PaymentProofUploadProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    const formData = new FormData(event.currentTarget)
    formData.set('bookingId', bookingId)

    startTransition(async () => {
      const result = await submitPaymentProof(formData)
      if ('error' in result) {
        setMessage(result.error)
        return
      }
      formRef.current?.reset()
      onSubmitted()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="space-y-2">
        <Label htmlFor="upiRef">UPI reference ID</Label>
        <Input
          id="upiRef"
          name="upiRef"
          maxLength={100}
          placeholder="Optional transaction reference"
          className="border-cream-300 bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">Payment proof</Label>
        <Input
          id="file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="border-cream-300 bg-white"
        />
        <p className="text-xs text-stone-500">
          JPG, PNG, WebP, or PDF. Maximum size: 5MB.
        </p>
      </div>
      {message ? (
        <p className="rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-500">
          {message}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary-600 text-white hover:bg-primary-700"
      >
        {isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Upload aria-hidden="true" />}
        Submit payment proof
      </Button>
    </form>
  )
}
