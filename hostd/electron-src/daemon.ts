import { spawn } from 'child_process'
import { state } from './state'
import { getBinaryFilePath, getConfig, getConfigFilePath } from './config'
import axios from 'axios'

export function startDaemon(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await stopDaemon()

    try {
      const config = getConfig()
      const binaryFilePath = getBinaryFilePath()
      state.process = spawn(binaryFilePath, ['-env'], {
        env: { ...process.env, HOSTD_CONFIG_FILE: getConfigFilePath() },
        cwd: config.directory,
      })

      state.process.stdout?.on('data', (data) => {
        console.log(`stdout: ${data}`)
        // Emit events or log data as needed
      })

      state.process.stderr?.on('data', (data) => {
        console.error(`stderr: ${data}`)
        // Emit events or log data as needed
      })

      state.process.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        state.process = null
      })

      resolve()
    } catch (err) {
      state.process = null
      reject(err)
    }
  })
}

export function stopDaemon(): Promise<void> {
  return new Promise((resolve) => {
    if (!state.process) {
      resolve()
      return
    }

    state.process.on('close', () => {
      state.process = null
      resolve()
    })

    state.process.kill('SIGINT')
  })
}

export function getIsDaemonRunning(): boolean {
  return !!state.process && !state.process.killed
}

export async function getInstalledVersion(): Promise<string> {
  if (!getIsDaemonRunning()) {
    return ''
  }
  const config = getConfig()
  let address = config.http.address
    ? 'http://' + config.http.address
    : 'http://127.0.0.1:9980'

  // localhost tries to uses ipv6, which the daemon does not support
  address = address.replace('http://localhost:', 'http://127.0.0.1:')

  try {
    const auth = Buffer.from(`:${config.http.password}`).toString('base64')
    const response = await axios.get<{ version: string }>(
      address + '/api/state/host',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }
    )
    return response.data.version
  } catch (err) {
    console.error(err)
    return ''
  }
}
