import { startDaemon } from './daemon'
import { getIsConfigured } from './config'
import { state } from './state'

export function startup() {
  // If the app is already configured, start the daemon and open browser
  // and do not show the configuration window.
  if (getIsConfigured()) {
    startDaemon()
    state.mainWindow?.close()
  }
}
