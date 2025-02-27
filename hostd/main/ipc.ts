import fs from 'fs'
import { ipcMain, shell } from 'electron'
import {
  getInstalledVersion,
  getIsDaemonRunning,
  startDaemon,
  stopDaemon,
} from './daemon'
import {
  Config,
  getConfig,
  getDefaultDataPath,
  getIsConfigured,
  saveConfig,
} from './config'
import { closeMainWindow } from './window'
import { state } from './state'
import path from 'path'

export function initIpc() {
  ipcMain.handle('open-browser', (_, url: string) => {
    shell.openExternal(url)
  })
  ipcMain.handle('window-close', () => {
    closeMainWindow()
  })
  ipcMain.handle('daemon-start', async () => {
    return startDaemon()
  })
  ipcMain.handle('daemon-stop', async () => {
    return stopDaemon()
  })
  ipcMain.handle('daemon-is-running', () => {
    return getIsDaemonRunning()
  })
  ipcMain.handle('config-get', () => {
    const config = getConfig()
    return config
  })
  ipcMain.handle('get-is-configured', () => {
    return getIsConfigured()
  })
  ipcMain.handle('open-data-directory', () => {
    const config = getConfig()
    shell.openPath(config.directory)
    return true
  })
  ipcMain.handle('get-default-data-directory', async () => {
    await fs.promises.mkdir(getDefaultDataPath(), { recursive: true })
    return getDefaultDataPath()
  })
  ipcMain.handle('get-installed-version', () => {
    return getInstalledVersion()
  })
  ipcMain.handle('config-save', async (_, config: Config) => {
    await saveConfig(config)
    return true
  })
  ipcMain.handle('get-daemon-logs', () => {
    return state.daemonLogs
  })
  ipcMain.handle('clear-daemon-logs', () => {
    state.daemonLogs = []
    return true
  })
  ipcMain.handle('open-log-file', () => {
    const config = getConfig()
    const logPath = path.join(config.directory, 'hostd.log')
    if (fs.existsSync(logPath)) {
      return shell.openPath(logPath)
    }
    return false
  })
}
