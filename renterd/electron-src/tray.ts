import path from 'path'
import { app, Tray, Menu } from 'electron'
import isDev from 'electron-is-dev'
import { state, system } from './state'

export function initTray() {
  const iconName = system.isDarwin ? 'tray.png' : 'tray-win.png'
  const iconPath = isDev
    ? path.join(process.cwd(), 'assets', iconName)
    : path.join(__dirname, '../assets', iconName)

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
