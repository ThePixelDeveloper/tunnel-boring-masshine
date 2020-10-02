<template>
  <div class="flex flex-col overflow-y-auto h-screen">
    <TunnelForm v-on:handle-submit="handleSubmit">
      <div class="bg-gray-200 px-5 text-white py-2 flex flex-col">
        <div class="flex flex-row-reverse items-center flex-grow">
          <button
            class="font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-blue-500"
          >
            Create
          </button>
          <router-link
            tag="button"
            class="mx-1 font-medium text-xs shadow rounded py-1 px-5 bg-gray-100 text-gray-500"
            to="/"
            >Cancel
          </router-link>
        </div>
      </div>
    </TunnelForm>
  </div>
</template>

<script>
// @ is an alias to /src
import TunnelForm from "../components/TunnelForm";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "NewTunnelView",
  components: {
    TunnelForm,
  },
  methods: {
    handleSubmit(tunnel) {
      tunnel.id = uuidv4();

      this.$store.commit("createTunnel", tunnel);
      this.$router.push("/tunnel/" + tunnel.id);
    },
  },
};
</script>
