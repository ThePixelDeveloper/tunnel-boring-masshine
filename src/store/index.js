import Vue from 'vue'
import Vuex from 'vuex'
import {Client} from "ssh2";

const _ = require('lodash');
const fs = require('fs')
const net = require('net')

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tunnels: {
            "f7d04e41-9279-4159-92cb-dca8ac37b955": {
                "name": "Nomad",
                "status": "Disconnected",
                "username": "mathew",
                "hostname": "94.130.184.244",
                "privateKey": "/home/mathew/id_rsa",
                "port": 22,
                "rules": [
                    {
                        "local": {
                            "address": "localhost",
                            "port": 4646
                        },
                        "target": {
                            "address": "10.0.1.2",
                            "port": 4646
                        }
                    }
                ]
            },
            "23c23537-5ca1-4ad5-8a25-19f06cf98316": {
                "name": "Consul",
                "status": "Disconnected",
                "username": "mathew",
                "hostname": "94.130.173.250",
                "privateKey": "/home/mathew/id_rsa",
                "port": 22,
                "rules": [
                    {
                        "local": {
                            "address": "localhost",
                            "port": 8500
                        },
                        "target": {
                            "address": "localhost",
                            "port": 8500
                        }
                    }
                ]
            },
            "f3e43ae4-f4dd-442b-93ba-95740c9b02aa": {
                "name": "Traefik",
                "status": "Disconnected",
                "username": "mathew",
                "hostname": "88.99.184.196",
                "privateKey": "/home/mathew/id_rsa",
                "port": 22,
                "rules": [
                    {
                        "local": {
                            "address": "localhost",
                            "port": 8081
                        },
                        "target": {
                            "address": "localhost",
                            "port": 8080
                        }
                    }
                ]
            }
        },
    },
    mutations: {
        // Replaces
        setTunnels(state, tunnels) {
            state.tunnels = tunnels
        },
        setConnection(state, {id, connection}) {
            state.tunnels[id].connection = connection
        },
        setServer(state, {id, server}) {
            state.tunnels[id].server = server
        },

        // Creates
        createTunnel(state, tunnel) {
            state.tunnels[tunnel.id] = tunnel
        },

        // Removes
        removeTunnel(state, id) {
            Vue.delete(state.tunnels, id)
        },
        removeConnection(state, id) {
            Vue.delete(state.tunnels[id], "connection")
        },
        removeServer(state, id) {
            Vue.delete(state.tunnels[id], "server")
        },

        // Updates
        updateTunnel(state, {id, tunnel}) {
            _.merge(state.tunnels[id], tunnel)
        },

        // Connection status
        connecting(state, id) {
            state.tunnels[id].status = "Connecting"
        },
        connected(state, id) {
            state.tunnels[id].status = "Connected"
        },
        disconnecting(state, id) {
            state.tunnels[id].status = "Disconnecting"
        },
        disconnected(state, id) {
            state.tunnels[id].status = "Disconnected"
        },
    },
    getters: {
        count(state) {
            return Object.keys(state.tunnels).length
        },
        first(state) {
            return Object.keys(state.tunnels)[0]
        },
    },
    actions: {
        connect({state, commit}, id) {
            const tunnel = state.tunnels[id];

            if (tunnel.status !== "Disconnected") {
                return;
            }

            commit('connecting', id)

            const ssh = new Client()

            ssh.on('ready', () => {
                const local = tunnel.rules[0].local;
                const target = tunnel.rules[0].target;

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
                    commit('connected', id)
                    commit('setConnection', {id: id, connection: ssh})
                    commit('setServer', {id: id, server: srv})
                });
            })

            ssh.on('end', () => {
                commit('disconnected', id);
            })

            ssh.connect({
                host: tunnel.hostname,
                port: tunnel.port,
                username: tunnel.username,
                privateKey: fs.readFileSync(tunnel.privateKey)
            })
        },
        disconnect({state, commit}, id) {
            if (state.tunnels[id].status !== "Connected") {
                return;
            }

            commit('disconnecting', id)

            const tunnel = state.tunnels[id]

            tunnel.server.close();
            tunnel.connection.end();

            // commit('disconnected', payload)
            // is handled in the on('close') cb of the ssh connection.
        },
    },
})