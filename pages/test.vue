<script setup lang="ts">
import { ethers } from "ethers";

const account = useWeb3Account();
const address = useWeb3Address();
const accountENS = useWeb3AccountENS();
const accountAvatar = web3AccountAvatar();
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
    <div>{{ accountENS }} {{ account }} {{ accountAvatar }} {{ chainId }}</div>
    <div>{{ address }}</div>
    <!-- <div>{{ web3 }}</div>
    <button class="my-6" @click="kkk">666</button> -->
  </LAutoWidth>
</template>

