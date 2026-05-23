import {
  Html, Body, Container, Heading, Text,
  Section, Hr, Link, Preview
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name: string
  bookingId: string
  sessionType: string
}

export function BookingConfirmationEmail({ name, bookingId, sessionType }: Props) {
  const sessionLabel = sessionType.replace(/_/g, ' ')

  return (
    <Html>
      <Preview>Your session request has been received — we will confirm shortly.</Preview>
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
          <Text style={{ color: '#44845f', fontSize: '20px', fontWeight: '600', margin: '0 0 32px' }}>
            🌿 Serenova
          </Text>

          <Heading style={{ color: '#1c1917', fontSize: '24px', fontWeight: '600', margin: '0 0 16px' }}>
            Dear {name},
          </Heading>

          <Text style={{ color: '#57534e', fontSize: '16px', lineHeight: '1.8', margin: '0 0 20px' }}>
            Thank you for reaching out. Your session request for <strong>{sessionLabel}</strong> has been received and we will review it shortly.
          </Text>

          <Text style={{ color: '#a8a29e', fontSize: '11px', margin: '0 0 24px' }}>
            Request ID: {bookingId}
          </Text>

          <Section style={{
            backgroundColor: '#f2f7f4',
            borderRadius: '12px',
            padding: '20px 24px',
            margin: '24px 0',
          }}>
            <Text style={{ color: '#44845f', fontSize: '13px', fontWeight: '600', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              What happens next
            </Text>
            <Text style={{ color: '#44403c', fontSize: '14px', lineHeight: '1.7', margin: '0' }}>
              1. We will verify your payment submission<br />
              2. You will receive a confirmation email with your Zoom link<br />
              3. Join from the comfort of your own space
            </Text>
          </Section>

          <Text style={{ color: '#78716c', fontSize: '14px', lineHeight: '1.7', margin: '20px 0' }}>
            If you have any questions, reply to this email or visit our{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://serenova.in'}/contact`} style={{ color: '#44845f', textDecoration: 'underline' }}>
              contact page
            </Link>.
          </Text>

          <Hr style={{ borderColor: '#ecdfcc', margin: '28px 0' }} />

          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '0', fontStyle: 'italic' }}>
            &ldquo;Healing is not linear — and that&apos;s perfectly okay.&rdquo;
          </Text>
          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '4px 0 0' }}>
            The Serenova Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
