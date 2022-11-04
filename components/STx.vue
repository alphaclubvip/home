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
  <div v-if="txName"
    class="mx-auto w-full md:w-10/12 lg:w-4/5 xl:w-3/4 border rounded-md py-6 flex flex-col justify-center"
    :class="{ 'animate-pulse items-center ': !tx, 'border-rose-500 bg-rose-50': true === txFailed, 'border-green-500 bg-green-50': false === txFailed, 'border-indigo-500 bg-indigo-50': undefined == txFailed }">

    <ClockIcon v-if="!txReceipt" class="block mx-auto text-gray-300 h-16 w-16" :class="{ 'animate-pulse': tx }" />
    <XCircleIcon v-else-if="true == txFailed" class="block mx-auto h-16 w-16 text-rose-700" />
    <CheckCircleIcon v-else class="block mx-auto h-16 w-16 text-green-700" />

    <!-- title -->
    <div class="mx-auto mt-4 font-semibold text-xl lg:text-2xl"
      :class="{ 'text-rose-700': true === txFailed, 'text-green-700': false === txFailed, 'text-indigo-700': undefined == txFailed }">
      {{ txName }}
      <template v-if="txReceipt">
        <template v-if="!txReceipt.status">
          Failed
        </template>
        <template v-else>
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
        </template>
      </template>
    </div>
    <template v-if="tx">
      <div class="mx-auto mt-2 flex flex-col justify-center md:flex-row md:gap-x-2 font-mono"
        :class="[txReceipt ? 'text-gray-800' : 'text-gray-500']">
        <div>
          <SlicedStr :value="tx.hash" :max-length="30" />
        </div>

        <div v-if="txReceipt">
          in Block
          <FormattedBN prefix="#" :bn-value="ethers.BigNumber.from(txReceipt.blockNumber)" />
        </div>
      </div>


      <div v-if="txReceipt && txReceipt.transactionHash === tx.hash"
        class="mx-auto mt-4 font-mono text-lg text-gray-500">
        <span>
          Gas Used:
        </span>
        <span class="inline-flex gap-1">
          <span v-if="nativeCurrency">
            {{ nativeCurrency }}
          </span>
          <span>
            <FormattedBN :bn-value="txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)" :decimals="nativeDecimals"
              :padding="9" />
            {{ nativeSymbol }}
          </span>
        </span>
      </div>
      <div v-else class="mx-auto mt-4 font-mono md:text-lg text-gray-500 animate-pulse">
        Waiting for confirmations...
      </div>
    </template>
  </div>
</template>
