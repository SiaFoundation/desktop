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
import { closeWindow } from './window'

export function initIpc() {
  ipcMain.handle('open-browser', (_, url: string) => {
    shell.openExternal(url)
  })
  ipcMain.handle('window-close', () => {
    closeWindow()
  })
  ipcMain.handle('daemon-start', async (_) => {
    await startDaemon()
  })
  ipcMain.handle('daemon-stop', async (_) => {
    await stopDaemon()
  })
  ipcMain.handle('daemon-is-running', (_) => {
    return getIsDaemonRunning()
  })
  ipcMain.handle('config-get', (_) => {
    const config = getConfig()
    return config
  })
  ipcMain.handle('get-is-configured', (_) => {
    return getIsConfigured()
  })
  ipcMain.handle('open-data-directory', (_) => {
    shell.openPath(getDefaultDataPath())
    return true
  })
  ipcMain.handle('get-default-data-directory', async (_) => {
    await fs.promises.mkdir(getDefaultDataPath(), { recursive: true })
    return getDefaultDataPath()
  })
  ipcMain.handle('get-installed-version', (_) => {
    return getInstalledVersion()
  })
  ipcMain.handle('config-save', async (_, config: Config) => {
    await saveConfig(config)
    return true
  })
}
