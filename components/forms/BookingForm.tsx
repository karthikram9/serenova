'use client'

import { useMemo, useState, useTransition } from 'react'
import { CalendarCheck, Loader2 } from 'lucide-react'
import { createBooking } from '@/actions/bookings'
import { SERVICES } from '@/content/services'
import { SESSION_TYPE_LABELS, type SessionType } from '@/types/booking'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BookingFormProps {
  onCreated: (bookingId: string) => void
}

export function BookingForm({ onCreated }: BookingFormProps) {
  const [service, setService] = useState<SessionType>('individual_therapy')
  const [scheduledAt, setScheduledAt] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const idempotencyKey = useMemo(() => crypto.randomUUID(), [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    const normalized = toKolkataInstant(scheduledAt)
    if (!normalized) {
      setMessage('Choose a valid session date and time.')
      return
    }

    const formData = new FormData(event.currentTarget)
    formData.set('sessionType', service)
    formData.set('scheduledAt', normalized)
    formData.set('idempotencyKey', idempotencyKey)

    startTransition(async () => {
      const result = await createBooking(formData)
      if ('error' in result) {
        setMessage(result.error)
        return
      }
      onCreated(result.bookingId)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-800">Choose support</legend>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {SERVICES.map((item) => (
            <label
              key={item.id}
              className="cursor-pointer rounded-lg border border-cream-200 bg-white p-4 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
            >
              <input
                type="radio"
                name="serviceChoice"
                value={item.sessionType}
                checked={service === item.sessionType}
                onChange={() => setService(item.sessionType)}
                className="sr-only"
              />
              <span className="block text-sm font-medium text-stone-900">
                {item.title}
              </span>
              <span className="mt-1 block text-xs text-stone-500">{item.tagline}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Preferred session time</Label>
        <input
          id="scheduledAt"
          type="datetime-local"
          required
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
          className="flex h-11 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 md:text-sm"
        />
        <p className="text-xs text-stone-500">
          Times are interpreted in Asia/Kolkata and stored as UTC.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientNotes">Anything you want to share first?</Label>
        <Textarea
          id="clientNotes"
          name="clientNotes"
          maxLength={500}
          placeholder="Optional. Share only what feels comfortable."
          className="min-h-28 border-cream-300 bg-white"
        />
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
        {isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : <CalendarCheck aria-hidden="true" />}
        Request {SESSION_TYPE_LABELS[service]}
      </Button>
    </form>
  )
}

function toKolkataInstant(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const [, year, month, day, hour, minute] = match
  const utcMs = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ) - 330 * 60 * 1000
  return new Date(utcMs).toISOString()
}
