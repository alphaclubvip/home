<script setup lang="ts">
const account = useWeb3Account();
const address = useWeb3Address();
const balance = useWeb3Balance();
const accountENS = useWeb3AccountENS();


onMounted(async function () {
  console.log("/test");
});
</script>

<template>
  <Connected>
    <div class="bg-gray-800">
      <LAutoWidth class="py-16">
        <div class="lg:flex lg:justify-center">
          <Avatar :seed="account"
            class="h-36 w-36 border border-gray-300 rounded-full bg-white shadow shadow-gray-500/50" />
        </div>
        <div v-if="accountENS" class="lg:flex lg:justify-center pt-8 font-mono text-3xl text-gray-300">
          {{ accountENS }}
        </div>
        <div class="lg:flex lg:justify-center font-mono text-xl text-gray-300 truncate"
          :class="[accountENS ? 'pt-2' : 'pt-8']">
          {{ account }}
        </div>
        <div class="flex lg:justify-center gap-2 pt-2 font-semibold text-2xl text-gray-300">
          <FormattedBN :bn-value="balance" :decimals="18" />
          <span class="">
            ETH
          </span>
        </div>
      </LAutoWidth>
    </div>
  </Connected>
</template>
