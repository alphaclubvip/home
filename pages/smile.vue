<script setup lang="ts">

const account = useWeb3Account();
const address = useWeb3Address();
const balance = useWeb3Balance();
const accountENS = useWeb3AccountENS();
const accountAvatar = web3AccountAvatar();
const chainId = useWeb3ChainId();

onMounted(async function () {
  console.log("/test");
});
</script>

<template>
  <LAutoWidth class="py-8">
    <div>TEST PAGE</div>
    <div>
      SliceStr:
      <SlicedStr :value="account" :max-length="13" />
    </div>
    <div>{{ accountENS }} {{ account }} {{ accountAvatar }} {{ chainId }}</div>
    <div>{{ address }}</div>
    <div>
      <FormattedBN :bn-value="balance" :decimals="18" /> ETH
    </div>
    <div>
      <Avatar :seed="account" class="h-48 w-48 border border-gray-300 rounded-full" />
    </div>
    <!-- <div>{{ web3 }}</div>
    <button class="my-6" @click="kkk">666</button> -->
  </LAutoWidth>
</template>
