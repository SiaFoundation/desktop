'use client'

import { hoursInMilliseconds } from '@siafoundation/design-system'
import useSWR from 'swr'

export function useLatestVersion() {
  return useSWR(
    'latestVersion',
    async () => {
      return await window.electron.getLatestVersion()
    },
    {
      refreshInterval: hoursInMilliseconds(1),
      revalidateOnFocus: false,
    }
  )
}
