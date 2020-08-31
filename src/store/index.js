import Vue from 'vue'
import Vuex, {mapState} from 'vuex'
import {Client} from "ssh2";

const fs = require('fs')
const net = require('net')

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tunnels: [{
            id: "f7d04e41-9279-4159-92cb-dca8ac37b955",
            name: "Nomad",
            status: "Disconnected",
            username: "mathew",
            hostname: "94.130.184.244",
            privateKey: "/home/mathew/id_rsa",
            port: 22,
            rules: [
                {
                    local: {
                        address: "localhost",
                        port: 4646
                    },
                    target: {
                        address: "10.0.1.2",
                        port: 4646
                    }
                }
            ]
        }, {
            id: "23c23537-5ca1-4ad5-8a25-19f06cf98316",
            name: "Consul",
            status: "Disconnected",
            username: "mathew",
            hostname: "94.130.173.250",
            privateKey: "/home/mathew/id_rsa",
            port: 22,
            rules: [
                {
                    local: {
                        address: "localhost",
                        port: 8500
                    },
                    target: {
                        address: "localhost",
                        port: 8500
                    }
                }
            ]
        }, {
            id: "f3e43ae4-f4dd-442b-93ba-95740c9b02aa",
            name: "Traefik",
            status: "Disconnected",
            username: "mathew",
            hostname: "88.99.184.196",
            privateKey: "/home/mathew/id_rsa",
            port: 22,
            rules: [
                {
                    local: {
                        address: "localhost",
                        port: 8081
                    },
                    target: {
                        address: "localhost",
                        port: 8080
                    }
                }
            ]
        }],
    },
    mutations: {
        addTunnel(state, payload) {
            state.tunnels.push(payload)
        },
        removeTunnel(state, payload) {
            state.tunnels = state.tunnels.filter(tunnel => tunnel.id !== payload.id)
        },
        setConnection(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.payload.id)
            state.tunnels[id].connection = payload.connection
        },
        setServer(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.payload.id)
            state.tunnels[id].server = payload.server
        },
        removeConnection(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.id)
            delete state.tunnels[id].connection
        },
        connecting(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.id)
            state.tunnels[id].status = "Connecting"
        },
        connected(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.id)
            state.tunnels[id].status = "Connected"
        },
        disconnecting(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.id)
            state.tunnels[id].status = "Disconnecting"
        },
        disconnected(state, payload) {
            const id = state.tunnels.findIndex(tunnel => tunnel.id === payload.id)
            state.tunnels[id].status = "Disconnected"
        },
    },
    actions: {
        connect({getters, commit}, payload) {
            if (getters.isConnecting(payload) || getters.isConnected(payload)) {
                return;
            }

            commit('connecting', payload)

            const ssh = new Client()

            ssh.on('ready', () => {
                const local = payload.rules[0].local;
                const target = payload.rules[0].target;

                const srv = net.createServer((sock) => {
                    ssh.forwardOut(
                        sock.remoteAddress,
                        sock.remotePort,
                        target.address,
                        target.port,
                        (err, stream) => {
                            if (err) {
                                return sock.end();
                            }
                            sock.pipe(stream).pipe(sock);
                        });
                });

                srv.listen(local.port, local.address, () => {
                    commit('connected', payload)
                    commit('setConnection', {payload: payload, connection: ssh})
                    commit('setServer', {payload: payload, server: srv})
                });
            })

            ssh.on('end', () => {
                commit('disconnected', payload);
            })

            ssh.connect({
                host: payload.hostname,
                port: payload.port,
                username: payload.username,
                privateKey: fs.readFileSync(payload.privateKey)
            })
        },
        disconnect({commit, getters}, payload) {
            if (getters.isDisconnecting(payload) || getters.isDisconnected(payload)) {
                return;
            }

            commit('disconnecting', payload)

            setTimeout(() => {
                if (getters.hasConnection(payload)) {
                    getters.getTunnelById(payload.id).server.close();
                    getters.getTunnelById(payload.id).connection.end();
                }
            }, Math.random() * (1000 - 500) + 500)
        },
    },
    getters: {
        getTunnelById: (state) => (id) => {
            return state.tunnels.find(tunnel => tunnel.id === id)
        },
        hasConnection: (state, getters) => (payload) => {
            return getters.getTunnelById(payload.id).connection !== undefined;
        },
        isConnecting: (state, getters) => (payload) => {
            return getters.getTunnelById(payload.id).status === "Connecting";
        },
        isConnected: (state, getters) => (payload) => {
            return getters.getTunnelById(payload.id).status === "Connected";
        },
        isDisconnecting: (state, getters) => (payload) => {
            return getters.getTunnelById(payload.id).status === "Disconnecting";
        },
        isDisconnected: (state, getters) => (payload) => {
            return getters.getTunnelById(payload.id).status === "Disconnected";
        },
        defaultTunnel(state) {
            return state.tunnels[0]
        },
    },
    computed: mapState([
        "tunnels"
    ])
})