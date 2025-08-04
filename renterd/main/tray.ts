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
          app.dock?.show()
        }
        state.mainWindow?.show()
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
    if (state.mainWindow) {
      if (state.mainWindow.isMinimized()) {
        state.mainWindow.restore()
      }
      if (state.mainWindow.isVisible()) {
        state.mainWindow.focus()
      } else {
        state.mainWindow.show()
      }
    }
  })
}
