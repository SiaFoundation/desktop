'use client'

import {
  LoadingDots,
  Text,
  triggerErrorToast,
  triggerSuccessToast,
} from '@siafoundation/design-system'
import { Upgrade16 } from '@siafoundation/react-icons'
import { useLatestVersion } from './useLatestVersion'
import { useInstalledVersion } from './useInstalledVersion'
import { useCallback, useState } from 'react'

export function UpdateBanner() {
  const latestVersion = useLatestVersion()
  const installedVersion = useInstalledVersion()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)

  const update = useCallback(async () => {
    try {
      setIsUpdating(true)
      await window.electron.daemonUpdate()
    } catch (e) {
      console.log(e)
      triggerErrorToast('Error downloading update. Please try again.')
      setIsUpdating(false)
      setIsRestarting(false)
      return
    }
    try {
      setIsRestarting(true)
      await window.electron.daemonStart()
    } catch (e) {
      console.log(e)
      triggerErrorToast('Error restarting daemon. Please try again.')
      setIsUpdating(false)
      setIsRestarting(false)
      return
    }
    triggerSuccessToast(`Updated to renterd version ${installedVersion.data}.`)
    setIsUpdating(false)
    setIsRestarting(false)
  }, [setIsUpdating, installedVersion.data])

  if (latestVersion.data === installedVersion.data) {
    return null
  }

  return (
    <div
      className="flex w-full gap-2 items-center justify-center py-2 px-3 bg-amber-600 dark:bg-amber-500 cursor-pointer"
      onClick={update}
    >
      {isRestarting ? (
        <>
          <LoadingDots />
          <Text size="14" color="lo">
            Restarting renterd daemon {latestVersion.data}
          </Text>
        </>
      ) : isUpdating ? (
        <>
          <LoadingDots />
          <Text size="14" color="lo">
            Updating to renterd {latestVersion.data}
          </Text>
        </>
      ) : (
        <>
          <Text color="lo">
            <Upgrade16 />
          </Text>
          <Text size="14" color="lo">
            An update to renterd {latestVersion.data} is available.
          </Text>
        </>
      )}
    </div>
  )
}
