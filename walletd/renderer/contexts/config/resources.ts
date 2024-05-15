import { SWRError } from '@siafoundation/react-core'
import { Config } from '../../components/useConfigData'

export type Resources = {
  config: {
    data?: Config
    error?: SWRError
  }
  defaultDataPath: {
    data?: string
    error?: SWRError
  }
}

export function checkIfAllResourcesLoaded({
  config,
  defaultDataPath,
}: Resources) {
  return !!(
    // has initial daemon values
    (config.data && defaultDataPath.data)
  )
}

export function checkIfAnyResourcesErrored({
  config,
  defaultDataPath,
}: Resources) {
  return !!(
    // config has initial daemon values
    (config.error || defaultDataPath.error)
  )
}
