'use client'

import useSWR from 'swr'

export function useInstalledVersion() {
  return useSWR(
    'installedVersion',
    async () => {
      return window.electron.getInstalledVersion()
    },
    {
      refreshInterval: 60_000,
    }
  )
}
