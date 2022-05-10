<script setup lang="ts">
const { $ethers } = useNuxtApp();

const ethers = $ethers;
const transactions = ref([]);
const blockNumber = ref();

onMounted(async () => {
  console.log("/gas");

  while (true) {
    if (useState("account").value) {
      const { $web3 } = useNuxtApp();
      const block = await $web3.getBlockWithTransactions("pending");

      blockNumber.value = block.number;
      transactions.value = block.transactions;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
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
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Repellendus repellat laudantium.
          </p>
        </div>
        <dl
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
              Pepperoni
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">100%</dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt
              class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200"
            >
              Delivery
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">24/7</dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt
              class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200"
            >
              Calories
            </dt>
            <dd class="order-1 text-5xl font-extrabold text-white">100k+</dd>
          </div>
        </dl>
      </div>
    </div>

    <LAutoWidth class="py-8" v-if="transactions.length">
      <div class="mt-6 px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">
              {{ transactions.length ? transactions.length : "___" }}
              Transactions
            </h1>
            <p class="mt-2 text-sm text-gray-700">
              Pending transactions in next block #{{
                blockNumber ? blockNumber : "___"
              }}
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
                      <td>{{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-4) }}</td>
                      <td>{{ tx.type }}</td>
                      <td>{{ ethers.utils.formatUnits(tx.gasPrice, "gwei") }}</td>
                      <td>
                        <span v-if="tx.type === 2">
                          {{
                            ethers.utils.formatUnits(tx.maxFeePerGas, "gwei")
                          }}
                        </span>
                      </td>
                      <td>
                        <span v-if="tx.type === 2">
                          {{
                            ethers.utils.formatUnits(
                              tx.maxPriorityFeePerGas,
                              "gwei"
                            )
                          }}
                        </span>
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
