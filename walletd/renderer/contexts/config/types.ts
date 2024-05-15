import BigNumber from 'bignumber.js'

export const defaultValues = {
  dataDir: '',
  logLevel: 'info',
  httpAddress: 'localhost:9980',
  httpPassword: '',
  indexMode: 'personal' as 'personal' | 'full' | 'none',
  indexBatchSize: new BigNumber(64) as BigNumber | undefined,
  consensusNetwork: 'mainnet' as 'mainnet' | 'zen',
  consensusGatewayAddress: ':9981',
  consensusBootstrap: false,
  consensusEnableUPnP: false,
}

export type ConfigValues = typeof defaultValues
