'use client'

import { DefaultDataPath } from '../wailsjs/go/main/App.js'
import useSWR from 'swr'

export function useDefaultDataPath() {
  return useSWR('defaultDataDirectory', async () => {
    return await DefaultDataPath()
  })
}
