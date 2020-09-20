import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../renderer/utils/ipc'
import {get, find, findIndex, map} from 'lodash'
import {loadTunnelStatus} from "../renderer/utils/status";

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
            Vue.set(state.tunnels, findTunnelIndex(state, id), _.extend({}, findTunnel(state,id), tunnel))
        },

        // Replaces
        replaceTunnels(state, tunnels) {
            state.tunnels = tunnels
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
                    "autoconnect",
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
        async loadConfig({commit, dispatch}, tunnels) {
            const replaceTunnels = await Promise.all(map(tunnels, loadTunnelStatus))

            commit('replaceTunnels', replaceTunnels)

            map(replaceTunnels, (tunnel) => {
                if (get(tunnel, 'autoconnect')) {
                    dispatch('connect', tunnel)
                }
            })
        },
        connect({commit}, tunnel) {
            if (tunnel.status === "Connecting") {
                return
            }

            commit('connecting', tunnel.id)
            ipc.connected((id) => commit('connected', id))
            ipc.error((id) => commit('disconnected', id))
            ipc.connect(tunnel)
        },
        disconnect({commit}, tunnel) {
            if (tunnel.status === "Disconnecting") {
                return
            }

            commit('disconnecting', tunnel.id)
            ipc.disconnected((id) => commit('disconnected', id))
            ipc.disconnect(tunnel)
        },
    },
})
