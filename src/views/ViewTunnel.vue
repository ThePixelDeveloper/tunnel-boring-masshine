<template>
    <div class="view-tunnel">
        <div class="flex flex-col overflow-y-auto h-screen">
            <div class="flex-grow"></div>
            <div class="bg-gray-200 px-5 text-white h-10 flex row">
                <div class="flex items-center flex-grow">
                    <button @click="connect"
                            class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Connect
                    </button>
                    <button @click="disconnect"
                            class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">
                        Disconnect
                    </button>
                </div>
                <div class="flex flex-row-reverse items-center flex-grow">
                    <router-link tag="button" :to="{ name: 'Edit Tunnel', params: { id: this.$route.params.id }}"
                                 class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Update
                    </router-link>
                    <button @click="remove"
                            class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-red-500 text-white">Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    export default {
        name: 'ViewTunnelView',
        computed: {
            tunnel() {
                return this.$store.state.tunnels[this.$route.params.id]
            }
        },
        methods: {
            connect() {
                this.$store.dispatch('connect', this.$route.params.id)
            },
            disconnect() {
                this.$store.dispatch('disconnect', this.$route.params.id)
            },
            remove() {
                this.$store.commit('removeTunnel', this.$route.params.id)

                if (this.$store.getters.count === 0) {
                    this.$router.push('/');
                    return
                }

                this.$router.push('/tunnel/' + this.$store.getters.first)
            }
        }
    }
</script>
