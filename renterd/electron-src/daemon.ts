import { spawn } from 'child_process'
import { state } from './state'
import { getBinaryFilePath, getConfig, getConfigFilePath } from './config'
import axios from 'axios'
import { Octokit } from '@octokit/rest'

export function startDaemon(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await stopDaemon()

    try {
      const config = getConfig()
      const binaryFilePath = getBinaryFilePath()
      state.daemon = spawn(binaryFilePath, [], {
        env: { ...process.env, RENTERD_CONFIG_FILE: getConfigFilePath() },
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

      resolve()
    } catch (err) {
      state.daemon = null
      reject(err)
    }
  })
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
    const response = await axios.get<{ version: string }>(
      address + '/api/bus/state',
      {
        headers: {
          Authorization: 'Basic ' + btoa(':' + config.http.password),
        },
      }
    )
    return response.data.version
  } catch (err) {
    console.error(err)
    return ''
  }
}

export async function getLatestVersion(): Promise<string> {
  try {
    const octokit = new Octokit()
    const response = await octokit.repos.getLatestRelease({
      owner: 'SiaFoundation',
      repo: 'renterd',
    })
    return response.data.tag_name
  } catch (err) {
    console.error(err)
    return ''
  }
}
