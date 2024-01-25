import { app, globalShortcut } from 'electron'
import prepareNext from 'electron-next'
import { stopDaemon } from './daemon'
import { initTray } from './tray'
import { state } from './state'
import { initWindow } from './window'
import { initShortcuts } from './shortcuts'
import { initIpc } from './ipc'
import { startup } from './startup'

app.on('ready', async () => {
  await prepareNext('./renderer')
  initWindow()
  initTray()
  initShortcuts()
  initIpc()
  startup()
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