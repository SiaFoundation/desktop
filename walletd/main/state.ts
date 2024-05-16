import { ChildProcess } from 'child_process'
import { BrowserWindow, Tray } from 'electron'

export const state: {
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
