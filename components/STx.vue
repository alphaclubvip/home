<script setup lang="ts">
import { ethers } from "ethers";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/vue/outline";

const props = defineProps(['tx', 'txReceipt', 'txName', 'txReplaced']);

const nativeSymbol = useNativeSymbol();
const nativeCurrency = useNativeCurrency();
const nativeDecimals = useNativeDecimals();

const txFailed = computed(() => {
  if (props.txReceipt) {
    if (!props.txReceipt.status || 'cancelled' === props.txReplaced) {
      return true;
    }

    return false;
  }

  return undefined;
});
</script>

<template>
  <div v-if="txName" class="border rounded-md py-4 px-6 flex gap-4"
    :class="{ 'animate-pulse items-center ': !tx, 'border-rose-500 bg-rose-50': true === txFailed, 'border-green-500 bg-green-50': false === txFailed, 'border-indigo-500 bg-indigo-50': undefined == txFailed }">
    <div class="grow-0">
      <ClockIcon v-if="!txReceipt" class="block text-gray-300" :class="[tx ? 'animate-pulse h-16 w-16' : 'h-8 w-8']" />
      <XCircleIcon v-else-if="true == txFailed" class="block h-16 w-16 text-rose-700" />
      <CheckCircleIcon v-else class="block h-16 w-16 text-green-700" />
    </div>
    <div class="break-words">
      <div class="font-semibold text-xl"
        :class="{ 'text-rose-700': true === txFailed, 'text-green-700': false === txFailed, 'text-indigo-700': undefined == txFailed }">
        {{ txName }}
        <span v-if="txReceipt">
          <span v-if="!txReceipt.status">
            <span class="capitalize">
              {{ txReplaced }}
            </span> in Block
            <FormattedBN prefix="#" :bn-value="ethers.BigNumber.from(txReceipt.blockNumber)" />
          </span>
          <span v-else>
            <span v-if="txReplaced" class="capitalize">
              <template v-if="'repriced' === txReplaced">
                Speed Up Confirmed
              </template>
              <template v-else>
                {{ txReplaced }}
              </template>
            </span>
            <span v-else>
              Confirmed
            </span>
            in Block
            <FormattedBN prefix="#" :bn-value="ethers.BigNumber.from(txReceipt.blockNumber)" />
          </span>
        </span>
      </div>

      <div v-if="tx" class="mt-1">
        <div class="font-mono truncate">
          Tx Hash: {{ tx.hash }}
        </div>

        <div v-if="txReceipt && txReceipt.transactionHash === tx.hash" class="mt-4 font-mono text-lg text-gray-500">
          <span>
            Gas Used:
          </span>
          <span class="inline-flex gap-1">
            <span v-if="nativeCurrency">
              {{ nativeCurrency }}
            </span>
            <span>
              <FormattedBN :bn-value="txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)" :decimals="nativeDecimals" />
              {{ nativeSymbol }}
            </span>
          </span>
        </div>
        <div v-else class="mt-4 animate-pulse font-mono text-lg text-gray-400">
          Wating for confirmations...
        </div>
      </div>
    </div>
  </div>
</template>
