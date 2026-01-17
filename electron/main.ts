import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_FILE = path.join(app.getPath('userData'), 'koompi-storage.json');

// Ensure storage file exists
const initStorage = () => {
    if (!fs.existsSync(STORAGE_FILE)) {
        try {
            fs.writeFileSync(STORAGE_FILE, '{}', 'utf-8');
            console.log('Created storage file:', STORAGE_FILE);
        } catch (e) {
            console.error('Failed to create storage file:', e);
        }
    }
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, '../public/icons/koompi.png'), // Try to load icon if exists
        autoHideMenuBar: true,
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
};

app.whenReady().then(() => {
    initStorage();

    // IPC Handlers for Storage
    ipcMain.handle('load-data', () => {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
                return JSON.parse(data);
            }
            return {};
        } catch (e) {
            console.error('Failed to load data:', e);
            return {};
        }
    });

    ipcMain.handle('save-data', (_, key: string, value: any) => {
        try {
            let currentData: any = {};
            if (fs.existsSync(STORAGE_FILE)) {
                currentData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
            }
            currentData[key] = value;
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
            return true;
        } catch (e) {
            console.error('Failed to save data:', e);
            return false;
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
