import BigNumber from 'bignumber.js'

export const defaultValues = {
  dataDir: '',
  autoOpenWebUI: true,
  logLevel: 'info',
  httpAddress: 'localhost:9980',
  httpPassword: '',
  indexMode: 'personal' as 'personal' | 'full' | 'none',
  indexBatchSize: new BigNumber(64) as BigNumber | undefined,
  consensusNetwork: 'mainnet' as 'mainnet' | 'zen' | 'anagami',
  syncerAddress: ':9981',
  syncerBootstrap: false,
  syncerEnableUPnP: false,
}

export type ConfigValues = typeof defaultValues
