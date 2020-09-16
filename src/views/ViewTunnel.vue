<template>
    <div class="view-tunnel" v-if="tunnel">
        <div class="flex flex-col overflow-y-auto h-screen">
            <div class="p-3 pl-5 pr-5 border-b border-dashed">
                <h1 class="text-4xl font-medium">{{tunnel.name}}</h1>
            </div>
            <div class="p-3 pl-5 pr-5 border-b border-dashed">
                <div class="flex flex-row">
                    <h2 class="w-1/5 text-sm font-bold">Status</h2>
                    <div class="flex flex-row text-sm items-center">
                    <span v-bind:class="{'text-green-500': tunnel.status==='Connected', 'text-orange-500': tunnel.status==='Connecting' || tunnel.status==='Disconnecting', 'text-red-600': tunnel.status==='Disconnected'}">
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path
                      fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                        </span>
                        <span>{{tunnel.status}}</span>
                    </div>
                </div>
            </div>
            <div class="p-3 pl-5 pr-5 border-b border-dashed">
                <div class="flex flex-row">
                    <h2 class="w-1/5 text-sm font-bold">SSH Details</h2>
                    <div class="text-sm">
                        {{tunnel.username}}<span class="ml-1 mr-1 text-gray-600">@</span>{{tunnel.hostname}}<span
                            class="text-gray-600 ml-1 mr-1">:</span>{{tunnel.port}}
                    </div>
                </div>
                <div class="flex flex-row mt-2 text-gray-600">
                    <h2 class="w-1/5 text-sm">Private Key</h2>
                    <span class="text-sm font-medium">{{tunnel.privateKey}}</span>
                </div>
            </div>
            <div class="p-3 pl-5 pr-5 border-b border-dashed">
                <div class="flex flex-row">
                    <h2 class="w-1/5 text-sm font-bold">Fowarding Rules</h2>
                    <div>
                        <div class="flex flex-row">
                            <div class="flex flex-row items-center">
                <span class="text-green-400">
                  <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                       height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                </span>
                                <p class="text-sm">This computer</p>
                            </div>
                            <div class="flex flex-row items-center ml-6">
                <span class="text-blue-400">
                  <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                       height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                </span>
                                <p class="text-sm">Target host</p>
                            </div>
                        </div>
                        <div class="flex flex-row items-center mt-4 mb-1" v-for="(rule, i) in tunnel.rules" :key="i">
                            <div class="flex flex-auto shadow-inner bg-green-200 rounded py-1 px-2">
                                <span class="pl-1 flex-auto text-sm text-right text-green-700 placeholder-green-700 bg-transparent">{{rule.local.address}}</span>
                                <span class="text-sm mx-1 text-green-700">:</span>
                                <span class="pr-1 text-sm text-green-700 placeholder-green-700 bg-transparent">{{rule.local.port}}</span>
                            </div>
                            <div class="mx-3 text-black">
                                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                                     width="16"
                                     height="16">
                                    <path fill-rule="evenodd"
                                          d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"></path>
                                </svg>
                            </div>
                            <div class="flex flex-auto shadow-inner bg-blue-200 rounded py-1 px-2">
                                <span class="pl-1 flex-auto text-sm text-right text-blue-700 placeholder-blue-700 bg-transparent">{{rule.target.address}}</span>
                                <span class="text-sm mx-1 text-blue-700">:</span>
                                <span class="pr-1 text-sm text-blue-700 placeholder-blue-700 bg-transparent">{{rule.target.port}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-grow"></div>
            <div class="bg-gray-200 px-5 text-white h-10 flex row">
                <div class="flex items-center flex-grow">
                    <button @click="connect" v-if='tunnel.status !== "Connected"'
                            class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Connect
                    </button>
                    <button @click="disconnect" v-if='tunnel.status === "Connected"'
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
                return this.$store.getters.findTunnel(this.$route.params.id)
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
