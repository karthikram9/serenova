
import { SectionHeader } from '@/components/shared/SectionHeader'

const STEPS = [
  {
    step: '01',
    title: 'Choose a Service',
    description: 'Select the type of support that feels right for you.',
  },
  {
    step: '02',
    title: 'Pick a Time Slot',
    description: 'Browse available times and choose what works for your schedule.',
  },
  {
    step: '03',
    title: 'Complete Payment',
    description: 'Simple UPI payment with a screenshot confirmation.',
  },
  {
    step: '04',
    title: 'Receive Your Zoom Link',
    description: 'Once confirmed, you\'ll get your private Zoom link via email.',
  },
]

export function BookingFlow() {
  return (
    <section className="section-padding bg-primary-50">
      <div className="container-main">
        <SectionHeader
          eyebrow="Simple process"
          title="How a session works"
          description="Booking is straightforward, calm, and never overwhelming."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ step, title, description }, index) => (
            <div key={step} className="relative">
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-16px)] w-8 border-t-2 border-dashed border-primary-200 z-0" />
              )}
              <div className="card-surface p-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-600 text-sm font-bold">{step}</span>
                </div>
                <h3 className="font-display text-lg text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
