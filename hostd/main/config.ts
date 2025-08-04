import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { app } from 'electron'
import { deepmerge } from '@fastify/deepmerge'
import { MaybeError } from './types'

export type Config = {
  name: string
  recoveryPhrase: string
  directory: string
  syncer: {
    address: string
  }
  autoOpenWebUI: boolean
  http: {
    address: string
    password: string
  }
  log: {
    level: string
  }
  rhp2: {
    address: string
  }
  rhp3: {
    tcp: string
  }
}

const defaultConfig: Config = {
  name: '',
  recoveryPhrase: '',
  directory: getDefaultDataPath(),
  autoOpenWebUI: true,
  syncer: {
    address: ':9981',
  },
  log: {
    level: 'info',
  },
  http: {
    address: 'localhost:9980',
    password: '',
  },
  rhp2: {
    address: ':9982',
  },
  rhp3: {
    tcp: ':9983',
  },
}

// Check if the application is configured
export function getIsConfigured(): boolean {
  try {
    const cfg = getConfig()
    return (
      cfg.recoveryPhrase !== '' &&
      cfg.directory !== '' &&
      cfg.http.password !== ''
    )
  } catch {
    return false
  }
}

// Save the configuration
export async function saveConfig(config: Config): Promise<MaybeError> {
  if (config.recoveryPhrase === '') {
    return {
      error: new Error('Recovery phrase must be set'),
    }
  }
  if (config.http.password === '') {
    return {
      error: new Error('password must be set'),
    }
  }

  if (!config.directory) {
    config.directory = getDefaultDataPath()
  }

  try {
    await fs.promises.mkdir(config.directory, { recursive: true })
    await fs.promises.mkdir(getConfigDirectoryPath(), {
      recursive: true,
    })

    const existingConfig = getConfig()
    const merge = deepmerge({ all: true })
    const mergedConfig = merge(defaultConfig, existingConfig, config)

    await fs.promises.writeFile(getConfigFilePath(), yaml.dump(mergedConfig))
  } catch (e) {
    return {
      error: e as Error,
    }
  }

  return {}
}

// Get the configuration
export function getConfig(): Config {
  const configFilePath = getConfigFilePath()
  try {
    const fileContents = fs.readFileSync(configFilePath, 'utf8')
    return yaml.load(fileContents) as Config
  } catch {
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
