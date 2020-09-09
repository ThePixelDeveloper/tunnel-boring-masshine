import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../renderer/utils/ipc'

const _ = require('lodash');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tunnels: {},
    },
    mutations: {
        // Creates
        createTunnel(state, {id, tunnel}) {
            tunnel.status = "Disconnected"
            Vue.set(state.tunnels, id, tunnel)
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
            Vue.set(state.tunnels, id, _.extend({}, state.tunnels[id], tunnel))
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
        config(state) {
            return _.mapValues(state.tunnels, (t) => {
                return _.pick(t, [
                    "name",
                    "username",
                    "hostname",
                    "privateKey",
                    "port",
                    "rules",
                ])
            })
        }
    },
    actions: {
        loadConfig({commit}, config) {
            Object.keys(config).forEach((id) => {
                commit('createTunnel', {
                    id: id,
                    tunnel: config[id],
                })
            })
        },
        connect({state, commit}, id) {
            const tunnel = state.tunnels[id]

            commit('connecting', id)

            ipc.connected((id) => commit('connected', id))
            ipc.error((id) => commit('disconnected', id))
            ipc.connect(
                id,
                tunnel.hostname,
                tunnel.username,
                tunnel.privateKey,
                tunnel.port,
                tunnel.rules,
            )
        },
        disconnect({commit}, id) {
            commit('disconnecting', id)

            ipc.disconnected((id) => commit('disconnected', id))
            ipc.disconnect(id)
        },
    },
})
