import { spawn } from 'child_process'
import { state } from './state'
import { getConfig, getConfigFilePath } from './config'
import { getBinaryFilePath, getDaemonDirectoryPath } from './binary'
import path from 'path'
import fs from 'fs'
import { MaybeError } from './types'

const configFileVariableName = 'HOSTD_CONFIG_FILE'

export async function startDaemon(): Promise<MaybeError> {
  try {
    await stopDaemon()
    const config = getConfig()
    const binaryFilePath = getBinaryFilePath()
    state.daemon = spawn(binaryFilePath, [], {
      env: { ...process.env, [configFileVariableName]: getConfigFilePath() },
      cwd: config.directory,
    })

    let startupError: Error | null = null

    state.daemon.stdout?.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    state.daemon.stderr?.on('data', (data) => {
      console.error(`stderr: ${data}`)
      startupError = new Error(data)
    })

    state.daemon.on('error', (error) => {
      console.log(`child process exited with error ${error}`)
      state.daemon = null
      startupError = error
    })

    state.daemon.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      state.daemon = null
    })

    // Wait 3 seconds in case there is an startup error.
    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (startupError) {
      return {
        error: startupError,
      }
    }

    return {}
  } catch (err) {
    state.daemon = null
    return {
      error: err as Error,
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
  } catch (e) {
    return 'error: no daemon'
  }
}
