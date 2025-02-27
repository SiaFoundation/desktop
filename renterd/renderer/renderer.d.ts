import { Config } from './components/useConfigData'

type MaybeError = { error?: Error }
type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'
type DaemonLog = {
  timestamp: Date
  level: LogLevel
  source: string
  message: string
  raw: string
}

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
  getDaemonLogs: () => Promise<DaemonLog[]>
  clearDaemonLogs: () => Promise<boolean>
  openLogFile: () => Promise<boolean>
}

declare global {
  interface Window {
    electron: API
  }
}
