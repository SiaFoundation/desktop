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
  syncer: {
    address: string
    bootstrap: boolean
    enableUPnP: boolean
  }
  consensus: {
    network: 'mainnet' | 'zen' | 'anagami'
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
