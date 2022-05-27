<script setup lang="ts">
import { ethers } from "ethers";

const account = useWeb3Account();
const chainId = useWeb3ChainId();

onMounted(async function () {
  console.log("/test");

  // console.log($ETH);
  // console.log(await $ETH.getBlockNumber());

  // const balance = await $ETH.getBalance("lota.eth");

  // console.log(await $ETH.getBalance("lota.eth"));

  // console.log(ethers.utils.formatEther(balance));

  // const { $providers, $fn } = useNuxtApp();

  // const web3fn = $fn();
  // const providers = $providers();

  // const chainId = await web3fn.getChainId(providers.ETH);
  // console.log('chainId:', chainId, typeof(chainId))
});

// const web3 = computed(() => {
//   const { $web3 } = useNuxtApp();

//   return $web3;
// });

// async function kkk() {
//   console.log(this.web3);
// }
</script>


<template>
  <LAutoWidth class="py-8">
    <div>TEST PAGE</div>
    <div>{{ account }} {{ typeof account }} {{ chainId }}</div>
    <!-- <div>{{ web3 }}</div>
    <button class="my-6" @click="kkk">666</button> -->
  </LAutoWidth>
</template>

