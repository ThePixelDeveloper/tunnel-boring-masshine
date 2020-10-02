<template>
  <form @submit.prevent="handleSubmit" class="h-screen flex flex-col">
    <div class="pt-3 pr-5 pb-5 pl-5 border-b border-dashed">
      <h2 class="text-sm font-medium mb-3">Name</h2>
      <div class="flex-row">
        <input
          class="border px-2 py-1 rounded w-48 text-sm"
          type="text"
          placeholder="Tunnel name"
          v-model.trim="tunnel.name"
        />
      </div>
      <div
        class="flex-row mt-2"
        v-if="!$v.tunnel.name.required && $v.tunnel.name.$error"
      >
        <span class="text-red-600 text-sm">The tunnel name is required.</span>
      </div>
    </div>
    <div class="pt-3 pr-5 pb-5 pl-5 border-b border-dashed">
      <h2 class="text-sm font-medium mb-3">SSH Connection Details</h2>
      <div class="flex flex-row items-center">
        <input
          class="border px-2 py-1 rounded w-48 flex-none text-sm"
          type="text"
          placeholder="Username"
          v-model.trim="tunnel.username"
        />
        <span class="mx-1">@</span>
        <input
          class="border px-2 py-1 rounded w-48 flex-auto text-sm"
          type="text"
          placeholder="IP Address or hostname"
          v-model.trim="tunnel.hostname"
        />
        <span class="mx-1">:</span>
        <input
          class="border px-2 py-1 rounded w-20 text-sm"
          type="number"
          placeholder="Port"
          v-model.number="tunnel.port"
        />
      </div>
      <div
        class="flex-row mt-2"
        v-if="
          $v.tunnel.username.$error ||
          $v.tunnel.hostname.$error ||
          $v.tunnel.port.$error
        "
      >
        <ul class="list-inside list-disc text-red-600">
          <li v-if="!$v.tunnel.username.required">
            <span class="text-sm">The username is required.</span>
          </li>
          <li v-if="!$v.tunnel.hostname.required">
            <span class="text-sm">The IP address/hostname is required.</span>
          </li>
          <li v-if="!$v.tunnel.port.required">
            <span class="text-sm">The port is required.</span>
          </li>
        </ul>
      </div>

      <h2 class="text-sm font-medium mt-5 mb-3">Private Key</h2>
      <div class="flex flex-row items-center">
        <button
          @click.prevent="privateKeyDialog"
          class="text-sm shadow rounded py-1 px-5 bg-gray-100 text-blue-500"
        >
          Choose
        </button>
        <input
          disabled="disabled"
          class="bg-gray-100 border px-2 py-1 rounded ml-5 flex-auto text-sm"
          type="text"
          v-model.trim="tunnel.privateKey"
        />
      </div>
      <div
        class="flex-row mt-2"
        v-if="!$v.tunnel.privateKey.required && $v.tunnel.privateKey.$error"
      >
        <span class="text-red-600 text-sm">An SSH key is required.</span>
      </div>
    </div>
    <div class="pt-3 pr-5 pb-5 pl-5">
      <div class="flex flex-row items-center mb-3">
        <h2 class="text-sm font-medium">Forwarding Rules</h2>
        <div class="mx-3">
          <div class="flex flex-row items-center">
            <span class="text-green-400">
              <svg
                class="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8z"
                ></path>
              </svg>
            </span>
            <p class="text-sm">This computer</p>
          </div>
        </div>
        <div class="mx-3">
          <div class="flex flex-row items-center">
            <span class="text-blue-400">
              <svg
                class="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8z"
                ></path>
              </svg>
            </span>
            <p class="text-sm">Target host</p>
          </div>
        </div>
      </div>
      <div v-for="(rule, i) in tunnel.rules" :key="i">
        <div class="flex flex-row items-center">
          <div
            class="flex flex-auto shadow-inner bg-green-200 rounded py-1 px-2"
          >
            <input
              class="flex-auto text-sm text-right text-green-700 placeholder-green-700 bg-transparent"
              placeholder="Bind address"
              type="text"
              v-model.trim="rule.local.address"
            />
            <span class="text-sm mx-1 text-green-700">:</span>
            <input
              class="w-20 text-sm text-green-700 placeholder-green-700 bg-transparent"
              placeholder="Port"
              type="number"
              v-model.number="rule.local.port"
            />
          </div>
          <div class="mx-3 text-black">
            <svg
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
            >
              <path
                fill-rule="evenodd"
                d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"
              ></path>
            </svg>
          </div>
          <div
            class="flex flex-auto shadow-inner bg-blue-200 rounded py-1 px-2"
          >
            <input
              class="flex-auto text-sm text-right text-blue-700 placeholder-blue-700 bg-transparent"
              placeholder="Target address"
              type="text"
              v-model.trim="rule.target.address"
            />
            <span class="text-sm mx-1 text-blue-700">:</span>
            <input
              class="w-20 text-sm text-blue-700 placeholder-blue-700 bg-transparent"
              placeholder="Port"
              type="number"
              v-model.number="rule.target.port"
            />
          </div>
        </div>
        <div class="flex-row mt-2">
          <ul class="list-inside list-disc text-red-600">
            <li
              class="text-red-600 text-sm"
              v-if="
                !$v.tunnel.rules.$each.$iter[i].local.address.required &&
                $v.tunnel.rules.$each.$iter[i].local.address.$error
              "
            >
              A local address is required.
            </li>
            <li
              class="text-red-600 text-sm"
              v-if="
                !$v.tunnel.rules.$each.$iter[i].local.port.required &&
                $v.tunnel.rules.$each.$iter[i].local.port.$error
              "
            >
              A local port is required.
            </li>
            <li
              class="text-red-600 text-sm"
              v-if="
                !$v.tunnel.rules.$each.$iter[i].target.address.required &&
                $v.tunnel.rules.$each.$iter[i].target.address.$error
              "
            >
              A target address is required.
            </li>
            <li
              class="text-red-600 text-sm"
              v-if="
                !$v.tunnel.rules.$each.$iter[i].target.port.required &&
                $v.tunnel.rules.$each.$iter[i].target.port.$error
              "
            >
              A target port is required.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex-grow"></div>
    <slot></slot>
  </form>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import ipc from "../renderer/utils/ipc";

export default {
  name: "TunnelForm",
  components: {},
  props: {
    name: String,
    username: String,
    hostname: String,
    port: {
      type: Number,
      default: 22,
    },
    privateKey: String,
    rules: {
      type: Array,
      default: () => {
        return [
          {
            local: {
              address: "localhost",
              port: null,
            },
            target: {
              address: "localhost",
              port: null,
            },
          },
        ];
      },
    },
  },
  data() {
    return {
      tunnel: {
        name: this.name,
        username: this.username,
        hostname: this.hostname,
        port: this.port,
        privateKey: this.privateKey,
        rules: this.rules,
      },
    };
  },
  computed: {
    ruleIndices() {
      if (this.tunnel.rules === undefined) {
        return [0];
      } else {
        return Object.keys(this.tunnel.rules);
      }
    },
  },
  validations: {
    tunnel: {
      name: {
        required,
      },
      username: {
        required,
      },
      hostname: {
        required,
      },
      port: {
        required,
      },
      privateKey: {
        required,
      },
      rules: {
        required,
        $each: {
          local: {
            address: {
              required,
            },
            port: {
              required,
            },
          },
          target: {
            address: {
              required,
            },
            port: {
              required,
            },
          },
        },
      },
    },
  },
  methods: {
    async privateKeyDialog() {
      this.tunnel.privateKey = await ipc.privateKeyDialog();
    },
    handleSubmit() {
      this.$v.tunnel.$touch();

      if (this.$v.tunnel.$invalid) {
        return;
      }

      this.$emit("handle-submit", this.tunnel);
    },
  },
};
</script>
