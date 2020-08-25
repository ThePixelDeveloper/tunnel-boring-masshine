import Vue from 'vue'
import Vuex, {mapState} from 'vuex'
import Client from 'ssh2'
import * as net from "net";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tunnels: [{
            id: "f7d04e41-9279-4159-92cb-dca8ac37b955",
            name: "Nomad",
            status: "Disconnected",
            username: "",
            hostname: "",
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
            username: "",
            hostname: "",
            port: 22
        }, {
            id: "f3e43ae4-f4dd-442b-93ba-95740c9b02aa",
            name: "Traefik",
            status: "Disconnected",
            username: "",
            hostname: "",
            port: 22
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
        connect({commit}, payload) {
            commit('connecting', payload)

            const ssh = new Client()

            ssh.on('tcp connection', function (info, accept) {
                let stream = accept(), socket
                // @todo Deal with multiple rules.
                stream.pause();
                socket = net.connect(payload.rules.local.port, payload.rules.local.address, function () {
                    stream.pipe(socket);
                    socket.pipe(stream);
                    stream.resume();
                });
            });

            ssh.on('ready', () => {
                // @todo Deal with multiple rules.
                ssh.forwardIn(payload.rules.target.address, payload.rules.target.port, (err) => {
                    if (err) {
                        throw err
                    }

                    commit('connected', payload)
                })
            })

            ssh.connect({
                host: payload.hostname,
                port: payload.port,
                username: payload.username,
                privateKey: require('fs').readFileSync('~/.ssh/id_rsa')
            })
        },
        disconnect(context, payload) {
            context.commit('disconnecting', payload)

            setTimeout(() => {
                context.commit('disconnected', payload)
            }, 2000)
        },
    },
    getters: {
        getTunnelById: (state) => (id) => {
            return state.tunnels.find(tunnel => tunnel.id === id)
        },
    },
    computed: mapState([
        "tunnels"
    ])
})