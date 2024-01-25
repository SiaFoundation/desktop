import { ChildProcess } from 'child_process'
import { BrowserWindow, Tray } from 'electron'
import isDev from 'electron-is-dev'

export let state: {
  mainWindow: BrowserWindow | null
  tray: Tray | null
  daemon: ChildProcess | null
  isQuitting: boolean
} = {
  mainWindow: null,
  tray: null,
  isQuitting: false,
  daemon: null,
}

export const system: {
  isDev: boolean
  isDarwin: boolean
  isLinux: boolean
  isWindows: boolean
} = {
  isDev: isDev,
  isDarwin: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  isWindows: process.platform === 'win32',
}
