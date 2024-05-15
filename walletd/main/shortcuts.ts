import { globalShortcut } from 'electron'
import { state } from './state'
import { system } from './system'

export function initShortcuts() {
  // Register a global shortcut listener for the developer tools
  const devToolsShortcut = system.isDarwin ? 'Cmd+Alt+I' : 'Ctrl+Shift+I'
  globalShortcut.register(devToolsShortcut, () => {
    // Open the DevTools
    if (state.mainWindow && state.mainWindow.webContents) {
      state.mainWindow.webContents.openDevTools()
      state.mainWindow.setSize(1000, 800)
      state.mainWindow.setMaximumSize(2000, 2000)
    }
  })
}
