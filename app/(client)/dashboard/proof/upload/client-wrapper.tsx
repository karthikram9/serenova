'use client'

import { PaymentProofUpload } from '@/components/forms/PaymentProofUpload'
import { useRouter } from 'next/navigation'

export function ClientUploadWrapper({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  return (
    <PaymentProofUpload 
      bookingId={bookingId} 
      onSubmitted={() => {
        router.push('/dashboard')
        router.refresh()
      }} 
    />
  )
}
