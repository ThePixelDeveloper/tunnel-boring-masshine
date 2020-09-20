import {Client as SSH} from 'ssh2'

export class Client {
    constructor(tunnel) {
        this.tunnel = tunnel
        this.client = new SSH()
        this.servers = []
        this.connected = false
    }

    handleConnected(handler) {
        this.connectedHandler = handler;
    }

    handleDisconnected(handler) {
        this.disconnectedHandler = handler
    }

    handleError(handler) {
        this.errorHandler = handler
    }

    isConnected() {
        return this.connected
    }

    disconnect() {
        if (this.isConnected()) {
            this.client.end()
            this.servers.forEach(server => server.close())
        }
    }

    connect() {
        this.client.on('ready', () => {
            // Create servers for all the local forwards.
            this.tunnel.rules.forEach((rule) => {
                const server = require('net').createServer(sock => {
                    this.client.forwardOut(
                        sock.remoteAddress,
                        sock.remotePort,
                        rule.targetAddress,
                        rule.targetPort,
                        (err, stream) => {
                            if (err) {
                                return sock.end();
                            }
                            sock.pipe(stream).pipe(sock);
                        });
                })

                this.servers.push(server)

                // Start proxying and call the connected callback.
                server.listen(rule.localPort, rule.localAddress, () => {
                    if (typeof this.connectedHandler === "function") {
                        this.connectedHandler(this.tunnel.id)
                    }

                    this.connected = true
                })
            })
        })

        this.client.on('error', (error) => {
            if (typeof this.errorHandler === "function") {
                this.errorHandler(this.tunnel.id, error)
            }
            this.connected = false
        })

        this.client.on('end', () => {
            if (typeof this.disconnectedHandler === "function") {
                this.disconnectedHandler(this.tunnel.id)
            }
            this.connected = false
        })

        this.client.connect({
            host: this.tunnel.host,
            username: this.tunnel.username,
            privateKey: require('fs').readFileSync(this.tunnel.privateKey),
            port: this.tunnel.port,
            keepaliveInterval: 60000,
        })
    }
}
