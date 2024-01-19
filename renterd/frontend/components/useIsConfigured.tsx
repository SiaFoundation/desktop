'use client'

import { IsConfigured } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useIsConfigured() {
  return useSWR(
    'isConfigured',
    async () => {
      return await IsConfigured()
    },
    {
      refreshInterval: 10_000,
    }
  )
}
