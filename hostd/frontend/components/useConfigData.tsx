'use client'

import { GetConfig } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export type Config = {
  Name: string
  RecoveryPhrase: string
  Directory: string
  Consensus: {
    GatewayAddress: string
    Bootstrap: boolean
    Peers: string[]
  }
  HTTP: {
    Address: string
    Password: string
  }
  Log: {
    Level: string
  }
  RHP2: {
    Address: string
  }
  RHP3: {
    TCPAddress: string
    WebSocketAddress: string
  }
}

export function useConfigData() {
  return useSWR<Config>(
    'config',
    async () => {
      return GetConfig()
    },
    {
      refreshInterval: 10_000,
    }
  )
}
