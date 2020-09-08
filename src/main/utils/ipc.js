import {app, ipcMain, dialog} from "electron";
import {Client} from "./ssh";
import {SshManager} from "./ssh-manager";

const os = require("os");

const sshManager = new SshManager();

export default () => {

    ipcMain.on('connect', (event, id, host, username, privateKey, port, rules) => {
        const client = new Client(id, host, username, privateKey, port)

        rules.forEach((rule) => {
            client.addRule(rule.local.address, rule.local.port, rule.target.address, rule.target.port)
        })

        // Event handlers
        client.handleConnected((id) => event.sender.send('connected', id))
        client.handleDisconnected((id) => event.sender.send('disconnected', id))
        client.handleError( (id, error) => event.sender.send('error', id, error))

        // Start the tunneling and register the disconnect func.
        sshManager.registerDisconnectCallback(id, client.connect());
    })

    ipcMain.on('disconnect', (event, id) => {
        sshManager.callDisconnectCallback(id)
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