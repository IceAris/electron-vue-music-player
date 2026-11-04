import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld('ImportandPlaymusicAPI', { 
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog')
})
contextBridge.exposeInMainWorld('authAPI', {
  login: (username, password) => ipcRenderer.invoke('auth_login', { username, password })
})