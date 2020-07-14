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
        components: {Sidebar}
    }
</script>
