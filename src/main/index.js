import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { pathToFileURL } from 'node:url'
//引入剛才在 database.js 寫好的查庫函數
import { validateUser } from './db.js'

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
    // mainWindow.webContents.openDevTools()
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

// 选取音乐文件
ipcMain.handle('open-file-dialog', () => {
  console.log('Open file dialog requested in main process')

  const filePaths = dialog.showOpenDialogSync({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac'] }
    ]
  })

  // 如果用户点了取消，直接返回空数组
  if (!filePaths) return []

  // map 的回调规范默认提供 3 个参数 (value, index, array)
 // 这里只声明需要的第 1 个参数 filePath，JS 会自动忽略后续未声明的 index 和 array
  return filePaths.map((filePath) => {
   return pathToFileURL(filePath).href
  })

})

// 註冊一個專門處理登入的頻道：'auth_login'
ipcMain.handle('auth_login', async (event, { username, password }) => {
  // 呼叫你的資料庫查詢，這裡可以用 await 啦！
  const isValid = await validateUser(username, password)
  
  // 回傳布林值給前端
  return isValid
})