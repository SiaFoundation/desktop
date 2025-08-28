'use client'

import useSWR from 'swr'

export type Config = {
  name: string
  recoveryPhrase: string
  directory: string
  autoOpenWebUI: boolean
  syncer: {
    address: string
  }
  http: {
    address: string
    password: string
  }
  log: {
    level: string
  }
  rhp4: {
    listenAddresses: { protocol: string; address: string }[]
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
    },
  )
}
