import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ReviewAnalyzer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          ReviewAnalyzer
        </div>
        <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.85)' }}>
          AI-Powered Review Analytics
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 40 }}>
          eazyweb.nc
        </div>
      </div>
    ),
    { ...size }
  )
}
