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
    name: config.Name,
    dataDir: config.Directory || defaultDataPath,
    mnemonic: config.RecoveryPhrase,
    hasCopied: false,
    httpAddress: config.HTTP.Address,
    httpPassword: config.HTTP.Password,
    consensusGatewayAddress: config.Consensus.GatewayAddress,
    rhp2Address: config.RHP2.Address,
    rhp3AddressTcp: config.RHP3.TCPAddress,
    logLevel: config.Log.Level,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    Name: data.name,
    Directory: data.dataDir,
    RecoveryPhrase: data.mnemonic,
    HTTP: {
      Address: data.httpAddress,
      Password: data.httpPassword,
    },
    Consensus: {
      Bootstrap: true,
      GatewayAddress: data.consensusGatewayAddress,
      Peers: [],
    },
    RHP2: {
      Address: data.rhp2Address,
    },
    RHP3: {
      TCPAddress: data.rhp3AddressTcp,
      WebSocketAddress: '',
    },
    Log: {
      Level: data.logLevel,
    },
  }
}
