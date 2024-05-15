import { app, Tray, Menu } from 'electron'
import { state } from './state'
import { system } from './system'
import { getAsset } from './asset'

export function initTray() {
  const iconName = system.isDarwin ? 'tray.png' : 'tray-win.png'
  const iconPath = getAsset(iconName)

  state.tray = new Tray(iconPath)
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Configure',
      click: function () {
        if (system.isDarwin) {
          app.dock.show()
        }
        state.mainWindow?.show()
      },
    },
    {
      label: 'Quit',
      click: function () {
        app.quit()
      },
    },
  ])
  state.tray.setToolTip('hostd')
  state.tray.setContextMenu(trayContextMenu)
}
