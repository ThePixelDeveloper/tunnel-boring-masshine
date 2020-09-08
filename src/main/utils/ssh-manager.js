export class SshManager {
    constructor() {
        this.callbacks = []
    }

    registerDisconnectCallback(id, disconnect) {
        this.callbacks.push({id, disconnect})
    }

    callDisconnectCallback(id) {
        this.callbacks.forEach((callback) => {
            if (id === callback.id) {
                callback.disconnect(id)
            }
        })
    }
}