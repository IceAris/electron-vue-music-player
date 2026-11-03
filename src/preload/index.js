import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld('ImportandPlaymusicAPI', { 
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog')
})