'use client'

import { useState } from 'react'
import { CheckCircle2, IndianRupee, LockKeyhole } from 'lucide-react'
import { BookingForm } from '@/components/forms/BookingForm'
import { PaymentProofUpload } from '@/components/forms/PaymentProofUpload'

type BookingStep = 'request' | 'payment' | 'submitted'

export function BookingPageContent() {
  const [step, setStep] = useState<BookingStep>('request')
  const [bookingId, setBookingId] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 grid grid-cols-3 gap-2 text-center text-xs text-stone-500">
        {['Request', 'Payment', 'Review'].map((label, index) => (
          <div
            key={label}
            className="rounded-full border border-cream-200 bg-white px-3 py-2"
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-cream-200 bg-cream-50 p-5 md:p-8">
        {step === 'request' ? (
          <BookingForm
            onCreated={(id) => {
              setBookingId(id)
              setStep('payment')
            }}
          />
        ) : null}

        {step === 'payment' && bookingId ? (
          <div className="space-y-6">
            <PaymentInstructions bookingId={bookingId} />
            <PaymentProofUpload
              bookingId={bookingId}
              onSubmitted={() => setStep('submitted')}
            />
          </div>
        ) : null}

        {step === 'submitted' ? (
          <div className="text-center">
            <CheckCircle2
              aria-hidden="true"
              className="mx-auto mb-5 h-12 w-12 text-primary-600"
            />
            <h2 className="mb-3 font-display text-2xl text-stone-900">
              Payment proof submitted
            </h2>
            <p className="mx-auto max-w-md text-stone-600">
              Your booking is now waiting for therapist review. Once payment is
              verified, the session can be confirmed with private meeting details.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PaymentInstructions({ bookingId }: { bookingId: string }) {
  return (
    <section className="rounded-lg border border-primary-100 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
          <IndianRupee aria-hidden="true" className="text-primary-600" />
        </div>
        <div>
          <h2 className="font-display text-xl text-stone-900">
            Complete UPI payment
          </h2>
          <p className="text-xs text-stone-500">Booking ID: {bookingId}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-md bg-cream-50 p-4">
        <LockKeyhole aria-hidden="true" className="mt-0.5 text-stone-500" />
        <p className="text-sm leading-relaxed text-stone-600">
          Pay using the therapist-provided UPI details, then upload a screenshot
          or PDF receipt. Payment proof stays private and is reviewed before
          confirmation.
        </p>
      </div>
    </section>
  )
}
