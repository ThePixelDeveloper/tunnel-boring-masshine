<template>
  <div class="flex-grow">
    <div class="flex flex-col flex-grow h-screen justify-center">
      <div class="pt-3 pr-5 pb-5 pl-5">
        <h1 class="mt-5 mb-5 text-xl font-medium text-center">Welcome to SSH Tunnel Manager</h1>
        <router-link tag="button" class="mx-auto block bg-gray-200 py-2 px-4 rounded border font-medium" to="/new-tunnel">Create your first SSH Tunnel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
}
</script>
