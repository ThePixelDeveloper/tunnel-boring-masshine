import Vue from 'vue'
import Vuex, {mapState} from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tunnels: [{
      name: "Nomad",
      status: "Connected"
    }, {
      name: "Consul",
      status: "Connecting"
    }, {
      name: "Traefik",
      status: "Disconnected"
    }],
  },
  mutations: {
    addTunnel (state, payload) {
      state.tunnels.push(payload)
    }
  },
  computed: mapState([
    "tunnels"
  ])
})
