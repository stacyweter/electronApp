const electron = require ('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
var remote = require('electron').remote;
//var dialog = remote.dialog;

const {app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow;
let addWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:', 
        slashes: true
    }))
    mainWindow.on('closed', function(){
        app.quit();
    })
    const mainMenu = Menu.buildFromTemplate(myMenu);
    Menu.setApplicationMenu(mainMenu);
});



function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Task'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:', 
        slashes: true
    }))
    addWindow.on('close', function(){
        addWindow = null;
    })
};

/*function openFile(){
    remote.dialog.showOpenDialog((filenames), function(){
        if(filenames === undefined){
            alert("No files selected");
            return;
        }
       readfile(filenames[0]);
    });
}; 

function readfile(filepath){
    fs.readfile(filepath, 'utf-8', (err, data), function(){
        if (err) {
            alert("Error retrieving file");
            return;
        }

        var content = document.getElementById('ul');
        content.innerHTML = data;

    })
} */

ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

const myMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){
                    openFile();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T', 
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ],
    },
    {
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle Dev Tools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',        
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
    }
];

if(process.platform == 'darwin'){
    myMenu.unshift({});
}