import { app, Tray, Menu } from 'electron'
import { state } from './state'
import { system } from './system'
import { getAsset } from './asset'
import { daemonName } from './constants'

export function initTray() {
  const iconName = system.isDarwin ? 'tray-Template.png' : 'tray-win.png'
  const iconPath = getAsset(iconName)

  state.tray = new Tray(iconPath)
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Configure',
      click: () => {
        if (system.isDarwin) {
          app.dock.show()
        }
        showWindow()
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      },
    },
  ])
  state.tray.setToolTip(daemonName)
  state.tray.setContextMenu(trayContextMenu)
  // On Windows and Linux the context menu is triggered with a right-click.
  // This makes left-click open the main window.
  state.tray.on('click', () => {
    if (system.isDarwin) {
      return
    }
    showWindow()
  })
}

function showWindow() {
  if (state.mainWindow) {
    if (state.mainWindow.isMinimized()) {
      state.mainWindow.restore()
    }
    state.mainWindow.isVisible()
      ? state.mainWindow.focus()
      : state.mainWindow.show()
  }
}
