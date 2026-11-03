import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { pathToFileURL } from 'node:url'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false // 禁用安全策略，允许直接加载 file:/// 本地音频
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (is.dev) {
    //mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 窗口全关时正常退出主进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// --- IPC 逻辑部分 ---


//选取音乐文件
ipcMain.handle('open-file-dialog', () => {
  console.log('Open file dialog requested in main process')

  const filePaths = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac'] }
    ]
  })

  const fileURL = filePaths && filePaths.length > 0 ? pathToFileURL(filePaths[0]).href : null
  console.log(fileURL)
  return fileURL
  
})