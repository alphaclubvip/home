<script setup lang="ts">
import { ethers } from "ethers";

const details = ref(false);
const tracking = ref();
const nextBlock = ref();
const pendingTransactions = ref([]);
const pendingTransactionsByMaxFee = ref([]);
const percent = ref(200);

const account = useWeb3Account();

const baseFee = computed(() => {
  if (!nextBlock) {
    return ethers.BigNumber.from("0");
  }

  return ethers.BigNumber.from(parseInt(nextBlock.value.baseFeePerGas));
});

const length = computed(() => {
  return Math.min(
    pendingTransactions.value.length,
    pendingTransactionsByMaxFee.value.length
  );
});

const frontIndex = computed(() => {
  if (length.value) {
    return Math.min(
      length.value - 1,
      length.value - Math.floor((length.value / 1000) * percent.value)
    );
  }

  return 0;
});

const maxPriorityFeePerGas = computed(() => {
  if (!pendingTransactions.value.length) {
    return ethers.BigNumber.from("0");
  }

  return maxPriorityFeePerGasOf(pendingTransactions.value[frontIndex.value]);
});

const maxFeePerGas = computed(() => {
  if (!pendingTransactionsByMaxFee.value.length) {
    return ethers.BigNumber.from("0");
  }

  return maxFeePerGasOf(pendingTransactionsByMaxFee.value[frontIndex.value]);
});

function maxFeePerGasOf(tx: ethers.Transaction) {
  return tx.type === 2 ? tx.maxFeePerGas : tx.gasPrice;
}

function maxPriorityFeePerGasOf(tx: ethers.Transaction) {
  return tx.type === 2
    ? tx.maxPriorityFeePerGas
    : tx.gasPrice.sub(baseFee.value);
}

function sortTransactionByMaxPriorityFee(
  a: ethers.Transaction,
  b: ethers.Transaction
) {
  const feeA = maxPriorityFeePerGasOf(a);
  const feeB = maxPriorityFeePerGasOf(b);
  return feeB.sub(feeA).toNumber();
}

function sortTransactionByMaxFee(a: ethers.Transaction, b: ethers.Transaction) {
  const feeA = maxFeePerGasOf(a);
  const feeB = maxFeePerGasOf(b);
  return feeB.sub(feeA).toNumber();
}

async function track() {
  const { $web3 } = useNuxtApp();
  const block = await $web3.getBlockWithTransactions("pending");

  nextBlock.value = block;

  pendingTransactions.value = Array(...block.transactions);
  pendingTransactions.value.sort(sortTransactionByMaxPriorityFee);

  pendingTransactionsByMaxFee.value = Array(...block.transactions);
  pendingTransactionsByMaxFee.value.sort(sortTransactionByMaxFee);
}

function keepTracking() {
  if (account.value) {
    startTracking();
  } else {
    stopTracking();
  }
}

function startTracking() {
  if (!tracking.value) {
    console.log("Start tracking...");
    tracking.value = window.setInterval(track, 3000);
  }
}

function stopTracking() {
  if (tracking.value) {
    console.log("Stop tracking...");
    clearInterval(tracking.value);
    tracking.value = null;
  }
}

function showTransactions() {
  details.value = true;
}

function updatePencent(value: number) {
  percent.value = value;
}

watch(account, () => {
  if (account.value) {
    startTracking();
  } else {
    stopTracking();
  }
});

onMounted(async () => {
  keepTracking();
});

onUnmounted(() => {
  stopTracking();
});
</script>


<template>
  <div>
    <div class="bg-gray-800">
      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:pt-20"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
            Aggressive Gas Price Monitor
          </h2>
          <p class="mt-3 text-xl text-indigo-200 sm:mt-4">
            <template v-if="nextBlock">
              Based on {{ nextBlock.transactions.length }} pending transactions
              in the next BLOCK#{{ nextBlock.number }}
            </template>
            <template v-else>
              Track pending transactions (mempool) on Ethereum Blockchain
              Mainnet
            </template>
          </p>
        </div>
        <div v-if="!account" class="text-center">
          <ConnectWallet
            class="mt-8 jt-btn-md white focus:ring-offset-gray-800"
          >
            <span class="animate-pulse"> Connect Wallet to START </span>
          </ConnectWallet>
        </div>
        <div v-else-if="!nextBlock" class="mt-16 flex justify-center">
          <LogoAC class="px-auto h-16 w-auto animate-bounce text-gray-400" />
        </div>
        <div v-else>
          <dl
            class="
              mt-10
              text-center
              sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8
            "
          >
            <div class="flex flex-col">
              <dt
                class="
                  order-2
                  mt-2
                  text-lg
                  leading-6
                  font-medium
                  text-indigo-200
                "
              >
                Max Priority Fee
              </dt>
              <dd class="order-1 text-5xl font-extrabold text-white">
                <FormattedBN
                  :bn-value="maxPriorityFeePerGas"
                  :decimals="9"
                  :padding="2"
                />
              </dd>
            </div>
            <div class="flex flex-col mt-10 sm:mt-0">
              <dt
                class="
                  order-2
                  mt-2
                  text-lg
                  leading-6
                  font-medium
                  text-indigo-200
                "
              >
                Max Fee
              </dt>
              <dd class="order-1 text-5xl font-extrabold text-white">
                <FormattedBN
                  :bn-value="maxFeePerGas"
                  :decimals="9"
                  :padding="2"
                />
              </dd>
            </div>
            <div class="flex flex-col mt-10 sm:mt-0">
              <dt
                class="order-2 mt-2 text-lg leading-6 font-medium text-gray-500"
              >
                Base Fee
              </dt>
              <dd class="order-1 text-5xl font-extrabold text-gray-500">
                <FormattedBN :bn-value="baseFee" :decimals="9" :padding="2" />
              </dd>
            </div>
          </dl>

          <GasPosition @percent-updated="updatePencent" class="pt-20" />
        </div>
      </div>
    </div>

    <LAutoWidth v-if="nextBlock" class="py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
      <GasCalculator
        :max-priority-fee-per-gas="maxPriorityFeePerGas"
        :max-fee-per-gas="maxFeePerGas"
        :base-fee-per-gas="baseFee"
      />
    </LAutoWidth>

    <div v-if="nextBlock" class="bg-gray-100">
      <LAutoWidth class="py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <GasTips />
      </LAutoWidth>
    </div>

    <GasTxsTable
      v-if="nextBlock"
      :next-block="nextBlock"
      :pending-transactions="pendingTransactions"
      :front-index="frontIndex"
      class="py-20"
    />

    <LAutoWidth class="pt-8">
      <GasLinks />
    </LAutoWidth>
  </div>
</template>
