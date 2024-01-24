import React from 'react'
import { ConfigProvider } from '../contexts/config'

type Props = {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  return <ConfigProvider>{children}</ConfigProvider>
}
