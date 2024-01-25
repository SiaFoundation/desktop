import { app, globalShortcut } from 'electron'
import prepareNext from 'electron-next'
import { startDaemon, stopDaemon } from './daemon'
import { downloadRelease } from './download'
import { doesBinaryExist, getIsConfigured } from './config'
import { initTray } from './tray'
import { state } from './state'
import { initWindow } from './window'
import { initShortcuts } from './shortcuts'
import { initIpc } from './ipc'

app.on('ready', async () => {
  await prepareNext('./renderer')
  initWindow()
  initTray()
  initShortcuts()
  initIpc()

  const needsInitialDownload = !doesBinaryExist()
  if (needsInitialDownload) {
    await downloadRelease()
  }

  // If the app is already configured, start the daemon and open browser
  // and do not show the configuration window.
  if (getIsConfigured()) {
    startDaemon()
    state.mainWindow?.close()
  }
})

app.on('before-quit', async () => {
  if (!state.isQuitting) {
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

async function quitDaemonAndApp() {
  state.isQuitting = true
  await stopDaemon()
  state.mainWindow = null
}
