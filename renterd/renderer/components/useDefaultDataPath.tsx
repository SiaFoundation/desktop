'use client'

import useSWR from 'swr'

export function useDefaultDataPath() {
  return useSWR('defaultDataDirectory', async () => {
    return window.electron.getDefaultDataDirectory()
  })
}
