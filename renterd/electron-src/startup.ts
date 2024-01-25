import { shell } from 'electron'
import { startDaemon } from './daemon'
import { getConfig, getIsConfigured } from './config'
import { state, system } from './state'

export function startup() {
  // If the app is already configured, start the daemon and open browser
  // and do not show the configuration window.
  if (getIsConfigured()) {
    startDaemon()
    state.mainWindow?.close()
    shell.openExternal(`http://${getConfig().http.address}`)
  }

  if (system.isDev) {
    state.mainWindow?.setMaximumSize(2000, 2000)
    state.mainWindow?.setSize(1000, 800)
    state.mainWindow?.webContents.openDevTools()
  }
}
