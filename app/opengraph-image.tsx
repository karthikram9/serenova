import { ImageResponse } from 'next/og'

export const alt = 'Serenova online mental wellness and relationship counseling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#fdfcf8',
          color: '#292524',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '80px',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '2px solid #c2dbcc',
            borderRadius: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            height: '100%',
            justifyContent: 'center',
            padding: '64px',
            width: '100%',
          }}
        >
          <div style={{ color: '#32694a', fontSize: 32, fontWeight: 700 }}>
            Serenova
          </div>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            A safe space to pause, reflect, and heal
          </div>
          <div style={{ color: '#57534e', fontSize: 30, lineHeight: 1.4 }}>
            Online mental wellness and relationship counseling support.
          </div>
        </div>
      </div>
    ),
    size
  )
}
