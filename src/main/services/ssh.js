import { Client as SSH } from "ssh2";
import { createServer } from "net";
import { remove } from "lodash";

export class Client {
  constructor(tunnel) {
    this.tunnel = tunnel;
    this.servers = [];
    this.connected = false;

    this.client = new SSH();

    // Error handler.
    this.client.on("error", (error) => {
      if (typeof this.errorHandler === "function") {
        this.errorHandler(this.tunnel.id, error);
      }
      this.connected = false;
    });

    // Disconnected handler.
    this.client.on("end", () => {
      if (typeof this.disconnectedHandler === "function") {
        this.disconnectedHandler(this.tunnel.id);
      }
      this.connected = false;
    });

    // Ready handler.
    this.client.on(
      "ready",
      function () {
        // Create servers for all the local forwards.
        this.tunnel.rules.forEach(
          function (rule) {
            const server = createServer(
              function (sock) {
                this.client.forwardOut(
                  sock.remoteAddress,
                  sock.remotePort,
                  rule.target.address,
                  rule.target.port,
                  (err, stream) => {
                    if (err) {
                      return sock.end();
                    }
                    sock.pipe(stream).pipe(sock);
                  }
                );
              }.bind(this)
            );

            this.servers.push(server);

            // Start proxying and call the connected callback.
            server.listen(
              rule.local.port,
              rule.local.address,
              function () {
                if (typeof this.connectedHandler === "function") {
                  this.connectedHandler(this.tunnel.id);
                }

                this.connected = true;
              }.bind(this)
            );
          }.bind(this)
        );
      }.bind(this)
    );
  }

  handleConnected(handler) {
    this.connectedHandler = handler;
  }

  handleDisconnected(handler) {
    this.disconnectedHandler = handler;
  }

  handleError(handler) {
    this.errorHandler = handler;
  }

  isConnected() {
    return this.connected;
  }

  disconnect() {
    if (this.isConnected()) {
      this.client.end();

      this.servers = remove(this.servers, (server) => {
        server.close();
        return true;
      });
    }
  }

  connect() {
    if (!this.isConnected()) {
      this.client.connect({
        host: this.tunnel.hostname,
        username: this.tunnel.username,
        privateKey: require("fs").readFileSync(this.tunnel.privateKey),
        port: this.tunnel.port,
        keepaliveInterval: 60000,
      });
    }
  }
}
