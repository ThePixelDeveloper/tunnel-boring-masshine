module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'SSH Tunnel Manager'
        }
    }
}