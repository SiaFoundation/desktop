import path, { join } from 'path'
import { BrowserWindow, app } from 'electron'
import { format } from 'url'
import { state, system } from './state'

export function initWindow() {
  state.mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    maxWidth: 500,
    maxHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  // Hide the main window instead of closing it, to keep the app running in the tray
  state.mainWindow.on('close', (event) => {
    if (!state.isQuitting) {
      event.preventDefault()
      if (system.isDarwin) {
        app.dock.hide()
      }
      state.mainWindow?.hide()
    }
  })

  // Setup close to tray settings for both minimize and close events
  state.mainWindow.on('minimize', () => {
    if (system.isDarwin) {
      app.dock.hide()
    }
    // TODO: Does Linux support tray?
    // https://electronjs.org/docs/api/tray
    // minimize instead of attempting to go to system tray
    if (system.isLinux) {
      return true
    }
    state.mainWindow?.hide()
    return false
  })

  const url = system.isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: path.join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  state.mainWindow.loadURL(url)
}
