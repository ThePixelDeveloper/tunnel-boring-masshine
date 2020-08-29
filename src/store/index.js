import Vue from 'vue'
import Vuex, {mapState} from 'vuex'
// import Client from 'ssh2'
// import * as net from "net";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tunnels: [{
            id: "f7d04e41-9279-4159-92cb-dca8ac37b955",
            name: "Nomad",
            status: "Disconnected",
            username: "mathew",
            hostname: "localhost",
            port: 22,
            rules: [
                {
                    local: {
                        address: "",
                        port: 0
                    },
                    target: {
                        address: "",
                        port: 0
                    }
                }
            ]
        }, {
            id: "23c23537-5ca1-4ad5-8a25-19f06cf98316",
            name: "Consul",
            status: "Disconnected",
            username: "daniel",
            hostname: "192.168.1.1",
            port: 22,
            rules: [
                {
                    local: {
                        address: "",
                        port: 0
                    },
                    target: {
                        address: "",
                        port: 0
                    }
                }
            ]
        }, {
            id: "f3e43ae4-f4dd-442b-93ba-95740c9b02aa",
            name: "Traefik",
            status: "Disconnected",
            username: "carlos",
            hostname: "0.0.0.0",
            port: 22,
            rules: [
                {
                    local: {
                        address: "",
                        port: 0
                    },
                    target: {
                        address: "",
                        port: 0
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

            setTimeout(() => {
                commit('connecting', payload)

                setTimeout(() => {
                    commit('connected', payload)
                }, 2000)
            }, 2000)

            // const ssh = new Client()
            //
            // ssh.on('tcp connection', function (info, accept) {
            //     let stream = accept(), socket
            //     // @todo Deal with multiple rules.
            //     stream.pause();
            //     socket = net.connect(payload.rules.local.port, payload.rules.local.address, function () {
            //         stream.pipe(socket);
            //         socket.pipe(stream);
            //         stream.resume();
            //     });
            // });
            //
            // ssh.on('ready', () => {
            //     // @todo Deal with multiple rules.
            //     ssh.forwardIn(payload.rules.target.address, payload.rules.target.port, (err) => {
            //         if (err) {
            //             throw err
            //         }
            //
            //         commit('connected', payload)
            //     })
            // })
            //
            // ssh.connect({
            //     host: payload.hostname,
            //     port: payload.port,
            //     username: payload.username,
            //     privateKey: require('fs').readFileSync('~/.ssh/id_rsa')
            // })
        },
        disconnect({commit, getters}, payload) {
            if (getters.isDisconnecting(payload) || getters.isDisconnected(payload)) {
                return;
            }

            commit('disconnecting', payload)

            setTimeout(() => {
                commit('disconnected', payload)
            }, 2000)
        },
    },
    getters: {
        getTunnelById: (state) => (id) => {
            return state.tunnels.find(tunnel => tunnel.id === id)
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