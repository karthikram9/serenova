import {
  Html, Body, Container, Heading, Text,
  Section, Hr, Link, Preview
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name: string
  sessionType: string
  scheduledAt: string | null
  therapistNotes: string
}

export function BookingRejectedEmail({ name, sessionType, scheduledAt, therapistNotes }: Props) {
  const sessionLabel = sessionType.replace(/_/g, ' ')
  const formattedDate = scheduledAt 
    ? new Date(scheduledAt).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    : null

  return (
    <Html>
      <Preview>An update regarding your session request — Serenova</Preview>
      <Body style={{
        backgroundColor: '#faf7f0',
        fontFamily: 'Georgia, serif',
        margin: '0',
        padding: '40px 20px',
      }}>
        <Container style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px',
          maxWidth: '560px',
          margin: '0 auto',
          border: '1px solid #ecdfcc',
        }}>
          {/* Logo */}
          <Text style={{ color: '#c2574e', fontSize: '20px', fontWeight: '600', margin: '0 0 32px' }}>
            🌿 Serenova
          </Text>

          <Heading style={{ color: '#1c1917', fontSize: '24px', fontWeight: '600', margin: '0 0 16px' }}>
            Dear {name},
          </Heading>

          <Text style={{ color: '#57534e', fontSize: '16px', lineHeight: '1.8', margin: '0 0 20px' }}>
            We are writing to provide an update regarding your session request for <strong>{sessionLabel}</strong>{formattedDate ? ` scheduled on ${formattedDate}` : ''}.
          </Text>

          <Text style={{ color: '#57534e', fontSize: '16px', lineHeight: '1.8', margin: '0 0 20px' }}>
            Unfortunately, we were unable to verify your payment proof, and the session request has been cancelled.
          </Text>

          <Section style={{
            backgroundColor: '#fff5f5',
            borderRadius: '12px',
            padding: '24px',
            margin: '24px 0',
            border: '1px solid #fed7d7',
          }}>
            <Text style={{ color: '#c53030', fontSize: '13px', fontWeight: '600', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Note from the Therapist
            </Text>
            <Text style={{ color: '#2d3748', fontSize: '14px', lineHeight: '1.6', margin: '0', fontStyle: 'italic' }}>
              &ldquo;{therapistNotes}&rdquo;
            </Text>
          </Section>

          <Text style={{ color: '#57534e', fontSize: '15px', lineHeight: '1.7', margin: '20px 0' }}>
            Please feel free to go back to your{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://serenova.in'}/book`} style={{ color: '#44845f', fontWeight: '600', textDecoration: 'underline' }}>
              booking page
            </Link>{' '}
            to request a new slot or re-submit a valid payment proof.
          </Text>

          <Text style={{ color: '#78716c', fontSize: '14px', lineHeight: '1.7', margin: '20px 0' }}>
            If you have any questions or feel there has been an error, reply to this email or visit our{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://serenova.in'}/contact`} style={{ color: '#44845f', textDecoration: 'underline' }}>
              contact page
            </Link>.
          </Text>

          <Hr style={{ borderColor: '#ecdfcc', margin: '28px 0' }} />

          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '0', fontStyle: 'italic' }}>
            &ldquo;We are here to support you at every step of your journey.&rdquo;
          </Text>
          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '4px 0 0' }}>
            The Serenova Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
