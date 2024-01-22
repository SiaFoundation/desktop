'use client'

import { GetInstalledVersion } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useInstalledVersion() {
  return useSWR(
    'installedVersion',
    async () => {
      return await GetInstalledVersion()
    },
    {
      refreshInterval: 60_000,
    }
  )
}
