'use client'

import BigNumber from 'bignumber.js'
import { Config } from '../../components/useConfigData'
import { ConfigValues } from './types'

export function transformDown({
  config,
  defaultDataPath,
}: {
  config: Config
  defaultDataPath: string
}): ConfigValues {
  return {
    dataDir: config.directory || defaultDataPath,
    logLevel: config.log.level,
    httpAddress: config.http.address,
    httpPassword: config.http.password,
    autoOpenWebUI: config.autoOpenWebUI,
    indexMode: config.index.mode,
    indexBatchSize: config.index.batchSize
      ? new BigNumber(config.index.batchSize)
      : undefined,
    consensusNetwork: config.consensus.network,
    syncerAddress: config.syncer.address,
    syncerBootstrap: config.syncer.bootstrap,
    syncerEnableUPnP: config.syncer.enableUPnP,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    directory: data.dataDir,
    autoOpenWebUI: data.autoOpenWebUI,
    log: {
      level: data.logLevel,
    },
    http: {
      address: data.httpAddress,
      password: data.httpPassword,
    },
    index: {
      mode: data.indexMode,
      batchSize: data.indexBatchSize?.toNumber() || 64,
    },
    syncer: {
      address: data.syncerAddress,
      bootstrap: data.syncerBootstrap,
      enableUPnP: data.syncerEnableUPnP,
    },
    consensus: {
      network: data.consensusNetwork,
    },
  }
}
