import { ChildProcess } from 'child_process'
import { BrowserWindow, Tray } from 'electron'

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
  isDarwin: boolean
  isLinux: boolean
  isWindows: boolean
} = {
  isDarwin: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  isWindows: process.platform === 'win32',
}
