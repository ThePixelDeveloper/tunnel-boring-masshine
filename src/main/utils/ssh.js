import {Client as SSH} from 'ssh2'

export class Client {
    constructor(id, hostname, username, privateKey, port) {
        this.id = id;
        this.hostname = hostname;
        this.username = username;
        this.privateKey = privateKey;
        this.port = port;

        this.client = new SSH()
        this.servers = []
        this.rules = []
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

    addRule(localAddress, localPort, targetAddress, targetPort) {
        this.rules.push({
            localAddress,
            localPort,
            targetAddress,
            targetPort,
        })
    }

    connect() {
        this.client.on('ready', () => {
            // Create servers for all the local forwards.
            this.rules.forEach((rule) => {
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
                        this.connected(this.id)
                    }
                })
            })
        })

        this.client.on('error', (error) => {
            if (typeof this.error === "function") {
                this.error(this.id, error)
            }
        })

        this.client.on('end', () => {
            if (typeof this.disconnected === "function") {
                this.disconnected(this.id)
            }
        })

        this.client.connect({
            host: this.hostname,
            username: this.username,
            privateKey: require('fs').readFileSync(this.privateKey),
            port: this.port,
            keepaliveInterval: 60000,
        })
        
        return () => {
            this.client.end()
            this.servers.forEach(server => server.close())
        }
    }
}
