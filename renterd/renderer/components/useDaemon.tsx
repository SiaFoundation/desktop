'use client'

import { useCallback } from 'react'
import useSWR from 'swr'

export function useDaemon() {
  const isRunning = useSWR(
    'isDaemonRunning',
    async () => {
      const isRunning = await window.electron.checkIsDaemonRunning()
      return isRunning
    },
    {
      refreshInterval: 10_000,
    }
  )
  const startDaemon = useCallback(
    async (open = false) => {
      await window.electron.daemonStart()
      await isRunning.mutate()
    },
    [isRunning]
  )
  const stopDaemon = useCallback(async () => {
    await window.electron.daemonStop()
    await isRunning.mutate()
  }, [isRunning])
  return {
    isRunning,
    startDaemon,
    stopDaemon,
  }
}
