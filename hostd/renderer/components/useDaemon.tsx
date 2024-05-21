'use client'

import { triggerErrorToast } from '@siafoundation/design-system'
import { useCallback, useState } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)
  const startDaemon = useCallback(async () => {
    setIsLoading(true)
    const { error } = await window.electron.daemonStart()
    if (error) {
      console.error(error)
      triggerErrorToast({
        title: `Error starting daemon`,
      })
    }
    await isRunning.mutate()
    setIsLoading(false)
  }, [isRunning])
  const stopDaemon = useCallback(async () => {
    setIsLoading(true)
    const { error } = await window.electron.daemonStop()
    if (error) {
      console.error(error)
      triggerErrorToast({
        title: `Error stopping daemon`,
      })
    }
    await isRunning.mutate()
    setIsLoading(false)
  }, [isRunning])
  return {
    isRunning,
    isLoading,
    startDaemon,
    stopDaemon,
  }
}
