<template>
    <div class="flex-1">
        <button @click="connect" class="mx-auto block bg-gray-200 py-2 px-4 rounded border font-medium">Connect</button>
        <button @click="disconnect" class="mx-auto block bg-gray-200 py-2 px-4 rounded border font-medium">Disconnect
        </button>
        <button @click="remove" class="mx-auto block bg-gray-200 py-2 px-4 rounded border font-medium">Delete</button>
    </div>
</template>

<script>
    export default {
        name: 'ViewTunnel',
        computed: {
            tunnel() {
                return this.$store.getters.getTunnelById(this.$route.params.id)
            }
        },

        methods: {
            connect() {
                this.$store.dispatch('connect', this.tunnel)
            },
            disconnect() {
                this.$store.dispatch('disconnect', this.tunnel)
            },
            remove() {
                this.$store.commit('removeTunnel', this.tunnel)

                if (this.$store.getters.tunnels.length === 0) {
                    this.$router.push('/');
                    return
                }

                this.$router.push('/tunnel/' + this.$store.getters.defaultTunnel.id)
            }
        }
    }
</script>