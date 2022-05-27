<script setup lang="ts">
async function connectWallet() {
  const { $connectWallet } = useNuxtApp();
  await $connectWallet();
}
</script>


<template>
  <button type="button" @click="connectWallet">
    <slot>Connect Wallet</slot>
  </button>
</template>
