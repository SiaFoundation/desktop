'use client'

import useSWR from 'swr'

export type Config = {
  seed: string
  directory: string
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
      const config = await window.electron.getConfig()
      console.log(config)
      return config
    },
    {
      refreshInterval: 10_000,
    }
  )
}
