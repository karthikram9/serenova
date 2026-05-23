import type { LucideIcon } from 'lucide-react'
import { Heart, Users, Sparkles } from 'lucide-react'

export interface Service {
  id: string
  icon: LucideIcon
  title: string
  tagline: string
  description: string
  forWhom: string[]
  sessionType: string
  slug: string
}

export const SERVICES: Service[] = [
  {
    id: 'individual',
    icon: Heart,
    title: 'Individual Therapy',
    tagline: 'Your personal healing journey',
    description:
      'One-on-one sessions focused on understanding your emotional patterns, managing anxiety, navigating life transitions, and building lasting mental well-being.',
    forWhom: [
      'Feeling anxious or overwhelmed',
      'Struggling with self-worth',
      'Going through life changes',
      'Processing past experiences',
    ],
    sessionType: 'individual_therapy',
    slug: 'individual-therapy',
  },
  {
    id: 'relationship',
    icon: Users,
    title: 'Relationship Counseling',
    tagline: 'Healing and strengthening bonds',
    description:
      'Compassionate support for couples and individuals navigating relationship challenges — from communication and conflict to rebuilding trust and emotional intimacy.',
    forWhom: [
      'Communication breakdowns',
      'Trust and intimacy issues',
      'Conflict resolution',
      'Pre-marital guidance',
    ],
    sessionType: 'relationship_counseling',
    slug: 'relationship-counseling',
  },
  {
    id: 'wellness',
    icon: Sparkles,
    title: 'Emotional Wellness',
    tagline: 'Balance, clarity, and inner peace',
    description:
      'Holistic guidance to help you reconnect with yourself, manage stress, build emotional resilience, and create a healthier relationship with your own mind.',
    forWhom: [
      'Burnout and exhaustion',
      'Emotional numbness',
      'Overthinking and stress',
      'Seeking inner balance',
    ],
    sessionType: 'emotional_wellness',
    slug: 'emotional-wellness',
  },
]
