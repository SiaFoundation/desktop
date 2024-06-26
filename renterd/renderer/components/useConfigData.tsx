'use client'

import useSWR from 'swr'

export type Config = {
  seed: string
  directory: string
  autoOpenWebUI: boolean
  log: {
    level: string
  }
  http: {
    address: string
    password: string
  }
  s3: {
    address: string
    disableAuth: boolean
    enabled: boolean
    hostBucketEnabled: boolean
  }
}

export function useConfigData() {
  return useSWR<Config>(
    'config',
    async () => {
      return window.electron.getConfig()
    },
    {
      refreshInterval: 10_000,
    }
  )
}
