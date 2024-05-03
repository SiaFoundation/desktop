import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { app } from 'electron'
import { deepmerge } from '@fastify/deepmerge'

export type Config = {
  seed: string
  directory: string
  autoOpenWebUI: boolean
  log: {
    level: string
  }
  http: {
    address: string
    password: string
  }
  s3: {
    address: string
    disableAuth: boolean
    enabled: boolean
    hostBucketEnabled: boolean
  }
}

const defaultConfig: Config = {
  seed: '',
  directory: getDefaultDataPath(),
  autoOpenWebUI: true,
  log: {
    level: 'info',
  },
  http: {
    address: 'localhost:9980',
    password: '',
  },
  s3: {
    address: 'localhost:9985',
    disableAuth: false,
    enabled: true,
    hostBucketEnabled: true,
  },
}

// Check if the application is configured
export function getIsConfigured(): boolean {
  try {
    const cfg = getConfig()
    return cfg.seed !== '' && cfg.directory !== '' && cfg.http.password !== ''
  } catch (err) {
    return false
  }
}

// Save the configuration
export async function saveConfig(config: Config): Promise<void> {
  if (config.seed === '') {
    throw new Error('Recovery phrase must be set')
  }
  if (config.http.password === '') {
    throw new Error('API password must be set')
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
