<template>
  <div id="app" class="flex flex-row">
    <Sidebar></Sidebar>
    <router-view class="flex-grow"></router-view>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import ipc from "./renderer/utils/ipc";
import {get} from 'lodash';

export default {
  name: "App",
  components: { Sidebar },
  beforeCreate() {
    this.$store.dispatch("loadTunnels");
    
    ipc.trayConnect((tunnel) => {
      this.$store.dispatch("connect", tunnel)
    })

    ipc.trayDisconnect((tunnel) => {
      this.$store.dispatch("disconnect", tunnel)
    })

    ipc.connected((id) => {
      this.$store.commit("connected", id);
    })

    ipc.disconnected((id) => {
      this.$store.commit("disconnected", id);
    })

    ipc.error((id) => {
      this.$store.commit("disconnected", id);
    })

    this.tunnelsWatch = this.$store.watch(
      function (state) {
        return state.tunnels;
      },
      async (tunnels) => {
        for (const tunnel of tunnels) {
          // Register into the ssh collection
          await ipc.register(tunnel);
          
          // Load connection state if already connected
          if (await ipc.isConnected(tunnel)) {
            this.$store.commit("connected", tunnel.id);
          }

          // Automatically connect if we need to.
          if (
              get(tunnel, "autoconnect") &&
              get(tunnel, "status") === "Disconnected"
          ) {
            await this.$store.dispatch("connect", tunnel);
          }
        }
      }
    );
    
    this.configWatch = this.$store.watch(
        function(state, getters) {
          return getters.config
        },
        ipc.writeConfig
    )

    this.trayWatch = this.$store.watch(
        function (state) {
          return state.tunnels;
        },
        function (tunnels) {
          for (const tunnel of tunnels) {
            ipc.updateTray(tunnel)
          }
        }, {
          deep: true
        }
    );
  },
  beforeDestroy() {
    this.tunnelsWatch();
    this.trayWatch();
    this.configWatch();
  }
};
</script>
