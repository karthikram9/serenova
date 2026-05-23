export type UserRole = 'client' | 'therapist' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  role: UserRole
  createdAt: string
}

export interface ClientProfile extends UserProfile {
  role: 'client'
  phone: string | null
  timezone: string
  preferredLanguage: 'en' | 'te'
}

export interface TherapistProfile extends UserProfile {
  role: 'therapist'
  bio: string
  specialization: string[]
  isAvailable: boolean
}
