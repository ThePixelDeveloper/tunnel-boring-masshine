import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../renderer/utils/ipc'
import {find, findIndex} from 'lodash'

const _ = require('lodash');

Vue.use(Vuex)

function findTunnel(state, id) {
    return find(state.tunnels, (tunnel) => tunnel.id === id);
}

function findTunnelIndex(state, id) {
    return findIndex(state.tunnels, (tunnel) => tunnel.id === id);
}

export default new Vuex.Store({
    state: {
        tunnels: [],
    },
    mutations: {
        // Creates
        createTunnel(state, tunnel) {
            Vue.set(state.tunnels, state.tunnels.length, tunnel)
        },

        // Removes
        removeTunnel(state, id) {
            state.tunnels.splice(findTunnelIndex(state, id), 1)
        },

        // Updates
        updateTunnel(state, {id, tunnel}) {
            state.tunnels.splice(findTunnelIndex(state, id), tunnel)
        },

        // Connection status
        connecting(state, id) {
            console.log('connecting', id)
            findTunnel(state, id).status = "Connecting"
        },
        connected(state, id) {
            console.log('connected', id)
            findTunnel(state, id).status = "Connected"
        },
        disconnecting(state, id) {
            console.log('disconnecting', id)
            findTunnel(state, id).status = "Disconnecting"
        },
        disconnected(state, id) {
            console.log('disconnected', id)
            findTunnel(state, id).status = "Disconnected"
        },
    },
    getters: {
        findTunnel(state) {
            return (id) => findTunnel(state, id)
        },
        count(state) {
            return state.tunnels.length
        },
        first(state) {
            return state.tunnels[0]
        },
        config(state) {
            return _.map(state.tunnels, (t) => {
                return _.pick(t, [
                    "id",
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
        loadConfig({commit}, tunnels) {
            _.map(tunnels, async (tunnel) => {
                tunnel.status = await ipc.isConnected(tunnel.id) ? 'Connected' : 'Disconnected'
                commit('createTunnel', tunnel);
            })
        },
        connect({state, commit}, id) {
            commit('connecting', id)
            ipc.connected((id) => commit('connected', id))
            ipc.error((id) => commit('disconnected', id))
            ipc.connect(findTunnel(state, id))
        },
        disconnect({commit}, id) {
            commit('disconnecting', id)
            ipc.disconnected((id) => commit('disconnected', id))
            ipc.disconnect(id)
        },
    },
})
