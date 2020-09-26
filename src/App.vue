<template>
    <div id="app" class="flex flex-row">
        <Sidebar></Sidebar>
        <router-view class="flex-grow"></router-view>
    </div>
</template>

<script>
    import Sidebar from "./components/Sidebar";
    import ipc from "./renderer/utils/ipc"
    import {map} from "lodash"

    export default {
        name: 'App',
        components: {Sidebar},
        async created() {
            try {
                // Load the configuration into the store on boot
                this.$store.dispatch('loadConfig', await ipc.readConfig())
            } catch (e) {
                console.log(e)
            }

            // Write configuration changes to disk as they happen.
            this.$store.watch(
                function (state, getters) {
                    return getters.config;
                },
                function (config) {
                    return ipc.writeConfig(config);
                }
            )

            this.$store.watch(
                function (state) {
                    return state.tunnels;
                },
                function (tunnels) {
                    map(tunnels, ipc.register);
                    ipc.tray(tunnels);
                },
                { deep: true }
            )
        },
    }
</script>
