import { LockKeyhole } from 'lucide-react'

export function PrivacyBadge() {
  return (
    <section className="bg-white py-12">
      <div className="container-main">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream-100">
            <LockKeyhole aria-hidden="true" size={20} className="text-stone-500" />
          </div>
          <h3 className="mb-2 font-medium text-stone-800">
            Your privacy is non-negotiable
          </h3>
          <p className="text-sm leading-relaxed text-stone-500">
            Personal information is used only to support care, scheduling,
            payment confirmation, and essential communication.
          </p>
        </div>
      </div>
    </section>
  )
}
