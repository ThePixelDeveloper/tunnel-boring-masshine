export class SshManager {
    constructor() {
        this.callbacks = []
    }

    registerDisconnectCallback(id, disconnect) {
        this.callbacks.push({id, disconnect})
    }
    
    isConnected(id) {
        return this.callbacks.find((callback) => callback.id === id) !== undefined
    }

    callDisconnectCallback(id) {
        this.callbacks.forEach((callback, index) => {
            if (id === callback.id) {
                callback.disconnect(id)
                this.callbacks.splice(index, 1)
            }
        })
    }
}
