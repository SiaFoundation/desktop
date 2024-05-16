export const defaultValues = {
  name: '',
  dataDir: '',
  mnemonic: '',
  hasCopied: false,
  autoOpenWebUI: true,
  httpAddress: 'localhost:9980',
  httpPassword: '',
  consensusGatewayAddress: ':9981',
  rhp2Address: ':9982',
  rhp3AddressTcp: ':9983',
  logLevel: 'info',
}

export type ConfigValues = typeof defaultValues
