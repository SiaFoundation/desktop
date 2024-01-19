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
    mnemonic: config.Seed,
    hasCopied: false,
    dataDir: config.Directory || defaultDataPath,
    logLevel: config.Log.Level,
    httpAddress: config.HTTP.Address,
    httpPassword: config.HTTP.Password,
    s3Address: config.S3.Address,
    s3DisableAuth: config.S3.DisableAuth,
    s3Enabled: config.S3.Enabled,
    s3HostBucketEnabled: config.S3.HostBucketEnabled,
  }
}

export function transformUp(data: ConfigValues): Config {
  return {
    Seed: data.mnemonic,
    Directory: data.dataDir,
    Log: {
      Level: data.logLevel,
    },
    HTTP: {
      Address: data.httpAddress,
      Password: data.httpPassword,
    },
    S3: {
      Address: data.s3Address,
      DisableAuth: data.s3DisableAuth,
      Enabled: data.s3Enabled,
      HostBucketEnabled: data.s3HostBucketEnabled,
    },
  }
}
