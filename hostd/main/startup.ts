import { startDaemon } from './daemon'
import { getIsConfigured } from './config'
import { state } from './state'
import { env } from './env'

export async function startup() {
  // If the app is already configured, start the daemon and open browser
  // and do not show the configuration window.
  if (getIsConfigured()) {
    const { error } = await startDaemon()
    if (error) {
      return
    }
    state.mainWindow?.close()
  }

  if (env.isDev) {
    state.mainWindow?.setMaximumSize(2000, 2000)
    state.mainWindow?.setSize(1000, 800)
    state.mainWindow?.webContents.openDevTools()
  }
}
