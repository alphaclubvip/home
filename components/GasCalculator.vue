<script setup lang="ts">
import { ethers } from "ethers";

const gasLimit = ref<String>();
const masPriorityFee = ref<String>();
const maxFee = ref<String>();
const baseFee = ref<String>();
const txType = ref("21000");
const txTypes = [
  { text: "Transfer (Wallet => Wallet)", value: "21000" },
  { text: "Transfer USDT", value: "46109" },
  { text: "Transfer USDC", value: "48481" },
  { text: "Transfer DAI", value: "34718" },
  { text: "Uniswap v3", value: "129830" },
  { text: "Uniswap v2", value: "105657" },
  { text: "1inch", value: "104108" },
  { text: "SushiSwap", value: "109253" },
  { text: "0x", value: "114931" },
  { text: "Other (Fill the Gas Limit)", value: "0" },
];

const bnGasLimit = computed(() => {
  if (gasLimit.value) {
    return ethers.BigNumber.from(gasLimit.value);
  }

  return ethers.BigNumber.from(txType.value);
});

const bnMaxPriorityFee = computed(() => {
  if (masPriorityFee.value) {
    return ethers.BigNumber.from(
      Math.floor(parseFloat(String(masPriorityFee.value)) * 1000000000)
    );
  }

  return ethers.BigNumber.from(
    Math.floor(parseFloat(strBN(props.maxPriorityFeePerGas)) * 1000000000)
  );
});

const bnMaxFee = computed(() => {
  if (maxFee.value) {
    return ethers.BigNumber.from(
      Math.floor(parseFloat(String(maxFee.value)) * 1000000000)
    );
  }

  return ethers.BigNumber.from(
    Math.floor(parseFloat(strBN(props.maxFeePerGas)) * 1000000000)
  );
});

const bnBaseFee = computed(() => {
  if (baseFee.value) {
    return ethers.BigNumber.from(
      Math.floor(parseFloat(String(baseFee.value)) * 1000000000)
    );
  }

  return ethers.BigNumber.from(
    Math.floor(parseFloat(strBN(props.baseFeePerGas)) * 1000000000)
  );
});

const bnFee = computed(() => {
  return bnMaxPriorityFee.value.add(bnBaseFee.value);
});

const bnWei = computed(() => {
  if (bnFee.value.gt(bnMaxFee.value)) {
    return bnMaxWei.value;
  }

  return bnGasLimit.value.mul(bnFee.value);
});

const bnMaxWei = computed(() => {
  return bnGasLimit.value.mul(bnMaxFee.value);
});

const strBN = function (bn: ethers.BigNumber) {
  const DECIMALS = 9;
  const PADDING = 2;
  const s = bn.toString().trim().replace(new RegExp("^0+"), "");

  let obj = { i: "0", f: "" };

  if (DECIMALS < s.length) {
    const pos = s.length - DECIMALS;
    obj.i = s.slice(0, pos);
    obj.f = s.slice(pos);
  } else {
    obj.f = s;

    while (DECIMALS > obj.f.length) {
      obj.f = "0" + obj.f;
    }
  }

  if (obj.f) {
    obj.f = obj.f.replace(new RegExp("0+$"), "");
  }

  while (PADDING > obj.f.length) {
    obj.f = obj.f + "0";
  }

  if (PADDING < obj.f.length) {
    obj.f = obj.f.slice(0, PADDING);
  }

  return obj.f ? `${obj.i}.${obj.f}` : obj.i;
};

const props = defineProps({
  maxPriorityFeePerGas: {
    type: ethers.BigNumber,
    default: ethers.BigNumber.from(0),
  },

  maxFeePerGas: {
    type: ethers.BigNumber,
    default: ethers.BigNumber.from(0),
  },

  baseFeePerGas: {
    type: ethers.BigNumber,
    default: ethers.BigNumber.from(0),
  },
});

const formatGasFeeInput = function (s: String) {
  return s
    .replace("。", ".")
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "#")
    .replace(/\./g, "")
    .replace("#", ".")
    .replace(new RegExp("^(\\d+)\\.(\\d{0,9}).*$"), "$1.$2");
};

watch(gasLimit, () => {
  gasLimit.value = gasLimit.value.replace(/[^\d]/g, "");
});

watch(masPriorityFee, () => {
  masPriorityFee.value = formatGasFeeInput(masPriorityFee.value);
});

watch(maxFee, () => {
  maxFee.value = formatGasFeeInput(maxFee.value);
});

watch(baseFee, () => {
  baseFee.value = formatGasFeeInput(baseFee.value);
});
</script>

<template>
  <div>
    <h2 class="text-3xl font-extrabold text-gray-900">Gas Calculator</h2>
  </div>

  <dl class="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-500">
        Transaction Fee
      </dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div
          class="
            flex
            items-baseline
            gap-1
            text-2xl
            font-semibold
            text-indigo-600
          "
        >
          <span>Ξ</span>
          <FormattedBN :bn-value="bnWei" :decimals="18" />
        </div>
      </dd>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-500">
        Max Transaction Fee
      </dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div
          class="
            flex
            items-baseline
            gap-1
            text-2xl
            font-semibold
            text-indigo-600
          "
        >
          <span>Ξ</span>
          <FormattedBN :bn-value="bnMaxWei" :decimals="18" />
        </div>
      </dd>
    </div>
  </dl>

  <div
    class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6 lg:grid-cols-12"
  >
    <div class="md:col-span-3 lg:col-span-4">
      <label for="tx-type" class="block text-sm font-medium text-gray-700">
        Transaction Type
      </label>
      <div class="mt-1">
        <select
          id="tx-type"
          name="tx-type"
          class="
            shadow-sm
            focus:ring-indigo-500 focus:border-indigo-500
            block
            w-full
            font-mono
            sm:text-sm
            border-gray-300
            rounded-md
          "
          v-model="txType"
        >
          <option
            v-for="option in txTypes"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="md:col-span-3 lg:col-span-2">
      <label for="gas-limit" class="block text-sm font-medium text-gray-700">
        Gas Limit
      </label>
      <div class="mt-1">
        <input
          type="text"
          name="gas-limit"
          id="gas-limit"
          class="
            shadow-sm
            focus:ring-indigo-500 focus:border-indigo-500
            block
            w-full
            sm:text-sm
            border-gray-300
            rounded-md
          "
          v-model="gasLimit"
          :placeholder="txType"
        />
      </div>
    </div>

    <div class="md:col-span-2 lg:col-span-2">
      <label
        for="max-priority-fee"
        class="block text-sm font-medium text-gray-700"
      >
        Max Priority Fee
      </label>
      <div class="mt-1 relative">
        <input
          type="text"
          name="max-priority-fee"
          id="max-priority-fee"
          class="
            shadow-sm
            focus:ring-indigo-500 focus:border-indigo-500
            block
            w-full
            pr-16
            sm:text-sm
            border-gray-300
            rounded-md
          "
          v-model="masPriorityFee"
          :placeholder="strBN(props.maxPriorityFeePerGas)"
        />
        <div
          class="
            absolute
            inset-y-0
            right-0
            pr-3
            flex
            items-center
            pointer-events-none
          "
        >
          <span class="text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>

    <div class="md:col-span-2 lg:col-span-2">
      <label for="max-fee" class="block text-sm font-medium text-gray-700">
        Max Fee
      </label>
      <div class="mt-1 relative">
        <input
          type="text"
          name="max-fee"
          id="max-fee"
          class="
            shadow-sm
            focus:ring-indigo-500 focus:border-indigo-500
            block
            w-full
            pr-16
            sm:text-sm
            border-gray-300
            rounded-md
          "
          v-model="maxFee"
          :placeholder="strBN(props.maxFeePerGas)"
        />
        <div
          class="
            absolute
            inset-y-0
            right-0
            pr-3
            flex
            items-center
            pointer-events-none
          "
        >
          <span class="text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>

    <div class="md:col-span-2 lg:col-span-2">
      <label for="base-fee" class="block text-sm font-medium text-gray-700">
        Base Fee
      </label>
      <div class="mt-1 relative">
        <input
          type="text"
          name="base-fee"
          id="base-fee"
          class="
            shadow-sm
            focus:ring-indigo-500 focus:border-indigo-500
            block
            w-full
            pr-16
            sm:text-sm
            border-gray-300
            rounded-md
          "
          v-model="baseFee"
          :placeholder="strBN(props.baseFeePerGas)"
        />
        <div
          class="
            absolute
            inset-y-0
            right-0
            pr-3
            flex
            items-center
            pointer-events-none
          "
        >
          <span class="text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
input {
  @apply font-mono;
}
</style>
