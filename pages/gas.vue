<script setup lang="ts">
import { ethers } from "ethers";

const transactions = ref([]);

onMounted(async () => {
  console.log("/gas");

  while (true) {
    if (useState("account").value) {
      const { $web3 } = useNuxtApp();
      const block = await $web3.getBlockWithTransactions("pending");
      transactions.value = block.transactions;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
});
</script>


<template>
  <LAutoWidth class="py-8">
    <div class="font-mono"></div>

    <div class="mt-6 px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">
            {{ transactions.length }} Transactions
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Pending transactions in next block...
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
                class="min-w-full divide-y divide-gray-300 ac-table-s font-mono"
              >
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col">Hash</th>
                    <th scope="col">Type</th>
                    <th scope="col">Gas Price</th>
                    <th scope="col">Max Fee</th>
                    <th scope="col">Max Priority Fee</th>
                    <th scope="col">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="tx in transactions" :key="tx.hash">
                    <td
                      class="
                        whitespace-nowrap
                        py-2
                        pl-4
                        pr-3
                        text-sm text-gray-500
                        sm:pl-6
                      "
                    >
                      {{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-4) }}
                    </td>
                    <td
                      class="
                        whitespace-nowrap
                        px-2
                        py-2
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ tx.type }}
                    </td>
                    <td class="text-gray-900">
                      {{ ethers.utils.formatUnits(tx.gasPrice, "gwei") }}
                    </td>
                    <td>
                      <span v-if="tx.type === 2">{{
                        ethers.utils.formatUnits(tx.maxFeePerGas, "gwei")
                      }}</span>
                    </td>
                    <td>
                      <span v-if="tx.type === 2">{{
                        ethers.utils.formatUnits(
                          tx.maxPriorityFeePerGas,
                          "gwei"
                        )
                      }}</span>
                    </td>
                    <td>
                      <a href="#" class="text-indigo-600 hover:text-indigo-900"
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

  tbody tr td {
    @apply whitespace-nowrap px-2 py-2 text-sm text-gray-900;

    &:first-child {
      @apply pl-4 pr-3 text-sm text-gray-500 sm:pl-6;
    }

    &:last-child {
      @apply relative pl-3 pr-4 text-right text-sm font-medium sm:pr-6;
    }
  }
}
</style>
