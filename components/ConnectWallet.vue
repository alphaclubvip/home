<script setup lang="ts">
async function connectWallet() {
  const { $fn } = useNuxtApp();
  const web3fn = $fn();
  await web3fn.connectWallet();
}
</script>


<template>
  <button type="button" @click="connectWallet">
    <slot>Connect Wallet</slot>
  </button>
</template>
