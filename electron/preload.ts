import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    loadData: () => ipcRenderer.invoke('load-data'),
    saveData: (key: string, value: any) => ipcRenderer.invoke('save-data', key, value),
});
