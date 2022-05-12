<script setup lang="ts">
import { ethers, BigNumber } from "ethers";

const props = defineProps(["nextBlock", "pendingTransactions"]);
</script>

<template>
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
                class="min-w-full divide-y divide-gray-300 ac-table-s font-mono"
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
                        {{ ethers.utils.formatUnits(tx.maxFeePerGas, "gwei") }}
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
