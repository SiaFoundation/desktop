import { Config } from './components/useConfigData'

type MaybeError = { error?: Error }

export interface API {
  closeWindow: () => Promise<void>
  checkIsDaemonRunning: () => Promise<boolean>
  openBrowser: (url: string) => Promise<void>
  daemonStart: () => Promise<MaybeError>
  daemonStop: () => Promise<MaybeError>
  getConfig: () => Promise<Config>
  openDataDirectory: () => Promise<void>
  getIsConfigured: () => Promise<boolean>
  getDefaultDataDirectory: () => Promise<string>
  getInstalledVersion: () => Promise<string>
  saveConfig: (config: Config) => Promise<MaybeError>
}

declare global {
  interface Window {
    electron: API
  }
}
