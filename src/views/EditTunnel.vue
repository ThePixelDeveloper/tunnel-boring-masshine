<template>
    <div class="view-tunnel">
        <div class="flex flex-col overflow-y-auto h-screen">
            <TunnelForm
                    v-bind:username="tunnel.username"
                    v-bind:name="tunnel.name"
                    v-bind:port="tunnel.port"
                    v-bind:hostname="tunnel.hostname"
                    v-bind:private-key="tunnel.privateKey"
                    v-on:handleSubmit="handleSubmit">
                <div class="bg-gray-200 px-5 text-white py-2 flex flex-col">
                    <div class="flex flex-row-reverse items-center flex-grow">
                        <button class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Update
                        </button>
                        <router-link tag="button"
                                     class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-gray-500"
                                     :to="{ name: 'View Tunnel', params: { id: tunnel.id }}">Cancel
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
                return this.$store.getters.getTunnelById(this.$route.params.id)
            }
        },
        methods: {
            handleSubmit() {
                alert('hello world')
                // this.$store.commit('addTunnel', {
                //     id: uuidv4(),
                //     name: this.name,
                //     username: this.username,
                //     hostname: this.hostname,
                //     port: this.port,
                //     privateKey: this.privateKey,
                //     status: "Disconnected",
                //     rules: [
                //         {
                //             local: {
                //                 address: "",
                //                 port: 0
                //             },
                //             target: {
                //                 address: "",
                //                 port: 0
                //             }
                //         }
                //     ]
                // })
            }
        }
    }
</script>
