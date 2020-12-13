const { app, BrowserWindow } = require('electron');
const settings = require('electron-app-settings');
const express = require('express');
const fs = require('fs');
const multer = require('multer');

const webctrl = express();
var upload = multer({dest: 'upload/'});

var win;
var fname = settings.get('disp') || 'index.html';

if (!fs.existsSync(__dirname + 'upload/')) {
    fs.mkdirSync(__dirname + 'upload/');
}

if (fname == 'index.html') {

}

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        //fullscreen: true,
        //kiosk: true,
        autoHideMenuBar: true
    });

    win.loadFile(fname);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

webctrl.get('/', (req, res) => {
    res.send('<form action="/up" method="post" enctype="multipart/form-data"><input type="file" name="newsite" /><input type="submit" value="Update" name="sub"/></form>');
});

webctrl.post('/up', upload.single('newsite'), (req, res, next) => {
    fs.renameSync(req.file.path, 'upload\\' + req.file.filename + '.html');
    win.loadFile('upload\\' + req.file.filename + '.html');
    settings.set("disp", 'upload\\' + req.file.filename + '.html');
    res.redirect('/');
});

webctrl.listen(3003, () => {
    console.log("listening");
});