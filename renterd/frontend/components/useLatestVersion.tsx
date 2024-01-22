'use client'

import { GetLatestVersion } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useLatestVersion() {
  return useSWR(
    'latestVersion',
    async () => {
      return await GetLatestVersion()
    },
    {
      refreshInterval: 60_000,
    }
  )
}
