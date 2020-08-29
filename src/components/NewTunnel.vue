<template>
    <div class="flex flex-col overflow-y-auto h-screen">
        <form @submit.prevent="handleSubmit" class="h-screen flex flex-col">
            <div class="pt-3 pr-5 pb-5 pl-5 border-b border-dashed">
                <h2 class="text-sm font-medium mb-3">Name</h2>
                <div class="flex-row">
                    <input class="border px-2 py-1 rounded w-48 text-sm" type="text" placeholder="Tunnel name"
                           v-model="name">
                </div>
                <div class="flex-row mt-2" v-if="!$v.name.required && $v.name.$error">
                    <span class="text-red-600 text-sm">The tunnel name is required.</span>
                </div>
            </div>
            <div class="pt-3 pr-5 pb-5 pl-5 border-b border-dashed">
                <h2 class="text-sm font-medium mb-3">SSH Connection Details</h2>
                <div class="flex flex-row items-center">
                    <input class="border px-2 py-1 rounded w-48 flex-none text-sm" type="text"
                           placeholder="Username" v-model="username">
                    <span class="mx-1">@</span>
                    <input class="border px-2 py-1 rounded w-48 flex-auto text-sm" type="text"
                           placeholder="IP Address or hostname" v-model="hostname">
                    <span class="mx-1">:</span>
                    <input class="border px-2 py-1 rounded w-20 text-sm" type="number" placeholder="Port"
                           value="22" v-model="port">
                </div>
                <div class="flex-row mt-2" v-if="$v.username.$error||$v.hostname.$error||$v.port.$error">
                    <ul class="list-inside list-disc text-red-600">
                        <li v-if="!$v.username.required"><span class="text-sm">The username is required.</span></li>
                        <li v-if="!$v.hostname.required"><span
                                class="text-sm">The IP address/hostname is required.</span></li>
                        <li v-if="!$v.port.required"><span class="text-sm">The port is required.</span></li>
                    </ul>
                </div>
            </div>
            <div class="pt-3 pr-5 pb-5 pl-5 border-b border-dashed">
                <div class="flex flex-row items-center mb-3">
                    <h2 class="text-sm font-medium">Forwarding Rules</h2>
                    <div class="mx-3">
                        <div class="flex flex-row items-center">
                <span class="text-green-400">
                  <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                       height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                </span>
                            <p class="text-sm">This computer</p>
                        </div>
                    </div>
                    <div class="mx-3">
                        <div class="flex flex-row items-center">
                <span class="text-blue-400">
                  <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                       height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                </span>
                            <p class="text-sm">Target host</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row items-center">
                    <div class="flex flex-auto shadow-inner bg-green-200 rounded py-1 px-2">
                        <input class="flex-auto text-sm text-right text-green-700 placeholder-green-700 bg-transparent"
                               placeholder="Bind address" type="text">
                        <span class="text-sm mx-1 text-green-700">:</span>
                        <input class="w-20 text-sm text-green-700 placeholder-green-700 bg-transparent"
                               placeholder="Port" type="number">
                    </div>
                    <div class="mx-3 text-black">
                        <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                             height="16">
                            <path fill-rule="evenodd"
                                  d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"></path>
                        </svg>
                    </div>
                    <div class="flex flex-auto shadow-inner bg-blue-200 rounded py-1 px-2">
                        <input class="flex-auto text-sm text-right text-blue-700 placeholder-blue-700 bg-transparent"
                               placeholder="Target address" type="text">
                        <span class="text-sm mx-1 text-blue-700">:</span>
                        <input class="w-20 text-sm text-blue-700 placeholder-blue-700 bg-transparent"
                               placeholder="Port"
                               type="number">
                    </div>
                </div>
            </div>
            <div class="flex-grow"></div>
            <div class="bg-gray-200 px-5 text-white h-10 flex flex-col">
                <div class="flex flex-row-reverse items-center flex-grow">
                    <button class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500">Create
                    </button>
                    <router-link tag="button"
                                 class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-gray-500"
                                 to="/">Cancel
                    </router-link>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
    import {v4 as uuidv4} from 'uuid';

    export default {
        name: 'NewTunnel',
        data() {
            return {
                name: "",
                username: "",
                hostname: "",
                port: 22,
                rules: [
                    {
                        local: {
                            address: "",
                            port: null
                        },
                        target: {
                            address: "",
                            port: null
                        }
                    }
                ]
            }
        },
        validations: {
            name: {
                required
            },
            username: {
                required
            },
            hostname: {
                required
            },
            port: {
                required
            }
        },
        methods: {
            handleSubmit() {
                this.$v.$touch()

                if (this.$v.$invalid) {
                    return;
                }

                this.$store.commit('addTunnel', {
                    id: uuidv4(),
                    name: this.name,
                    username: this.username,
                    hostname: this.hostname,
                    port: this.port,
                    status: "Disconnected",
                    rules: [
                        {
                            local: {
                                address: "",
                                port: 0
                            },
                            target: {
                                address: "",
                                port: 0
                            }
                        }
                    ]
                })
            }
        }
    }
</script>