/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from 'electron'
import { Config } from './config'

// We are using the context bridge to securely expose NodeAPIs.
// Please note that many Node APIs grant access to local system resources.
// Be very cautious about which globals and APIs you expose to untrusted remote content.
contextBridge.exposeInMainWorld('electron', {
  checkIsDaemonRunning: () => ipcRenderer.invoke('daemon-is-running'),
  daemonStart: () => ipcRenderer.invoke('daemon-start'),
  daemonStop: () => ipcRenderer.invoke('daemon-stop'),
  daemonUpdate: () => ipcRenderer.invoke('daemon-update'),
  openBrowser: (url: string) => ipcRenderer.invoke('open-browser', url),
  getConfig: () => ipcRenderer.invoke('config-get'),
  saveConfig: (config: Config) => ipcRenderer.invoke('config-save', config),
  openDataDirectory: () => ipcRenderer.invoke('open-data-directory'),
  getIsConfigured: () => ipcRenderer.invoke('get-is-configured'),
  getDefaultDataDirectory: () =>
    ipcRenderer.invoke('get-default-data-directory'),
  getInstalledVersion: () => ipcRenderer.invoke('get-installed-version'),
  getLatestVersion: () => ipcRenderer.invoke('get-latest-version'),
})
