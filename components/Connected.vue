<script setup lang="ts">
import { LockOpenIcon } from "@heroicons/vue/outline";

// interface Props {
//   chainIds: {
//     type: number[],
//     required: false,
//   },
// }
// const props = defineProps<Props>();
const props = defineProps(['chainIds']);
const account = useWeb3Account();
const chainId = useWeb3ChainId();
const available = computed(() => {
  if (!props.chainIds) {
    return true;
  }

  for (const _i in props.chainIds) {
    if (chainId.value === props.chainIds[_i]) {
      return true;
    }
  }

  return false;
});
</script>

<template>
  <div v-if="account">
    <slot v-if="available" />
    <LAutoWidth v-else class="py-16 px-12">
      <div>
        Only Available (Chain ID):
      </div>
      <div class="mt-4 flex gap-2">
        <span v-for="(_chainId, _index) in props.chainIds">
          {{ _chainId }}
        </span>
      </div>
    </LAutoWidth>
  </div>
  <LAutoWidth v-else class="py-16 px-12">
    <ConnectWallet
      class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-24 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <LockOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
      <span class="mt-4 block font-mono font-medium text-gray-400">
        Connect Wallet to Continue...
      </span>
    </ConnectWallet>
  </LAutoWidth>
</template>
