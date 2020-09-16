export class SshCollection {
    constructor() {
        this.callbacks = []
        this.clients = []
    }

    registerClient(client) {
        this.clients.push(client)
    }

    isConnected(id) {
        const client = this.clients.find((client) => id === client.id)

        if (client === undefined) {
            return
        }

        return client.isConnected();
    }

    disconnect(id) {
        const client = this.clients.find((client) => id === client.id)

        if (client === undefined) {
            return
        }

        client.disconnect();
    }
}
