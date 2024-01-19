'use client'

import { GetConfig } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export type Config = {
  Seed: string
  Directory: string
  Log: {
    Level: string
  }
  HTTP: {
    Address: string
    Password: string
  }
  S3: {
    Address: string
    DisableAuth: boolean
    Enabled: boolean
    HostBucketEnabled: boolean
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
