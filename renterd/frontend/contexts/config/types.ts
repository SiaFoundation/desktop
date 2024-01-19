export const defaultValues = {
  dataDir: '',
  mnemonic: '',
  hasCopied: false,
  logLevel: 'info',
  httpAddress: 'localhost:9980',
  httpPassword: '',
  s3Address: '',
  s3DisableAuth: false,
  s3Enabled: true,
  s3HostBucketEnabled: true,
}

export type ConfigValues = typeof defaultValues
