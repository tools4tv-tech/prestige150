import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'

const sans = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  title: 'Prestige Sector 150 | Elevated Living in Noida',
  description: 'Discover premium 2, 3 & 4 BHK residences designed around space, comfort and contemporary urban living in Sector 150, Noida.',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased">
        {children}
        {/* Vercel Analytics only works when hosted on Vercel */}
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
