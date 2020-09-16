import {Client} from "./ssh";
import {set, get, has} from "lodash";

export class SshCollection {
    constructor() {
        this.clients = {}
    }

    register(tunnel, connected, disconnected, error) {
        const client = new Client(tunnel)

        client.handleConnected(connected)
        client.handleDisconnected(disconnected)
        client.handleError(error)

        set(this.clients, tunnel.id, client)
    }

    connect(tunnel) {
        if (has(this.clients, tunnel.id)) {
            get(this.clients, tunnel.id).connect();
        }
    }

    disconnect(tunnel) {
        if (has(this.clients, tunnel.id)) {
            get(this.clients, tunnel.id).disconnect();
        }
    }

    isConnected(tunnel) {
        if (!has(this.clients, tunnel.id)) {
            return false
        }

        return get(this.clients, tunnel.id).isConnected();
    }
}
