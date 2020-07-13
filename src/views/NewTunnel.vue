<template>
  <div class="new-tunnel">
    <NewTunnel></NewTunnel>
  </div>
</template>

<script>
  // @ is an alias to /src
  import NewTunnel from "../components/NewTunnel";

  export default {
    name: 'NewTunnelView',
    components: {
      NewTunnel
    }
  }
</script>
