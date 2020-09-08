<template>
    <div id="app" class="flex flex-row">
        <Sidebar></Sidebar>
        <router-view class="flex-grow"></router-view>
    </div>
</template>

<script>
    import Sidebar from "./components/Sidebar";
    import ipc from "./renderer/utils/ipc"

    export default {
        name: 'App',
        components: {Sidebar},
        async created() {
            try {
                // Load the configuration into the store on boot
                this.$store.dispatch('loadConfig', await ipc.readConfig())
            } catch (e) {
                // @todo Electron logging?
            }

            // Write configuration changes to disk as they happen.
            this.unwatch = this.$store.watch(
                (state, getters) => getters.config,
                (config) => ipc.writeConfig(config)
            )
        },
        destroyed() {
            this.unwatch();
        }
    }
</script>
