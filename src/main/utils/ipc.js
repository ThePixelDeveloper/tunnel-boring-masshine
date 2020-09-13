import {app, ipcMain, dialog, Menu} from "electron";
import {Client} from "../services/ssh";
import {SshCollection} from "../services/ssh-collection";

const os = require("os");

const sshManager = new SshCollection();

function connect(event, id, tunnel) {
    const client = new Client(tunnel)

    // Event handlers
    client.handleConnected((id) => event.sender.send('connected', id))
    client.handleDisconnected((id) => event.sender.send('disconnected', id))
    client.handleError( (id, error) => event.sender.send('error', id, error))

    // Start the tunneling and register the disconnect func.
    sshManager.registerDisconnectCallback(client.connect());
}

export default (tray) => {

    ipcMain.on('connect', (event, tunnel) => {
        for (const [id, tunnel] of Object.entries(tunnel)) {
            connect(event, id, tunnel)    
        }
        
    })

    ipcMain.on('disconnect', (event, id) => {
        sshManager.callDisconnectCallback(id)
    })

    ipcMain.on('isConnected', (event, id) => {
        event.sender.send('isConnected.response', sshManager.isConnected(id))
    })
    
    ipcMain.on('tray', (event, tunnels) => {
        let trayItems = []
        
        for (const [id, tunnel] of Object.entries(tunnels)) {
            trayItems.push({
                label: tunnel.name,
                icon: tunnel.status.toLowerCase()+".png",
                click: () => connect(event, {[id]: tunnel}),
            })
        }
        
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
