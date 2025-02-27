import { ChildProcess } from 'child_process'
import { BrowserWindow, Tray } from 'electron'
import { DaemonLog } from './logs'

export const state: {
  mainWindow: BrowserWindow | null
  tray: Tray | null
  daemon: ChildProcess | null
  isQuitting: boolean
  daemonLogs: DaemonLog[]
} = {
  mainWindow: null,
  tray: null,
  isQuitting: false,
  daemon: null,
  daemonLogs: [],
}

export function addDaemonLog(log: DaemonLog) {
  // Ensure there are never more than 1000 logs.
  if (state.daemonLogs.length > 1000) {
    state.daemonLogs.shift()
  }
  state.daemonLogs.push(log)
}
