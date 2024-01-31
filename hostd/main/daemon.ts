import { spawn } from 'child_process'
import { state } from './state'
import { getConfig, getConfigFilePath } from './config'
import path from 'path'
import fs from 'fs'
import { getBinaryDirectoryPath, getBinaryFilePath } from './binary'

export async function startDaemon(): Promise<void> {
  try {
    await stopDaemon()
    const config = getConfig()
    const binaryFilePath = getBinaryFilePath()
    state.daemon = spawn(binaryFilePath, ['-env'], {
      env: { ...process.env, HOSTD_CONFIG_FILE: getConfigFilePath() },
      cwd: config.directory,
    })

    state.daemon.stdout?.on('data', (data) => {
      console.log(`stdout: ${data}`)
      // Emit events or log data as needed
    })

    state.daemon.stderr?.on('data', (data) => {
      console.error(`stderr: ${data}`)
      // Emit events or log data as needed
    })

    state.daemon.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      state.daemon = null
    })
  } catch (err) {
    console.log('Failed to start daemon', err)
    state.daemon = null
    throw err
  }
}

export function stopDaemon(): Promise<void> {
  return new Promise((resolve) => {
    if (!state.daemon) {
      resolve()
      return
    }

    state.daemon.on('close', () => {
      state.daemon = null
      resolve()
    })

    state.daemon.kill('SIGINT')
  })
}

export function getIsDaemonRunning(): boolean {
  return !!state.daemon && !state.daemon.killed
}

export async function getInstalledVersion(): Promise<string> {
  const versionFilePath = path.join(getBinaryDirectoryPath(), 'version')
  try {
    const version = await fs.promises.readFile(versionFilePath, 'utf8')
    return version
  } catch (e) {
    return 'error: no daemon'
  }
}
