<script setup lang="ts">

const account = useWeb3Account();
const address = useWeb3Address();
const balance = useWeb3Balance();
const accountENS = useWeb3AccountENS();
const accountAvatar = web3AccountAvatar();
const chainId = useWeb3ChainId();

const nativeSymbol = useNativeSymbol();
const nativeDecimals = useNativeDecimals();

onMounted(async function () {
  console.log("/test");
});
</script>

<template>
  <Connected>
    <LAutoWidth class="py-8">
      <div>TEST PAGE</div>
      <div>
        <FormattedBN :bn-value="balance" :decimals="nativeDecimals" /> {{ nativeSymbol }}
      </div>
      <div>
        {{ chainId }}
      </div>
      <!-- <div>{{ web3 }}</div>
    <button class="my-6" @click="kkk">666</button> -->
    </LAutoWidth>
  </Connected>
</template>
