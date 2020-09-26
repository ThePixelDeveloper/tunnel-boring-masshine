import {app, dialog, ipcMain, Menu} from "electron";
import {SshCollection} from "../services/ssh-collection";

const os = require("os");

const sshCollection = new SshCollection();

export default (tray) => {

    ipcMain.on('register', (event, tunnel) => {
        function disconnected(id) {
            return event.sender.send('disconnected', id);
        }

        function error(id, error) {
            return event.sender.send('error', id, error);
        }

        function connected(id) {
            return event.sender.send('connected', id);
        }

        sshCollection.register(tunnel, connected, disconnected, error)
    })

    ipcMain.on('connect', (event, tunnel) => {
        sshCollection.connect(tunnel)
    })

    ipcMain.on('disconnect', (event, tunnel) => {
        sshCollection.disconnect(tunnel)
    })

    ipcMain.on('isConnected', (event, tunnel) => {
        event.sender.send('isConnected.response',
            sshCollection.isConnected(tunnel),
        )
    })
    
    ipcMain.on('tray', (event, tunnels) => {
        let trayItems = []

        tunnels.forEach((tunnel) => {
            trayItems.push({
                label: tunnel.name,
                icon: tunnel.status.toLowerCase()+".png",
                click: () => sshCollection.connect(tunnel),
            })
        })

        tray.setToolTip('This is my application.')
        tray.setContextMenu(Menu.buildFromTemplate(
            [
              ...[
                  { label: 'Connect All', enabled: false, },
                  { label: 'Disconnect All ', enabled: false, },
                  { type: 'separator', },
                ],
                ...trayItems
            ]
          )
        )
    })

    ipcMain.on('privateKeyDialog', async (event) => {
        const privateKey = dialog.showOpenDialogSync({
            defaultPath: os.homedir() + '/.ssh',
            properties: ['openFile', 'showHiddenFiles', 'dontAddToRecent']
        })

        if (privateKey !== undefined && privateKey.length === 1) {
            event.sender.send('privateKeyDialog.response', privateKey[0])
        }
    })

    ipcMain.on('config.read', async (event) => {
        const path = require('path').join(app.getPath('userData'), 'tunnels.json')

        try {
            await require('fs').promises.access(path)

            event.sender.send('config.read.response', JSON.parse(await require('fs').promises.readFile(path, 'utf-8')))
        } catch (e) {
            event.sender.send('config.read.response', e)
        }
    })

    ipcMain.on('config.write', async (event, config) => {
        const tunnelsPath = require('path').join(app.getPath('userData'), 'tunnels.json')
        return await require('fs').promises.writeFile(tunnelsPath, JSON.stringify(config))
    })
}
