'use client'

import useSWR from 'swr'

export type Config = {
  directory: string
  autoOpenWebUI: boolean
  log: {
    level: string
  }
  http: {
    address: string
    password: string
  }
  index: {
    mode: 'personal' | 'full' | 'none'
    batchSize: number
  }
  consensus: {
    network: 'mainnet' | 'zen'
    gatewayAddress: string
    bootstrap: boolean
    enableUPnP: boolean
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
