<script setup lang="ts">
import { LockOpenIcon } from "@heroicons/vue/outline";

const account = useWeb3Account();
</script>

<template>
  <div v-if="account">
    <slot />
  </div>
  <LAutoWidth v-else class="py-16 px-12">
    <ConnectWallet type="button"
      class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-24 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <LockOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
      <span class="mt-4 block text-sm font-medium text-gray-900"> Connect Wallet to Continue... </span>
    </ConnectWallet>
  </LAutoWidth>
</template>
