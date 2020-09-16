const privateKeyDialog = () => {
    return new Promise((resolve, reject) => {
        window.ipc.on('privateKeyDialog.response', (event, arg) =>
            arg instanceof Error ? reject(arg) : resolve(arg)
        );

        window.ipc.send('privateKeyDialog');
    });
}

const tray = (tunnels) => {
    window.ipc.send('tray', tunnels);
}

const isConnected = (id) => {
    return new Promise((resolve, reject) => {
        window.ipc.on('isConnected.response', (event, arg) =>
          arg instanceof Error ? reject(arg) : resolve(arg)
        );

        window.ipc.send('isConnected', id);
    });
}

const register = (tunnel) => {
    window.ipc.send('register', tunnel)
}

const connect = (tunnel) => {
    window.ipc.send('connect', tunnel);
};

const connected = (handler) => {
    window.ipc.on('connected', (event, ...args) => handler(...args))
}

const disconnect = (tunnel) => {
    window.ipc.send('disconnect', tunnel)
}

const disconnected = (handler) => {
    window.ipc.on('disconnected', (event, ...args) => handler(...args))
}

const error = (handler) => {
    window.ipc.on('error', (event, ...args) => handler(...args))
}

const readConfig = () => {
    return new Promise((resolve, reject) => {
        window.ipc.once('config.read.response', (event, arg) =>
            arg instanceof Error ? reject(arg) : resolve(arg)
        );

        window.ipc.send('config.read');
    });
}

const writeConfig = (config) => window.ipc.send('config.write', config)

export default {
    privateKeyDialog,
    isConnected,
    tray,
    register,
    connect,
    connected,
    disconnect,
    disconnected,
    error,
    readConfig,
    writeConfig,
}
