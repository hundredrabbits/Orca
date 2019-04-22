const { app, BrowserWindow, webFrame, Menu } = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const fs = require('fs')

let isShown = true
let windowState = false
app.win = null

const userWindowState = `${app.getPath('userData')}/window-state.json`
if (fs.existsSync(userWindowState)) windowState = JSON.parse(fs.readFileSync(userWindowState))

app.on('ready', () => {
  app.win = new BrowserWindow({
    width: windowState ? windowState.width : 710,
    height: windowState ? windowState.height : 470,
    x: windowState && windowState.x,
    y: windowState && windowState.y,
    minWidth: 310,
    minHeight: 350,
    backgroundColor: '#000',
    icon: __dirname + '/' + { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico',
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: { zoomFactor: 1.0 },
    webPreferences: { backgroundThrottling: false }
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })

  app.win.on('resize', () => {
    updateWindowState()
  })
  
  app.win.on('move', () => {
    updateWindowState()
  })

})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleMenubar = function () {
  app.win.setMenuBarVisibility(!app.win.isMenuBarVisible())
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleVisible = function () {
  if (process.platform === 'darwin') {
    if (isShown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  } else {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}

const updateWindowState = () => {
  fs.writeFileSync(userWindowState, JSON.stringify(app.win.getBounds()))
}