'use client'

import { IsDaemonRunning } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useIsDaemonRunning() {
  return useSWR(
    'isDaemonRunning',
    async () => {
      return await IsDaemonRunning()
    },
    {
      refreshInterval: 10_000,
    }
  )
}
