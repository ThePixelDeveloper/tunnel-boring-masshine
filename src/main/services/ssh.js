import {Client as SSH} from 'ssh2'

export class Client {
    constructor(tunnel) {
        this.tunnel = tunnel
        this.client = new SSH()
        this.servers = []
    }

    handleConnected(handler) {
        this.connected = handler;
    }

    handleDisconnected(handler) {
        this.disconnected = handler
    }

    handleError(handler) {
        this.error = handler
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
                    if (typeof this.connected === "function") {
                        this.connected(this.tunnel.id)
                    }
                })
            })
        })

        this.client.on('error', (error) => {
            if (typeof this.error === "function") {
                this.error(this.tunnel.id, error)
            }
        })

        this.client.on('end', () => {
            if (typeof this.disconnected === "function") {
                this.disconnected(this.tunnel.id)
            }
        })

        this.client.connect({
            host: this.tunnel.hostname,
            username: this.tunnel.username,
            privateKey: require('fs').readFileSync(this.tunnel.privateKey),
            port: this.tunnel.port,
        })
        
        return {
            id: this.tunnel.id,
            close() {
                this.client.end()
                this.servers.forEach(server => server.close())    
            }
        }
    }
}
