<script setup lang="ts">
import { ethers, BigNumber } from "ethers";
import { ArrowsExpandIcon, BanIcon } from "@heroicons/vue/outline";

const show = ref(false);
const props = defineProps(["nextBlock", "pendingTransactions", "frontIndex"]);

function toggle() {
  show.value = !show.value;
}
</script>

<template>
  <LAutoWidth class="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
    <div class="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">
          Frontrun {{ pendingTransactions.length - frontIndex }} transactions of
          {{ pendingTransactions.length }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          pending Transactions the next block
          <span>
            #<FormattedBN :bn-value="ethers.BigNumber.from(nextBlock.number)" />
          </span>
        </p>
      </div>

      <div>
        <button class="jt-btn gray gap-2" @click="toggle">
          <ArrowsExpandIcon
            v-if="!show"
            class="block h-5 w-5"
            aria-hidden="true"
          />
          <BanIcon v-else class="block h-5 w-5" aria-hidden="true" />
          <span> Details </span>
        </button>
      </div>
    </div>

    <div v-if="show" class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="
              overflow-hidden
              shadow
              ring-1 ring-black ring-opacity-5
              md:rounded-lg
            "
          >
            <table
              class="min-w-full divide-y divide-gray-300 tx-table font-mono"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Hash</th>
                  <th scope="col">Type</th>
                  <th scope="col">Max Fee (GWei)</th>
                  <th scope="col">Max Priority Fee (GWei)</th>
                  <th scope="col">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr
                  v-for="(tx, index) in pendingTransactions"
                  :key="index"
                  :class="{ bottom: index > frontIndex }"
                >
                  <td>{{ index }}</td>
                  <td>{{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-4) }}</td>
                  <td>
                    <template v-if="tx.type === 2"> EIP1559 </template>
                  </td>
                  <td>
                    <template v-if="tx.type === 2">
                      <FormattedBN :bn-value="tx.maxFeePerGas" :decimals="9" />
                    </template>
                    <template v-else>
                      <FormattedBN :bn-value="tx.gasPrice" :decimals="9" />
                    </template>
                  </td>
                  <td>
                    <template v-if="tx.type === 2">
                      <FormattedBN
                        :bn-value="tx.maxPriorityFeePerGas"
                        :decimals="9"
                      />
                    </template>
                    <template v-else>
                      <FormattedBN
                        :bn-value="tx.gasPrice.sub(nextBlock.baseFeePerGas)"
                        :decimals="9"
                      />
                    </template>
                  </td>
                  <td>
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">
                      View
                      <span class="sr-only">, {{ tx.hash }}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </LAutoWidth>
</template>

<style scoped lang="scss">
.tx-table {
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
        @apply pl-4 pr-3 text-sm sm:pl-6;
      }

      &:last-child {
        @apply relative pl-3 pr-4 text-right text-sm font-medium sm:pr-6;
      }
    }

    &.bottom {
      @apply bg-rose-200;
    }

    &:nth-child(even) {
      @apply bg-gray-50;

      &.bottom {
        @apply bg-rose-50;
      }
    }
  }
}
</style>
