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
  // Get port from the first listen address.
  // All RHP4 listen addresses must have the same port.
  const rhp4ListenAddress =
    config.rhp4.listenAddresses.find((address) => address.protocol === 'tcp')
      ?.address || ''
  const rhp4Port = rhp4ListenAddress.split(':')[1] || ''

  return {
    name: config.name,
    dataDir: config.directory || defaultDataPath,
    mnemonic: config.recoveryPhrase,
    autoOpenWebUI: config.autoOpenWebUI,
    httpAddress: config.http.address,
    httpPassword: config.http.password,
    syncerAddress: config.syncer.address,
    rhp4Port,
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
    syncer: {
      address: data.syncerAddress,
    },
    rhp4: {
      listenAddresses: [
        { protocol: 'tcp', address: `:${data.rhp4Port}` },
        { protocol: 'quic', address: `:${data.rhp4Port}` },
      ],
    },
    log: {
      level: data.logLevel,
    },
  }
}
