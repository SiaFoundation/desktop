import { app, autoUpdater, globalShortcut } from 'electron'
import { stopDaemon } from './daemon'
import { initTray } from './tray'
import { state } from './state'
import { initWindow } from './window'
import { initShortcuts } from './shortcuts'
import { initIpc } from './ipc'
import { startup } from './startup'
import { prepareNext } from './next'
import { UpdateSourceType, updateElectronApp } from 'update-electron-app'
import { daemonName } from './constants'

// Windows: https://github.com/mongodb-js/electron-squirrel-startup
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit()
}

if (app.requestSingleInstanceLock()) {
  // Auto updates
  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.StaticStorage,
      baseUrl: `https://releases.sia.tools/${daemonName}/${process.platform}/${process.arch}`,
    },
  })

  initIpc()

  app.on('ready', async () => {
    await prepareNext('./renderer')
    initWindow()
    initTray()
    initShortcuts()
    startup()
  })

  // Emitted after app.quit is called and before windows are closed.
  app.on('before-quit', async (event?: { preventDefault: () => void }) => {
    if (!state.isQuitting) {
      // Events do not support waiting for asynchronous operations to complete.
      // Instead we cancel the quit event with preventDefault, call quitDaemonAndApp,
      // and then call app.quit() again to atually quit the app. After the second
      // call to app.quit(), isQuitting will be set to true, and the app will quit.
      event?.preventDefault()
      await quitDaemonAndApp()
      app.quit()
    }
  })

  // https://www.electronjs.org/docs/latest/api/app#event-before-quit
  // When restarting from an automatic update before-quit is
  // not called **before** all windows are closed, so we must instead
  // use this autoUpdater event to call quitDaemonAndApp.
  autoUpdater.on(
    'before-quit-for-update',
    async (event?: { preventDefault: () => void }) => {
      if (!state.isQuitting) {
        event?.preventDefault()
        await quitDaemonAndApp()
        autoUpdater.quitAndInstall()
      }
    }
  )

  app.on('will-quit', async () => {
    // Unregister the shortcut when the application is about to quit.
    globalShortcut.unregisterAll()

    // https://www.electronjs.org/docs/latest/api/app#event-before-quit
    // Note: On Windows, 'before-quit' event will not be emitted if the app is
    // closed due to a shutdown/restart of the system or a user logout.
    // Adding this extra attempt to quit the app for windows, but there is no
    // guarantee that this will run before the app is killed.
    if (!state.isQuitting) {
      await quitDaemonAndApp()
    }
  })

  // The default behavior of this event is to quit the app when all windows are closed.
  // Because closeMainWindow does not actually close the window, this event is
  // never used to quit the app, overriding it with a no-op to make this clear.
  app.on('window-all-closed', () => {})
} else {
  app.quit()
}

async function quitDaemonAndApp() {
  state.isQuitting = true
  await stopDaemon()
  state.mainWindow = null
}
