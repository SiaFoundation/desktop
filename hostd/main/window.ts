import path, { join } from 'path'
import { BrowserWindow, app } from 'electron'
import { format } from 'url'
import { state } from './state'
import { system } from './system'
import { getAsset } from './asset'
import { env } from './env'

export function initWindow() {
  state.mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    maxWidth: 500,
    maxHeight: 800,
    // https://www.electronforge.io/guides/create-and-add-icons
    // Linux: The icon must be additionally loaded when instantiating your BrowserWindow.
    icon: getAsset('icons/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  // Hide the main window instead of closing it, to keep the app running in the tray
  state.mainWindow.on('close', closeWindow)

  const url = env.isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: path.join(__dirname, '../../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  state.mainWindow.loadURL(url)
}

export function closeWindow(event?: { preventDefault: () => void }) {
  if (!state.isQuitting) {
    event?.preventDefault()
    if (system.isDarwin) {
      app.dock.hide()
    }
    state.mainWindow?.hide()
  }
}
