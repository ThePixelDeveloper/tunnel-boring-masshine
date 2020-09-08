import { timeout } from 'promise-timeout';

const privateKeyDialog = () => {
    return new Promise((resolve, reject) => {
        window.ipc.on('privateKeyDialog.response', (event, arg) =>
            arg instanceof Error ? reject(arg) : resolve(arg)
        );

        window.ipc.send('privateKeyDialog');
    });
}

const connect = (id, hostname, username, privateKey, port, rules) => {
    window.ipc.send('connect', id, hostname, username, privateKey, port, rules);
};

const connected = (handler) => {
    window.ipc.on('connected', (event, ...args) => handler(args))
}

const disconnect = (id) => {
    window.ipc.send('disconnect', id)
}

const disconnected = (handler) => {
    window.ipc.on('disconnected', (event, ...args) => handler(args))
}

const readConfig = () => {
    return timeout(
        new Promise((resolve, reject) => {
            window.ipc.once('config.read.response', (event, arg) =>
                arg instanceof Error ? reject(arg) : resolve(arg)
            );

            window.ipc.send('config.read');
        }),
        1000
    );
}

const writeConfig = (config) => window.ipc.send('config.write', config);

export default {
    privateKeyDialog,
    connect,
    connected,
    disconnect,
    disconnected,
    readConfig,
    writeConfig,
}