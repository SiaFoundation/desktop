'use client'

import { Text } from '@siafoundation/design-system'
import { Upgrade16 } from '@siafoundation/react-icons'
import { useLatestVersion } from './useLatestVersion'
import { useInstalledVersion } from './useInstalledVersion'

export function UpdateBanner() {
  const latestVersion = useLatestVersion()
  const installedVersion = useInstalledVersion()
  return (
    <div className="flex w-full gap-2 items-center justify-center py-2 px-3 bg-amber-600 dark:bg-amber-500">
      <Text color="lo">
        <Upgrade16 />
      </Text>
      <Text size="14" color="lo">
        An update to version {latestVersion.data} is available.
      </Text>
    </div>
  )
}
