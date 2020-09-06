<template>
    <div id="app" class="flex flex-row">
        <Sidebar></Sidebar>
        <router-view class="flex-grow"></router-view>
    </div>
</template>

<script>
    import Sidebar from "./components/Sidebar";
    import {ipcRenderer} from "electron";

    export default {
        name: 'App',
        components: {Sidebar},
        async created() {
            this.unwatch = this.$store.watch(
                (state, getters) => getters.config,
                async (config) => {
                    await ipcRenderer.invoke('write-tunnels', config)
                })

            const tunnels = JSON.parse(await ipcRenderer.invoke('read-tunnels'))

            Object.keys(tunnels).forEach((id) => {
                this.$store.commit('createTunnel', {
                    id: id,
                    tunnel: tunnels[id],
                })
            })
        },
        destroyed() {
            this.unwatch();
        }
    }
</script>
