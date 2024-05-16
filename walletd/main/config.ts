import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { app } from 'electron'
import { deepmerge } from '@fastify/deepmerge'

// directory: /etc/walletd
// autoOpenWebUI: true
// http:
//   address: :9980
//   password: sia is cool
// consensus:
//   network: mainnet
//   gatewayAddress: :9981
//   bootstrap: false
//   enableUPnP: false
// index:
//   mode: personal # full, personal, none (full index will index the entire blockchain, personal will only index addresses that are registered in the wallet, none will treat the database as read-only and not index any new data)
//   batchSize: 64 # max number of blocks to index at a time (increasing this will increase scan speed, but also increase memory and cpu usage)
// log:
//   level: info # global log level
//   stdout:
//     enabled: true # enable logging to stdout
//     level: debug # override the global log level for stdout
//     enableANSI: false
//     format: human # human or JSON
//   file:
//     enabled: true # enable logging to a file
//     level: debug # override the global log level for the file
//     path: /var/log/walletd.log
//     format: json # human or JSON

export type Config = {
  directory: string
  autoOpenWebUI: boolean
  log: {
    level: string
  }
  http: {
    address: string
    password: string
  }
  index: {
    mode: 'personal' | 'full' | 'none'
    batchSize: number
  }
  consensus: {
    network: 'mainnet' | 'zen'
    gatewayAddress: string
    bootstrap: boolean
    enableUPnP: boolean
  }
}

const defaultConfig: Config = {
  directory: getDefaultDataPath(),
  autoOpenWebUI: true,
  log: {
    level: 'info',
  },
  http: {
    address: 'localhost:9980',
    password: '',
  },
  index: {
    mode: 'personal',
    batchSize: 64,
  },
  consensus: {
    network: 'mainnet',
    gatewayAddress: ':9981',
    bootstrap: false,
    enableUPnP: false,
  },
}

// Check if the application is configured
export function getIsConfigured(): boolean {
  try {
    const cfg = getConfig()
    return cfg.directory !== '' && cfg.http.password !== ''
  } catch (err) {
    return false
  }
}

// Save the configuration
export async function saveConfig(config: Config): Promise<void> {
  if (config.http.password === '') {
    throw new Error('password must be set')
  }

  if (!config.directory) {
    config.directory = getDefaultDataPath()
  }

  await fs.promises.mkdir(config.directory, { recursive: true })
  await fs.promises.mkdir(getConfigDirectoryPath(), {
    recursive: true,
  })

  const existingConfig = getConfig()
  const merge = deepmerge({ all: true })
  const mergedConfig = merge(defaultConfig, existingConfig, config)

  await fs.promises.writeFile(getConfigFilePath(), yaml.dump(mergedConfig))
}

// Get the configuration
export function getConfig(): Config {
  const configFilePath = getConfigFilePath()
  try {
    const fileContents = fs.readFileSync(configFilePath, 'utf8')
    return yaml.load(fileContents) as Config
  } catch (e) {
    return defaultConfig
  }
}

export function getConfigDirectoryPath(): string {
  return path.join(app.getPath('userData'), 'data')
}

export function getConfigFilePath(): string {
  return path.join(getConfigDirectoryPath(), 'config.yaml')
}

export function getDefaultDataPath(): string {
  return getConfigDirectoryPath()
}
