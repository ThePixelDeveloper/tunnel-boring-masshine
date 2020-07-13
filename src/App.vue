<template>
    <div id="app">
        <div class="flex flex-row">
            <div class="w-48 flex flex-col border-r h-screen bg-gray-100">
                <div class="flex flex-row px-5 py-2 items-center border-b">
                    <div class="flex-initial">
            <span class="text-green-500">
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path
                      fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
            </span>
                    </div>
                    <div class="flex-1 flex-col">
                        <h2 class="text-sm text-right text-gray-800 font-medium">Nomad</h2>
                        <p class="text-right text-sm text-gray-600"><span class="">Connected</span></p>
                    </div>
                </div>

                <div class="flex flex-row px-5 py-2 items-center border-b">
                    <div class="flex-initial">
            <span class="text-orange-500">
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path
                      fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
            </span>
                    </div>
                    <div class="flex-1 flex-col">
                        <h2 class="text-sm text-right text-gray-800 font-medium">Traefik</h2>
                        <p class="text-right text-sm text-gray-600"><span class="">Connecting</span></p>
                    </div>
                </div>

                <div class="flex flex-row px-5 py-2 items-center border-b">
                    <div class="flex-initial">
            <span class="text-red-600">
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path
                      fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
            </span>
                    </div>
                    <div class="flex-1 flex-col">
                        <h2 class="text-sm text-right text-gray-800 font-medium">Consul</h2>
                        <p class="text-right text-sm text-gray-600"><span class="">Disconnected</span></p>
                    </div>
                </div>

                <div class="flex-grow"></div>

                <div class="px-5 text-white h-10 flex flex-col">
                    <div class="flex flex-row-reverse items-center flex-grow text-gray-700">
                        <a href="">
                            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                                 height="16">
                                <path fill-rule="evenodd"
                                      d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <router-view class="flex-grow"></router-view>
        </div>
    </div>
</template>