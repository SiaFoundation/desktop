'use client'

import useSWR from 'swr'

export function useIsDaemonRunning() {
  return useSWR(
    'isDaemonRunning',
    async () => {
      const isRunning = await window.electron.checkIsDaemonRunning()
      console.log('here', isRunning)
      return isRunning
    },
    {
      refreshInterval: 10_000,
    }
  )
}
