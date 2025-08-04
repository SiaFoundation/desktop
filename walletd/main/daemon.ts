import { spawn } from 'child_process'
import { state, addDaemonLog } from './state'
import { getConfig, getConfigFilePath } from './config'
import { getBinaryFilePath, getDaemonDirectoryPath } from './binary'
import path from 'path'
import fs from 'fs'
import { MaybeError } from './types'
import { parseLogLine } from './logs'

const configFileVariableName = 'WALLETD_CONFIG_FILE'

export async function startDaemon(): Promise<MaybeError> {
  try {
    await stopDaemon()
    state.daemonLogs = []
    const config = getConfig()
    const binaryFilePath = getBinaryFilePath()

    console.log('Starting walletd daemon...')
    state.daemon = spawn(binaryFilePath, [], {
      env: { ...process.env, [configFileVariableName]: getConfigFilePath() },
      cwd: config.directory,
    })

    let startupError: Error | null = null

    state.daemon.stdout?.on('data', (data) => {
      const message = data.toString()
      const lines = message.split(/\r?\n/).filter(Boolean)
      lines.forEach((line: string) => {
        console.log(`[walletd] ${line}`)
        const parsed = parseLogLine(line)
        if (parsed) {
          addDaemonLog(parsed)
        }
      })
    })

    state.daemon.stderr?.on('data', (data) => {
      const message = data.toString()
      const lines = message.split(/\r?\n/).filter(Boolean)
      lines.forEach((line: string) => {
        console.error(`[walletd] ${line}`)
        const parsed = parseLogLine(line)
        if (parsed) {
          addDaemonLog(parsed)
        }
      })
      startupError = new Error(message)
    })

    state.daemon.on('error', (error) => {
      console.error('Daemon process error:', error)
      state.daemon = null
      addDaemonLog({
        timestamp: new Date(),
        level: 'ERROR',
        source: 'daemon',
        message: error.toString(),
        raw: error.toString(),
      })
      startupError = error
    })

    state.daemon.on('close', () => {
      console.log('Daemon process closed')
      state.daemon = null
    })

    // Wait 3 seconds in case there is an startup error.
    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (startupError) {
      console.error('Daemon startup error:', startupError)
      return {
        error: startupError,
      }
    }

    console.log('Daemon started successfully')
    return {}
  } catch (err) {
    const error = err as Error
    console.error('Failed to start daemon:', error)
    addDaemonLog({
      timestamp: new Date(),
      level: 'ERROR',
      source: 'daemon',
      message: error.toString(),
      raw: error.toString(),
    })
    state.daemon = null
    return {
      error,
    }
  }
}

export function stopDaemon(): Promise<MaybeError> {
  return new Promise((resolve) => {
    if (!state.daemon) {
      resolve({})
      return
    }

    state.daemon.on('close', () => {
      state.daemon = null
      resolve({})
    })

    state.daemon.on('error', (error) => {
      resolve({ error })
    })

    state.daemon.kill('SIGINT')
  })
}

export function getIsDaemonRunning(): boolean {
  return !!state.daemon && !state.daemon.killed
}

export async function getInstalledVersion(): Promise<string> {
  const versionFilePath = path.join(getDaemonDirectoryPath(), 'version')
  try {
    const version = await fs.promises.readFile(versionFilePath, 'utf8')
    return version
  } catch {
    return 'error: no daemon'
  }
}
