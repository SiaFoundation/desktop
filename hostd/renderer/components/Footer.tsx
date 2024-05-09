'use client'

import { Text, ThemeRadio } from '@siafoundation/design-system'
import { useInstalledVersion } from './useInstalledVersion'

export function Footer() {
  const installedVersion = useInstalledVersion()
  return (
    <div className="flex gap-2 justify-center items-center w-full">
      <div className="flex gap-3">
        <Text color="verySubtle" size="10">
          desktop v{process.env.version}
        </Text>
        <Text color="verySubtle" size="10">
          daemon {installedVersion.data}
        </Text>
      </div>
      <div className="flex-1" />
      <ThemeRadio className="!gap-2" />
    </div>
  )
}
