import { Config } from './components/useConfigData'

export interface API {
  checkIsDaemonRunning: () => Promise<boolean>
  openBrowser: (url: string) => Promise<void>
  daemonStart: () => Promise<void>
  daemonStop: () => Promise<void>
  getConfig: () => Promise<Config>
  openDataDirectory: () => Promise<void>
  getIsConfigured: () => Promise<boolean>
  getDefaultDataDirectory: () => Promise<string>
  getInstalledVersion: () => Promise<string>
  getLatestVersion: () => Promise<string>
  saveConfig: (config: Config) => Promise<void>
}

declare global {
  interface Window {
    electron: API
  }
}
