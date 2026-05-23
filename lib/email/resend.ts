import { Resend } from 'resend'
import { config } from '@/lib/config'
import { BookingConfirmationEmail } from './templates/booking-confirmation'
import { BookingApprovedEmail } from './templates/booking-approved'
import { BookingRejectedEmail } from './templates/booking-rejected'
import { render } from '@react-email/render'
import * as React from 'react'

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (resendInstance) return resendInstance

  const apiKey = config.resend.apiKey
  if (!apiKey || apiKey === 'placeholder' || apiKey.startsWith('your_')) {
    console.warn('⚠️ Resend API key is not configured or is a placeholder. Emails will be logged to console instead.')
    return null
  }

  try {
    resendInstance = new Resend(apiKey)
    return resendInstance
  } catch (err) {
    console.error('❌ Failed to initialize Resend client:', err)
    return null
  }
}

interface BookingConfirmationParams {
  to: string
  name: string
  bookingId: string
  sessionType: string
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log(`[Email Mock/Logger] Booking Confirmation sent to ${params.to}. Params:`, params)
    return
  }

  try {
    const html = await render(React.createElement(BookingConfirmationEmail, {
      name: params.name,
      bookingId: params.bookingId,
      sessionType: params.sessionType
    }))
    
    await client.emails.send({
      from: config.resend.fromEmail || 'Serenova <noreply@serenova.in>',
      to: params.to,
      subject: 'Your session request has been received — Serenova',
      html,
    })
  } catch (err) {
    console.error('❌ Failed to send booking confirmation email:', err)
  }
}

interface BookingApprovedParams {
  to: string
  name: string
  zoomLink: string
  scheduledAt: string
  sessionType: string
}

export async function sendBookingApprovedEmail(params: BookingApprovedParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log(`[Email Mock/Logger] Booking Approved sent to ${params.to}. Params:`, params)
    return
  }

  try {
    const html = await render(React.createElement(BookingApprovedEmail, {
      name: params.name,
      zoomLink: params.zoomLink,
      scheduledAt: params.scheduledAt,
      sessionType: params.sessionType
    }))

    await client.emails.send({
      from: config.resend.fromEmail || 'Serenova <noreply@serenova.in>',
      to: params.to,
      subject: 'Your session is confirmed — Serenova',
      html,
    })
  } catch (err) {
    console.error('❌ Failed to send booking approved email:', err)
  }
}

interface BookingRejectedParams {
  to: string
  name: string
  sessionType: string
  scheduledAt: string | null
  therapistNotes: string
}

export async function sendBookingRejectedEmail(params: BookingRejectedParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log(`[Email Mock/Logger] Booking Rejected sent to ${params.to}. Params:`, params)
    return
  }

  try {
    const html = await render(React.createElement(BookingRejectedEmail, {
      name: params.name,
      sessionType: params.sessionType,
      scheduledAt: params.scheduledAt,
      therapistNotes: params.therapistNotes
    }))

    await client.emails.send({
      from: config.resend.fromEmail || 'Serenova <noreply@serenova.in>',
      to: params.to,
      subject: 'An update regarding your session request — Serenova',
      html,
    })
  } catch (err) {
    console.error('❌ Failed to send booking rejected email:', err)
  }
}

export async function sendTherapistNotification(subject: string, body: string): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log(`[Email Mock/Logger] Therapist Notification. Subject: "${subject}", Body: "${body}"`)
    return
  }

  try {
    const toEmail = config.therapist.email
    if (!toEmail) {
      console.warn('⚠️ Therapist email is not configured in config. Cannot send notification.')
      return
    }

    await client.emails.send({
      from: config.resend.fromEmail || 'Serenova <noreply@serenova.in>',
      to: toEmail,
      subject,
      text: body,
    })
  } catch (err) {
    console.error('❌ Failed to send therapist notification:', err)
  }
}
