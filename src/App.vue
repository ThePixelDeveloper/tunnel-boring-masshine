<template>
    <div id="app" class="flex flex-row">
        <Sidebar></Sidebar>
        <router-view class="flex-grow"></router-view>
    </div>
</template>

<script>
    import Sidebar from "./components/Sidebar";

    export default {
        name: 'App',
        components: {Sidebar},
        created() {
            const {app} = require('electron').remote
            const fs = require('fs')
            const path = require('path')

            const tunnelsPath = path.join(app.getPath('userData'), 'tunnels.json')

            if (fs.existsSync(tunnelsPath)) {
                const tunnels = fs.readFileSync(tunnelsPath, 'utf-8')
                this.$store.commit('setTunnels', JSON.parse(tunnels))
            }
        }
    }
</script>
