export class SshCollection {
    constructor() {
        this.callbacks = []
    }

    registerDisconnectCallback(payload) {
        this.callbacks.push(payload)
    }
    
    isConnected(id) {
        return this.callbacks.find((callback) => callback.id === id) !== undefined
    }

    callDisconnectCallback(id) {
        this.callbacks.forEach((callback, index) => {
            if (id === callback.id) {
                callback.close()
                this.callbacks.splice(index, 1)
            }
        })
    }
}
