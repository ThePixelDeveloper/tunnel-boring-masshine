import Vue from "vue";
import Vuex from "vuex";
import ipc from "../renderer/utils/ipc";
import { assign, map, find, findIndex } from "lodash";

const _ = require("lodash");

Vue.use(Vuex);

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
      Vue.set(state.tunnels, state.tunnels.length, tunnel);
    },

    // Removes
    removeTunnel(state, id) {
      state.tunnels.splice(findTunnelIndex(state, id), 1);
    },

    // Updates
    updateTunnel(state, { id, tunnel }) {
      Vue.set(
        state.tunnels,
        findTunnelIndex(state, id),
        _.extend({}, findTunnel(state, id), tunnel)
      );
    },

    // Replaces
    setTunnels(state, tunnels) {
      state.tunnels = tunnels;
    },

    // Connection status
    connecting(state, id) {
      findTunnel(state, id).status = "Connecting";
    },
    connected(state, id) {
      findTunnel(state, id).status = "Connected";
    },
    disconnecting(state, id) {
      findTunnel(state, id).status = "Disconnecting";
    },
    disconnected(state, id) {
      findTunnel(state, id).status = "Disconnected";
    },
  },
  getters: {
    findTunnel(state) {
      return (id) => findTunnel(state, id);
    },
    count(state) {
      return state.tunnels.length;
    },
    first(state) {
      return state.tunnels[0];
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
        ]);
      });
    },
  },
  actions: {
    async loadTunnels({ commit }) {
      commit(
        "setTunnels",
        map(await ipc.readConfig(), (tunnel) => {
          return assign(
            {
              status: "Disconnected",
            },
            tunnel
          );
        })
      );
    },
    connect({ commit }, tunnel) {
      if (tunnel.status === "Connecting") {
        return;
      }

      commit("connecting", tunnel.id);
      ipc.connect(tunnel);
    },
    disconnect({ commit }, tunnel) {
      if (tunnel.status === "Disconnecting") {
        return;
      }

      commit("disconnecting", tunnel.id);
      ipc.disconnect(tunnel);
    },
  },
});
