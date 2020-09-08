<template>
    <div class="view-tunnel">
        <div class="flex flex-col overflow-y-auto h-screen">
            <TunnelForm
                    v-bind:username="tunnel.username"
                    v-bind:name="tunnel.name"
                    v-bind:port="tunnel.port"
                    v-bind:hostname="tunnel.hostname"
                    v-bind:private-key="tunnel.privateKey"
                    v-bind:rules="tunnel.rules"
                    v-on:handleSubmit="handleSubmit">
                <div class="bg-gray-200 px-5 text-white py-2 flex flex-col">
                    <div class="flex flex-row-reverse items-center flex-grow">
                        <button class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Update
                        </button>
                        <router-link tag="button"
                                     class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-gray-500"
                                     :to="{ name: 'View Tunnel', params: { id: this.$route.params.id }}">Cancel
                        </router-link>
                    </div>
                </div>
            </TunnelForm>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import TunnelForm from "../components/TunnelForm";

    export default {
        name: 'EditTunnelView',
        components: {
            TunnelForm,
        },
        computed: {
            tunnel() {
                return this.$store.state.tunnels[this.$route.params.id]
            }
        },
        methods: {
            handleSubmit(payload) {
                this.$store.commit('updateTunnel', {
                    id: this.$route.params.id,
                    tunnel: payload,
                })

                this.$router.push('/tunnel/' + this.$route.params.id)
            }
        }
    }
</script>
