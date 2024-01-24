'use client'

import '../config/style.css'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { cx } from 'class-variance-authority'
import { NextAppCsr } from '@siafoundation/design-system'
import { Providers } from '../config/providers'

const sans = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

const mono = IBM_Plex_Mono({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
})

export const revalidate = 0

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(sans.variable, mono.variable)}
    >
      <body>
        <NextAppCsr passwordProtectRequestHooks={false}>
          <Providers>{children}</Providers>
        </NextAppCsr>
      </body>
    </html>
  )
}
