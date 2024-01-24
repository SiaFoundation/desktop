'use client'

import useSWR from 'swr'

export type Config = {
  name: string
  recoveryPhrase: string
  directory: string
  consensus: {
    gatewayAddress: string
  }
  http: {
    address: string
    password: string
  }
  log: {
    level: string
  }
  rhp2: {
    address: string
  }
  rhp3: {
    tcp: string
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
