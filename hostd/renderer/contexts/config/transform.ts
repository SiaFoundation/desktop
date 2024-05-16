'use client'

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
    name: config.name,
    dataDir: config.directory || defaultDataPath,
    mnemonic: config.recoveryPhrase,
    autoOpenWebUI: config.autoOpenWebUI,
    hasCopied: false,
    httpAddress: config.http.address,
    httpPassword: config.http.password,
    consensusGatewayAddress: config.consensus.gatewayAddress,
    rhp2Address: config.rhp2.address,
    rhp3AddressTcp: config.rhp3.tcp,
    logLevel: config.log.level,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    name: data.name,
    directory: data.dataDir,
    recoveryPhrase: data.mnemonic,
    autoOpenWebUI: data.autoOpenWebUI,
    http: {
      address: data.httpAddress,
      password: data.httpPassword,
    },
    consensus: {
      gatewayAddress: data.consensusGatewayAddress,
    },
    rhp2: { address: data.rhp2Address },
    rhp3: {
      tcp: data.rhp3AddressTcp,
    },
    log: {
      level: data.logLevel,
    },
  }
}
