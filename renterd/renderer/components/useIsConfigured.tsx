'use client'

import useSWR from 'swr'

export function useIsConfigured() {
  return useSWR(
    'isConfigured',
    async () => {
      return window.electron.getIsConfigured()
    },
    {
      refreshInterval: 10_000,
    }
  )
}
