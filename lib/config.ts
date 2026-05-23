import { z } from 'zod'

const configSchema = z.object({
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string().min(1),
    serviceRoleKey: z.string().min(1),
  }),
  siteUrl: z.string().url(),
  resend: z.object({
    apiKey: z.string().min(1),
    fromEmail: z.string().email(),
  }),
  therapist: z.object({
    email: z.string().email(),
    userId: z.string().min(1),
  }),
  plausible: z.object({
    domain: z.string().min(1),
  }),
  sentry: z.object({
    dsn: z.string().url(),
  }),
  cal: z.object({
    username: z.string().min(1),
    eventSlug: z.string().min(1),
  }),
})

function getConfig() {
  const parsed = configSchema.safeParse({
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL,
    },
    therapist: {
      email: process.env.THERAPIST_EMAIL,
      userId: process.env.THERAPIST_USER_ID,
    },
    plausible: {
      domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
    cal: {
      username: process.env.NEXT_PUBLIC_CAL_USERNAME,
      eventSlug: process.env.NEXT_PUBLIC_CAL_EVENT_SLUG,
    },
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment configuration:', parsed.error.format())
    throw new Error('Invalid environment configuration. Check .env.local.')
  }

  return parsed.data
}

export const config = getConfig()
