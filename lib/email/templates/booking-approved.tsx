import {
  Html, Body, Container, Heading, Text,
  Section, Hr, Link, Preview, Button
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name: string
  zoomLink: string
  scheduledAt: string
  sessionType: string
}

export function BookingApprovedEmail({ name, zoomLink, scheduledAt, sessionType }: Props) {
  const sessionLabel = sessionType.replace(/_/g, ' ')
  const formattedDate = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  return (
    <Html>
      <Preview>Your session is confirmed — Serenova</Preview>
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
            We are pleased to confirm your session for <strong>{sessionLabel}</strong>. Your payment has been verified and your slot is fully reserved.
          </Text>

          <Section style={{
            backgroundColor: '#f2f7f4',
            borderRadius: '12px',
            padding: '24px',
            margin: '24px 0',
            border: '1px solid #dbece1',
          }}>
            <Text style={{ color: '#44845f', fontSize: '13px', fontWeight: '600', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Session Details
            </Text>
            <Text style={{ color: '#1c1917', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>
              {formattedDate}
            </Text>
            
            <Text style={{ color: '#44403c', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px' }}>
              Your session will be conducted securely via Zoom. Please use the button below to join the call at the scheduled time:
            </Text>

            <Button 
              href={zoomLink}
              style={{
                backgroundColor: '#44845f',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block',
              }}
            >
              Join Zoom Session
            </Button>
          </Section>

          <Text style={{ color: '#78716c', fontSize: '14px', lineHeight: '1.7', margin: '20px 0' }}>
            If you need to reschedule or cancel, please visit your{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://serenova.in'}/dashboard`} style={{ color: '#44845f', textDecoration: 'underline' }}>
              client dashboard
            </Link> or reach out via our messaging portal.
          </Text>

          <Hr style={{ borderColor: '#ecdfcc', margin: '28px 0' }} />

          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '0', fontStyle: 'italic' }}>
            &ldquo;You are taking a beautiful step toward yourself today.&rdquo;
          </Text>
          <Text style={{ color: '#a8a29e', fontSize: '12px', margin: '4px 0 0' }}>
            The Serenova Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
