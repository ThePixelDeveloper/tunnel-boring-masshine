<template>
  <div id="app" class="flex flex-row">
    <Sidebar></Sidebar>
    <router-view class="flex-grow"></router-view>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import ipc from "./renderer/utils/ipc";
import {map} from "lodash";

export default {
  name: "App",
  components: { Sidebar },
  beforeCreate() {
    this.$store.dispatch("loadTunnels");
  },
  created() {
    ipc.trayConnect((tunnel) => {
      this.$store.dispatch("connect", tunnel)
    })

    ipc.trayDisconnect((tunnel) => {
      this.$store.dispatch("disconnect", tunnel)
    })
    
    const loadStatus = (tunnel) => {
      this.$store.dispatch("loadStatus", tunnel)
    }
    
    const autoConnect = (tunnel) => {
      this.$store.dispatch("autoConnect", tunnel)
    }

    this.$store.watch(
      function (state) {
        return state.tunnels;
      },
      function (tunnels) {
        map(tunnels, ipc.register);
        map(tunnels, loadStatus)
        map(tunnels, autoConnect)
      }
    );
    
    this.$store.watch(
        function(state, getters) {
          return getters.config
        },
        ipc.writeConfig
    )
    
    this.$store.watch(
        function(state) {
          return state.tunnels
        },
        function(tunnels) {
          map(tunnels, ipc.updateTray)
        },
        {
          deep: true
        }
    )
  },
};
</script>
