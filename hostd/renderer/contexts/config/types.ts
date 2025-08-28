export const defaultValues = {
  name: '',
  dataDir: '',
  mnemonic: '',
  autoOpenWebUI: true,
  httpAddress: 'localhost:9980',
  httpPassword: '',
  syncerAddress: ':9981',
  rhp4Port: '9984',
  logLevel: 'info',
}

export type ConfigValues = typeof defaultValues
