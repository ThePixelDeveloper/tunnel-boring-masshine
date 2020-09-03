module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'Tunnel Boring MaSSHine'
        }
    }
}