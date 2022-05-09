<script setup lang="ts">
const account = computed(() => {
  return useState("account").value;
});

const address = computed(() => {
    if (account) {
        return account.value.slice(0, 6) + '...' + account.value.slice(-4);
    } else {
        return ''
    }
});

async function connectWallet() {
  const { $fn } = useNuxtApp();
  const web3fn = $fn();
  await web3fn.connectWallet();
}
</script>


<template>
  <div>
    <span v-if="account" class="font-mono">{{ address }}</span>
    <button
      v-else
      type="button"
      class="
        relative
        inline-flex
        items-center
        px-4
        py-2
        border border-transparent
        text-sm
        font-medium
        rounded-md
        text-white
        bg-indigo-600
        shadow-sm
        hover:bg-indigo-700
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-indigo-500
      "
      @click="connectWallet"
    >
      <span>Connect Wallet</span>
    </button>
  </div>
</template>
