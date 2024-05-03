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
    mnemonic: config.seed,
    hasCopied: false,
    autoOpenWebUI: config.autoOpenWebUI,
    dataDir: config.directory || defaultDataPath,
    logLevel: config.log.level,
    httpAddress: config.http.address,
    httpPassword: config.http.password,
    s3Address: config.s3.address,
    s3DisableAuth: config.s3.disableAuth,
    s3Enabled: config.s3.enabled,
    s3HostBucketEnabled: config.s3.hostBucketEnabled,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    seed: data.mnemonic,
    directory: data.dataDir,
    autoOpenWebUI: data.autoOpenWebUI,
    log: {
      level: data.logLevel,
    },
    http: {
      address: data.httpAddress,
      password: data.httpPassword,
    },
    s3: {
      address: data.s3Address,
      disableAuth: data.s3DisableAuth,
      enabled: data.s3Enabled,
      hostBucketEnabled: data.s3HostBucketEnabled,
    },
  }
}
