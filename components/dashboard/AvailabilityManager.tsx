'use client'

import { useState, useTransition } from 'react'
import { addAvailabilityBlock, deleteAvailabilityBlock } from '@/actions/availability'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AvailabilityBlock {
  id: string
  start_at: string
  end_at: string
  is_blocked: boolean
  reason: string | null
}

interface Props {
  blocks: AvailabilityBlock[]
}

export function AvailabilityManager({ blocks }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await addAvailabilityBlock(formData)
      if ('error' in result) {
        setErrorMsg(result.error)
      } else {
        const form = e.target as HTMLFormElement
        form.reset()
      }
    })
  }

  function handleDelete(blockId: string) {
    if (!confirm('Are you sure you want to delete this block?')) return
    setErrorMsg(null)
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('blockId', blockId)
      const result = await deleteAvailabilityBlock(formData)
      if ('error' in result) {
        setErrorMsg(result.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="card-surface p-6 border border-cream-200">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Add Availability Block</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startAt">Start Time</Label>
              <Input
                id="startAt"
                name="startAt"
                type="datetime-local"
                required
                className="bg-white border-cream-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAt">End Time</Label>
              <Input
                id="endAt"
                name="endAt"
                type="datetime-local"
                required
                className="bg-white border-cream-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason / Notes (Optional)</Label>
            <Input
              id="reason"
              name="reason"
              placeholder="e.g. Vacation, Conference..."
              className="bg-white border-cream-300"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isBlocked" 
              name="isBlocked" 
              value="true"
              className="rounded border-cream-300 text-primary-600 focus:ring-primary-500" 
            />
            <Label htmlFor="isBlocked" className="font-normal text-stone-600">
              Mark as Blocked (Unavailable)
            </Label>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</p>
          )}

          <Button type="submit" disabled={isPending} className="bg-primary-600 hover:bg-primary-700 text-white">
            {isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Add Block
          </Button>
        </form>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="p-6 border-b border-cream-100 bg-cream-50">
          <h2 className="text-lg font-semibold text-stone-900">Current Blocks</h2>
        </div>
        
        {blocks.length === 0 ? (
          <div className="p-10 text-center text-stone-400 text-sm">
            No availability blocks configured.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/50">
                  <th className="px-6 py-3 font-medium text-stone-600">Start Time</th>
                  <th className="px-6 py-3 font-medium text-stone-600">End Time</th>
                  <th className="px-6 py-3 font-medium text-stone-600">Status</th>
                  <th className="px-6 py-3 font-medium text-stone-600">Reason</th>
                  <th className="px-6 py-3 font-medium text-stone-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id} className="border-b border-cream-100 hover:bg-cream-50">
                    <td className="px-6 py-4 whitespace-nowrap text-stone-700">{formatDate(block.start_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-700">{formatDate(block.end_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {block.is_blocked ? (
                        <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs">Blocked</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs">Available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-500">{block.reason || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(block.id)}
                        disabled={isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
