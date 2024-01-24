import path, { join } from 'path'
import {
  BrowserWindow,
  app,
  ipcMain,
  shell,
  Tray,
  Menu,
  globalShortcut,
} from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import {
  getInstalledVersion,
  getIsDaemonRunning,
  startDaemon,
  stopDaemon,
} from './daemon'
import { downloadRelease, getLatestVersion } from './download'
import {
  Config,
  doesBinaryExist,
  getConfig,
  getDefaultDataPath,
  getIsConfigured,
  saveConfig,
} from './config'
import { state } from './state'
import { format } from 'url'

let mainWindow: BrowserWindow | null = null
let appIcon = null
const isDarwin = process.platform === 'darwin'
const isLinux = process.platform === 'linux'
let isQuitting = false
// const isWindows = process.platform === 'win32'

app.on('ready', async () => {
  await prepareNext('./renderer')

  mainWindow = new BrowserWindow({
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
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      if (isDarwin) {
        app.dock.hide()
      }
      mainWindow?.hide()
    }
  })

  // Setup close to tray settings for both minimize and close events
  mainWindow.on('minimize', () => {
    if (isDarwin) {
      app.dock.hide()
    }
    // TODO: Does Linux support tray?
    // https://electronjs.org/docs/api/tray
    // minimize instead of attempting to go to system tray.
    if (isLinux) {
      return true
    }
    mainWindow?.hide()
    return false
  })

  const iconName = isDarwin ? 'tray.png' : 'tray-win.png'
  const iconPath = isDev
    ? path.join(process.cwd(), 'assets', iconName)
    : path.join(__dirname, '../assets', iconName)

  appIcon = new Tray(iconPath)
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Configure',
      click: function () {
        if (isDarwin) {
          app.dock.show()
        }
        mainWindow?.show()
      },
    },
    {
      label: 'Quit',
      click: function () {
        isQuitting = true
        mainWindow = null
        state.process?.kill()
        app.quit()
      },
    },
  ])
  appIcon.setToolTip('renterd')
  appIcon.setContextMenu(trayContextMenu)
  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: path.join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.setMaximumSize(2000, 2000)
    mainWindow.setSize(1000, 800)
    mainWindow.webContents.openDevTools()
  }

  const needsDownload = !doesBinaryExist()
  if (needsDownload) {
    await downloadRelease()
  }

  if (getIsConfigured()) {
    startDaemon()
  }
  // Register a global shortcut listener for the developer tools
  const devToolsShortcut =
    process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I'
  globalShortcut.register(devToolsShortcut, () => {
    // Open the DevTools
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.openDevTools()
      mainWindow.setSize(1000, 800)
      mainWindow.setMaximumSize(2000, 2000)
    }
  })
})

async function quitDaemonAndApp() {
  isQuitting = true
  await stopDaemon()
  mainWindow = null
}

app.on('before-quit', async () => {
  if (!isQuitting) {
    await quitDaemonAndApp()
  }
})

app.on('will-quit', async () => {
  // Unregister the shortcut when the application is about to quit
  globalShortcut.unregisterAll()
})

// Quit the app once all windows are closed
// even though closing windows is not really possible
app.on('window-all-closed', app.quit)

ipcMain.handle('open-browser', (_, url: string) => {
  shell.openExternal(url)
})
ipcMain.handle('daemon-start', async (_) => {
  await startDaemon()
})
ipcMain.handle('daemon-stop', async (_) => {
  await stopDaemon()
})
ipcMain.handle('daemon-is-running', (_) => {
  const isDaemonRunning = getIsDaemonRunning()
  return isDaemonRunning
})
ipcMain.handle('config-get', (_) => {
  const config = getConfig()
  return config
})
ipcMain.handle('get-is-configured', (_) => {
  return getIsConfigured()
})
ipcMain.handle('open-data-directory', (_) => {
  shell.openPath(getDefaultDataPath())
  return true
})
ipcMain.handle('get-default-data-directory', (_) => {
  return getDefaultDataPath()
})
ipcMain.handle('get-installed-version', (_) => {
  return getInstalledVersion()
})
ipcMain.handle('get-latest-version', (_) => {
  return getLatestVersion()
})
ipcMain.handle('config-save', async (_, config: Config) => {
  await saveConfig(config)
  return true
})
