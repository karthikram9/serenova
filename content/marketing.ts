import {
  CalendarCheck,
  Heart,
  HeartHandshake,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'

export const CARE_VALUES = [
  {
    icon: Shield,
    title: 'Privacy first',
    description:
      'Your identity, session details, and communication are handled with care and minimum necessary access.',
  },
  {
    icon: HeartHandshake,
    title: 'Human pace',
    description:
      'Sessions and messages are designed to feel steady, respectful, and never rushed.',
  },
  {
    icon: Sparkles,
    title: 'Practical clarity',
    description:
      'The work focuses on understanding patterns and choosing next steps that feel realistic.',
  },
]

export const APPROACH_STEPS = [
  {
    title: 'Listen before guiding',
    description:
      'The first priority is understanding what you are carrying, in your words and at your pace.',
  },
  {
    title: 'Name the pattern',
    description:
      'Together, sessions look for emotional loops, relationship habits, and stress signals that can be worked with.',
  },
  {
    title: 'Choose small next steps',
    description:
      'Support stays practical, with grounded reflections and actions you can return to between sessions.',
  },
]

export const BOOKING_STEPS = [
  {
    icon: Heart,
    title: 'Choose support',
    description: 'Select the service that best matches what you are facing right now.',
  },
  {
    icon: CalendarCheck,
    title: 'Request a time',
    description: 'Use the booking page to start the session request and share essential context.',
  },
  {
    icon: Lock,
    title: 'Confirm payment',
    description: 'Phase 1 uses UPI payment confirmation before a session is approved.',
  },
  {
    icon: MessageCircle,
    title: 'Receive details',
    description: 'After review, confirmed sessions receive private meeting information by email.',
  },
]

export const CONTACT_REASONS = [
  'Questions before booking',
  'Choosing the right service',
  'Payment or scheduling help',
  'Privacy or data handling questions',
]

export const AUDIENCE_POINTS = [
  {
    icon: Heart,
    title: 'For emotional overwhelm',
    description:
      'When anxiety, stress, numbness, or overthinking are making everyday life feel heavier.',
  },
  {
    icon: Users,
    title: 'For relationship strain',
    description:
      'When communication, conflict, trust, or emotional distance need careful attention.',
  },
  {
    icon: Sparkles,
    title: 'For transitions',
    description:
      'When change, uncertainty, loss, burnout, or self-doubt need a steadier place to land.',
  },
]
