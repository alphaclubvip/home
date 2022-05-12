<script setup lang="ts">
import { ethers, BigNumber } from "ethers";

const track = ref(false);
const interval = ref();
const nextBlock = ref();
const pendingTransactions = ref([]);
const pendingTransactionsByMaxFee = ref([]);

const account = computed(() => {
  const account = useState("account").value;
  if (account) {
    return String(account);
  } else {
    return String();
  }
});

const maxFeePerGas = computed(() => {
  if (!pendingTransactionsByMaxFee.value.length) {
    return BigNumber.from("0");
  }

  const i = Math.ceil((pendingTransactionsByMaxFee.value.length / 3) * 2);

  return maxFeePerGasOf(pendingTransactionsByMaxFee.value[i]);
});

const maxPriorityFeePerGas = computed(() => {
  if (!pendingTransactions.value.length) {
    return BigNumber.from("0");
  }

  const i = Math.ceil((pendingTransactions.value.length / 3) * 2);

  return maxPriorityFeePerGasOf(pendingTransactions.value[i]);
});

function maxFeePerGasOf(tx: ethers.Transaction) {
  return tx.type === 2 ? tx.maxFeePerGas : tx.gasPrice;
}

function maxPriorityFeePerGasOf(tx: ethers.Transaction) {
  return tx.type === 2
    ? tx.maxPriorityFeePerGas
    : tx.gasPrice.sub(nextBlock.value.baseFeePerGas);
}

function sortTransactionByMaxPriorityFee(
  a: ethers.Transaction,
  b: ethers.Transaction
) {
  return maxPriorityFeePerGasOf(b).sub(maxPriorityFeePerGasOf(a)).toNumber();
}

function sortTransactionByMaxFee(a: ethers.Transaction, b: ethers.Transaction) {
  return maxFeePerGasOf(b).sub(maxFeePerGasOf(a)).toNumber();
}

function gasPriceFromWei(n: ethers.BigNumber) {
  return Math.ceil(parseFloat(ethers.utils.formatUnits(n, "gwei")));
}

async function startToTrack() {
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
    interval.value = window.setInterval(startToTrack, 3000);
  } else {
    clearInterval(interval.value);
    interval.value = null;
  }
}

watch(account, async (account) => {
  track.value = account ? true : false;
  keepTracking();
});

onMounted(async () => {
  keepTracking();
});
</script>


<template>
  <div>
    <div class="bg-indigo-800">
      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
            Aggressive Gas Price Monitor
          </h2>
          <p class="mt-3 text-xl text-indigo-200 sm:mt-4">
            <template v-if="nextBlock">
              According to {{ nextBlock.transactions.length }} pending
              transactions in the next BLOCK#{{ nextBlock.number }}
            </template>
            <template v-else>
              Track pending transactions (mempool) on Ethereum Blockchain
              Mainnet
            </template>
          </p>
        </div>
        <div v-if="!account" class="text-center">
          <ConnectWallet
            class="
              mt-8
              w-full
              inline-flex
              items-center
              justify-center
              px-5
              py-3
              border border-transparent
              text-base
              font-medium
              rounded-md
              text-indigo-600
              bg-white
              hover:bg-indigo-50
              sm:w-auto
            "
          >
            Connect Wallet to Start
          </ConnectWallet>
        </div>
        <div
          v-else-if="!nextBlock"
          class="mt-12 text-center text-white text-2xl"
        >
          Launching...
        </div>
        <dl
          v-else
          class="
            mt-10
            text-center
            sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8
          "
        >
          <div class="flex flex-col">
            <dt
              class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200"
            >
              Max Priority Fee
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">
              {{ gasPriceFromWei(maxPriorityFeePerGas) }}
            </dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt
              class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200"
            >
              Max Fee
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">
              {{ gasPriceFromWei(maxFeePerGas) }}
            </dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt
              class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200"
            >
              Base Fee
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">
              {{ gasPriceFromWei(nextBlock.baseFeePerGas) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <LAutoWidth class="py-8">
      <GasLinks />
    </LAutoWidth>

    <GasTxsTable
      :next-block="nextBlock"
      :pending-transactions="pendingTransactions"
    />
  </div>
</template>
