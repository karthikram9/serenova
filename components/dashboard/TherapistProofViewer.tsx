'use client'

import { useState, useTransition } from 'react'
import { getPaymentProofSignedUrl } from '@/actions/bookings'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Loader2 } from 'lucide-react'

interface Props {
  proofId: string
  fileName?: string | undefined
}

export function TherapistProofViewer({ proofId, fileName = 'Payment Proof' }: Props) {
  const [open, setOpen] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && !signedUrl && !isPending) {
      loadProof()
    }
  }

  const loadProof = () => {
    setError(null)
    startTransition(async () => {
      const result = await getPaymentProofSignedUrl({ proofId })
      if ('error' in result) {
        setError(result.error)
      } else {
        setSignedUrl(result.url)
      }
    })
  }

  const isPdf = fileName.toLowerCase().endsWith('.pdf')

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <FileText size={14} />
          View Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white border border-cream-200">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-stone-900">Payment Proof</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center min-h-[400px] bg-stone-50 rounded-lg border border-cream-200 overflow-hidden relative">
          {isPending ? (
            <div className="flex flex-col items-center text-stone-400 gap-2">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-sm">Loading secure proof...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : signedUrl ? (
            isPdf ? (
              <iframe
                src={`${signedUrl}#view=FitH`}
                className="w-full h-[600px] border-none"
                title="Payment Proof PDF"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signedUrl}
                alt="Payment Proof"
                className="max-w-full max-h-[600px] object-contain"
              />
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
