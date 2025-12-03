import { join } from 'path'
import { BrowserWindow, app } from 'electron'
import { format } from 'url'
import { state } from './state'
import { system } from './system'
import { getAsset, getResourceAsarPath } from './asset'
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
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  state.mainWindow.on('close', closeMainWindow)

  const url = env.isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: getResourceAsarPath('renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  state.mainWindow.loadURL(url)
}

// Hide the main window instead of closing it, to keep the app running in the tray.
export function closeMainWindow(event?: { preventDefault: () => void }) {
  if (!state.isQuitting) {
    event?.preventDefault()
    if (system.isDarwin) {
      // Hide the application icon in the dock. This is different from the
      // mainWindow.hide() method, which hides the main window.
      app.dock?.hide()
    }
    // Hides the main window, the window will no longer show in the taskbar,
    // but the window is not closed, it is still running in the background.
    state.mainWindow?.hide()
  }
}
