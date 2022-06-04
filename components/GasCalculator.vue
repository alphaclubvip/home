<script setup lang="ts">
import { ethers } from "ethers";

const nativeCurrency = useNativeCurrency();

const gasLimit = ref<String>("21000");
const masPriorityFee = ref<String>();
const maxFee = ref<String>();
const baseFee = ref<String>();
const showFullTxTypes = ref<Boolean>(false);
function toogleShowFullTxTypes() {
  showFullTxTypes.value = !showFullTxTypes.value;
}
const txTypes = [
  {
    text: "Transfer (Wallet => Wallet)",
    bn: ethers.BigNumber.from(21000),
  },
  {
    text: "Transfer USDT",
    bn: ethers.BigNumber.from(46109),
  },
  {
    text: "Transfer USDC",
    bn: ethers.BigNumber.from(48481),
  },
  {
    text: "Transfer DAI",
    bn: ethers.BigNumber.from(34718),
  },
  {
    text: "OpenSea - Register Account",
    bn: ethers.BigNumber.from(389335),
  },
  {
    text: "Uniswap v3 - Swap",
    bn: ethers.BigNumber.from(129830),
  },
  {
    text: "Uniswap v3 - Add Liquidity",
    bn: ethers.BigNumber.from(445784),
  },
  {
    text: "Uniswap v3 - Remove Liquidity",
    bn: ethers.BigNumber.from(221722),
  },
  {
    text: "Uniswap v2 - Swap",
    bn: ethers.BigNumber.from(105657),
  },
  {
    text: "Uniswap v2 - Add Liquidity",
    bn: ethers.BigNumber.from(131820),
  },
  {
    text: "Uniswap v2 - Remove Liquidity",
    bn: ethers.BigNumber.from(180244),
  },
  {
    text: "1inch - Swap",
    bn: ethers.BigNumber.from(104108),
  },
  {
    text: "SushiSwap",
    bn: ethers.BigNumber.from(109253),
  },
  {
    text: "0x",
    bn: ethers.BigNumber.from(114931),
  },
  {
    text: "Curve - Swap",
    bn: ethers.BigNumber.from(114651),
  },
  {
    text: "Curve - Add Liquidity",
    bn: ethers.BigNumber.from(182725),
  },
  {
    text: "Curve - Remove Liquidity",
    bn: ethers.BigNumber.from(162054),
  },
];

const bnGasLimit = computed(() => {
  if (gasLimit.value) {
    return ethers.BigNumber.from(gasLimit.value);
  }

  return ethers.BigNumber.from(21000);
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
        <div class="flex items-baseline gap-1 text-2xl font-semibold text-indigo-600">
          <FormattedBN :bn-value="bnWei" :decimals="18" :prefix="nativeCurrency" />
        </div>
      </dd>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-500">
        Max Transaction Fee
      </dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div class="flex items-baseline gap-1 text-2xl font-semibold text-indigo-600">
          <FormattedBN :bn-value="bnMaxWei" :decimals="18" :prefix="nativeCurrency" />
        </div>
      </dd>
    </div>
  </dl>

  <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6 lg:grid-cols-12">
    <div class="md:col-span-3">
      <label for="gas-limit" class="block text-sm font-medium text-gray-700">
        Gas Limit
      </label>
      <div class="mt-1">
        <input type="text" name="gas-limit" id="gas-limit" autocomplete="off"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
          v-model="gasLimit" placeholder="21000" />
      </div>
    </div>

    <div class="md:col-span-3">
      <label for="max-priority-fee" class="block text-sm font-medium text-gray-700">
        Max Priority Fee
      </label>
      <div class="mt-1 relative">
        <input type="text" name="max-priority-fee" id="max-priority-fee" autocomplete="off"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
          v-model="masPriorityFee" :placeholder="strBN(props.maxPriorityFeePerGas)" />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="font-mono text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>

    <div class="md:col-span-3">
      <label for="max-fee" class="block text-sm font-medium text-gray-700">
        Max Fee
      </label>
      <div class="mt-1 relative">
        <input type="text" name="max-fee" id="max-fee" autocomplete="off"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
          v-model="maxFee" :placeholder="strBN(props.maxFeePerGas)" />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="font-mono text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>

    <div class="md:col-span-3">
      <label for="base-fee" class="block text-sm font-medium text-gray-700">
        Base Fee
      </label>
      <div class="mt-1 relative">
        <input type="text" name="base-fee" id="base-fee" autocomplete="off"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
          v-model="baseFee" :placeholder="strBN(props.baseFeePerGas)" />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="font-mono text-gray-400 sm:text-sm"> GWei </span>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300 tx-table font-mono">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col">Tx Type</th>
                <th scope="col">Gas Limit</th>
                <th scope="col" class="end">Tx Fee</th>
                <th scope="col" class="end">Max Tx Fee</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <template v-for="(_row, _index) in txTypes" :key="_index">
                <tr v-if="3 > _index || showFullTxTypes">
                  <td>{{ _row.text }}</td>
                  <td>
                    <FormattedBN :bn-value="_row.bn" />
                  </td>
                  <td class="end">
                    <FormattedBN :bn-value="_row.bn.mul(bnFee)" :decimals="18" :padding="9" :prefix="nativeCurrency" />
                  </td>
                  <td class="end">
                    <FormattedBN :bn-value="_row.bn.mul(bnMaxFee)" :decimals="18" :padding="9"
                      :prefix="nativeCurrency" />
                  </td>
                </tr>
              </template>
              <tr v-if="!showFullTxTypes" @click="toogleShowFullTxTypes">
                <td colspan="4" class="w-full text-center hover:font-semibold">
                  Show More...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
