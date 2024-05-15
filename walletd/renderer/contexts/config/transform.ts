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
    indexMode: config.index.mode,
    indexBatchSize: config.index.batchSize
      ? new BigNumber(config.index.batchSize)
      : undefined,
    consensusNetwork: config.consensus.network,
    consensusGatewayAddress: config.consensus.gatewayAddress,
    consensusBootstrap: config.consensus.bootstrap,
    consensusEnableUPnP: config.consensus.enableUPnP,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    directory: data.dataDir,
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
    consensus: {
      network: data.consensusNetwork,
      gatewayAddress: data.consensusGatewayAddress,
      bootstrap: data.consensusBootstrap,
      enableUPnP: data.consensusEnableUPnP,
    },
  }
}
