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
    interval.value = window.setInterval(startToTrack, 3000)
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Repellendus repellat laudantium.
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
        <div v-else-if="!nextBlock" class="mt-12 text-center text-white text-2xl">
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

    <LAutoWidth class="py-8" v-if="nextBlock">
      <div class="mt-6 px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">
              {{
                nextBlock.transactions.length
                  ? nextBlock.transactions.length
                  : "___"
              }}
              Pending Transactions
            </h1>
            <p class="mt-2 text-sm text-gray-700">
              Pending transactions in next block
              <template v-if="nextBlock"> #{{ nextBlock.number }}</template>
              <template v-else> #___</template>
            </p>
          </div>
        </div>
        <div class="mt-8 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
            >
              <div
                class="
                  overflow-hidden
                  shadow
                  ring-1 ring-black ring-opacity-5
                  md:rounded-lg
                "
              >
                <table
                  class="
                    min-w-full
                    divide-y divide-gray-300
                    ac-table-s
                    font-mono
                  "
                >
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col">Hash</th>
                      <th scope="col">Type</th>
                      <th scope="col">Max Fee</th>
                      <th scope="col">Max Priority Fee</th>
                      <th scope="col">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="tx in pendingTransactions" :key="tx.hash">
                      <td>
                        {{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-4) }}
                      </td>
                      <td>
                        <template v-if="tx.type === 2"> EIP1559 </template>
                      </td>
                      <td>
                        <template v-if="tx.type === 2">
                          {{
                            ethers.utils.formatUnits(tx.maxFeePerGas, "gwei")
                          }}
                        </template>
                        <template v-else>
                          {{ ethers.utils.formatUnits(tx.gasPrice, "gwei") }}
                        </template>
                      </td>
                      <td>
                        <template v-if="tx.type === 2">
                          {{
                            ethers.utils.formatUnits(
                              tx.maxPriorityFeePerGas,
                              "gwei"
                            )
                          }}
                        </template>
                        <template v-else>
                          {{
                            ethers.utils.formatUnits(
                              tx.gasPrice.sub(nextBlock.baseFeePerGas),
                              "gwei"
                            )
                          }}
                        </template>
                      </td>
                      <td>
                        <a
                          href="#"
                          class="text-indigo-600 hover:text-indigo-900"
                          >View<span class="sr-only">, {{ tx.hash }}</span></a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LAutoWidth>
  </div>
</template>

<style scoped lang="scss">
.ac-table-s {
  thead tr th {
    @apply whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900;

    &:first-child {
      @apply pl-4 pr-3 sm:pl-6;
    }

    &:last-child {
      @apply relative pl-3 pr-4 sm:pr-6;
    }
  }

  tbody tr {
    td {
      @apply whitespace-nowrap px-2 py-2 text-sm text-gray-900;

      &:first-child {
        @apply pl-4 pr-3 text-sm text-gray-500 sm:pl-6;
      }

      &:last-child {
        @apply relative pl-3 pr-4 text-right text-sm font-medium sm:pr-6;
      }
    }

    &:nth-child(even) {
      @apply bg-gray-50;
    }
  }
}
</style>
