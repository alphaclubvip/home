<template>
  <LAutoWidth>
    <div>TEST</div>
  </LAutoWidth>
</template>

<script setup lang="ts">
const { $providers, $fn } = useNuxtApp();

const web3fn = $fn();
const providers = $providers();

onMounted(async function () {
  console.log('/test')

  // const chainId = await web3fn.getChainId(providers.ETH);
  // console.log('chainId:', chainId, typeof(chainId))
})

</script>
