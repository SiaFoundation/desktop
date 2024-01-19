'use client'

import { useCallback } from 'react'
import {
  IsDaemonRunning,
  StartDaemon,
  StopDaemon,
} from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useDaemon() {
  const isRunning = useSWR(
    'isDaemonRunning',
    async () => {
      return await IsDaemonRunning()
    },
    {
      refreshInterval: 10_000,
    }
  )
  const startDaemon = useCallback(
    async (open = false) => {
      await StartDaemon(open)
      await isRunning.mutate()
    },
    [isRunning]
  )
  const stopDaemon = useCallback(async () => {
    await StopDaemon()
    await isRunning.mutate()
  }, [isRunning])
  return {
    isRunning,
    startDaemon,
    stopDaemon,
  }
}
