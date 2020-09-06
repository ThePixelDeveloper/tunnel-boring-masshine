module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: false
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'Tunnel Boring MaSSHine'
        }
    }
}