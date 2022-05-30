<script setup lang="ts">
import { ethers } from "ethers";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";

const account = useWeb3Account();
const balance = useWeb3Balance();

const showTable = ref(false);
function toggleTable() {
  showTable.value = !showTable.value;
}

const type = ref<string>("A");
const typeDesc = computed(() => {
  switch (type.value) {
    case "A":
      return "Transfer different amounts of ETH to multiple addresses.";
      break;
    case "B":
      return "Transfer a same amount of ETH to multiple addresses, less than type A.";
      break;
    case "C":
      return "Transfer different amounts of ERC20 token to multiple addresses.";
      break;
    case "D":
      return "Transfer a same amount of ERC20 token to multiple addresses, less than type C.";
      break;
    default:
      return "";
      break;
  }
});
const isSameAmount = computed(() => {
  return type.value === "B" || type.value === "D";
});
const isERC20 = computed(() => {
  return type.value === "C" || type.value === "D";
});
const unit = computed(() => {
  return isERC20.value ? "XXX" : "ETH";
});
const placeHolderBulkTransferDiff = [
  '0x0000000000000000000000000000000000000001, 0.1',
  '0x0000000000000000000000000000000000000002, 0.2',
  '0x0000000000000000000000000000000000000003, 0.3',
  '',
  '-- An address, a comma, a space, and the amount for it; in each line.',
];
const placeHolderBulkTransferSame = [
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
  '',
  '-- One Address, One Line.',
];
const placeHolderBulkTransfer = computed(() => {
  return isSameAmount.value ? placeHolderBulkTransferSame.join('\n') : placeHolderBulkTransferDiff.join('\n');
});


const listLable = computed(() => {
  return isSameAmount.value ? 'Recipients' : 'Recipients and values';
});

const tokenAddress = ref<string>("");
const amount = ref<string>("");
const list = ref<string>("");
const lines = computed(() => {
  let rlt = [];
  list.value.split('\n').forEach((line, index) => {
    const s = line.trim();
    if (s) {
      rlt.push(s);
    }
  });
  return rlt;
});

const addresses = ref<string[]>([]);
const amounts = ref<ethers.BigNumber[]>([]);
const rows = computed(() => {
  let rlt = [];
  for (let i: number = 0; i < Math.min(addresses.value.length, amounts.value.length); i++) {
    rlt.push({
      address: addresses.value[i],
      amount: amounts.value[i],
    });
  }
  return rlt;
});

const amountError = ref<string>("");
const listError = ref<string>("");

const decimals = computed(() => {
  return 18;
});


function touchAddresses() {
  let arrAddress = [];

  addresses.value = arrAddress;

  lines.value.forEach((_line: string, _i: number) => {
    const arrLine = _line.split(',');
    const p0 = arrLine[0].trim();

    try {
      const address = ethers.utils.getAddress(p0);
      if (address) {
        arrAddress.push(address);
      }
    } catch (e) {
      listError.value = `Invalid address: "${p0}"`;
      return;
    }
  });

  addresses.value = arrAddress;
}

function touchAmounts() {
  let arrAmount = [];

  amounts.value = arrAmount;

  lines.value.forEach((_line: string, _i: number) => {
    const arrLine = _line.split(',');

    if (arrLine.length > 1) {
      const p1 = arrLine[1].trim();
      try {
        const amount = ethers.BigNumber.from(ethers.utils.parseUnits(p1, decimals.value));
        arrAmount.push(amount);
      } catch (e) {
        listError.value = `Line #${_i + 1} - Invalid amount: "${p1}"`;
        return;
      }
    } else {
      listError.value = `Line #${_i + 1} - Empty amount`;
      return;
    }
  });

  amounts.value = arrAmount;
}

function touchSameAmounts() {
  let arrAmount = [];

  amounts.value = arrAmount;
  const s = amount.value.trim();

  try {
    const _amount = ethers.utils.parseUnits(s, decimals.value);
    addresses.value.forEach((_address: string, _i: number) => {
      arrAmount.push(_amount);
    });

    amounts.value = arrAmount;
  } catch (e) {
    amountError.value = `Invalid address: "${s}"`;
    return;
  }
}


watch(amount, () => {
  amountError.value = '';
  amounts.value = [];

  const s: string = amount.value ? amount.value.trim() : '';

  if (!s) {
    amountError.value = ``;
    return;
  }

  touchSameAmounts();
});

watch(type, () => {
  if (isSameAmount.value) {
    if (addresses.value) {
      list.value = addresses.value.join('\n');
      return;
    }
  } else {
    if (addresses.value && amounts.value) {
      let arr = [];
      for (let i: number = 0; i < addresses.value.length; i++) {
        if (amounts.value.length > i) {
          arr.push(`${addresses.value[i]}, ${ethers.utils.formatUnits(amounts.value[i], decimals.value)}`);
        } else {
          arr.push(`${addresses.value[i]}, `);
        }
      }
      list.value = arr.join('\n');
      return;
    }
  }
});

watch(list, () => {
  listError.value = '';

  let arrAddress = [];
  let arrAmount = [];

  addresses.value = arrAddress;
  amounts.value = arrAmount;

  touchAddresses();

  if (isSameAmount.value) {
    touchSameAmounts();
  } else {
    touchAmounts();
  }
});

onMounted(async function () {
  console.log("/contracts/bulk");
});
</script>

<template>
  <div>
    <SBulkHero />
    <Connected>
      <LAutoWidth class="py-16">
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="type" class="block font-medium text-gray-700">
              Type
            </label>
            <div class="mt-1">
              <select id="type" name="type" v-model="type"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono">
                <option value="A">
                  Type A - Bulk Transfer ETH
                </option>
                <option value="B">
                  Type B - Bulk Transfer ETH (Same Value)
                </option>
                <option value="C">
                  Type C - Bulk Transfer ERC20
                </option>
                <option value="D">
                  Type D - Bulk Transfer ERC20 (Same Value)
                </option>
              </select>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              {{ typeDesc }}
            </p>
          </div>

          <div v-if="isSameAmount" class="sm:col-span-3">
            <label for="amount" class="block font-medium text-gray-700">
              Amount
            </label>
            <div class="mt-1">
              <input type="text" name="amount" id="amount"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full font-mono sm:text-sm border-gray-300 rounded-md"
                v-model="amount" />
            </div>
            <p v-if="amountError" class="mt-2 text-sm font-semibold text-rose-500">
              {{ amountError }}
            </p>
          </div>

          <div v-if="isERC20" class="sm:col-span-6">
            <label for="token-address" class="block font-medium text-gray-700">
              Token Contract Address
            </label>
            <div class="mt-1">
              <input type="text" name="token-address" id="token-address"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full font-mono sm:text-sm border-gray-300 rounded-md"
                v-model="tokenAddress" />
            </div>
          </div>

          <div class="sm:col-span-6">
            <label for="about" class="block font-medium text-gray-700">
              {{ listLable }}
            </label>
            <div class="mt-1">
              <textarea id="about" name="about" rows="10"
                class="block w-full focus:ring-indigo-500 focus:border-indigo-500  border border-gray-300 rounded-md shadow-sm font-mono text-sm placeholder:text-gray-400"
                v-model="list" :placeholder="placeHolderBulkTransfer" />
            </div>
            <p v-if="listError" class="mt-2 text-sm font-semibold text-rose-500">
              {{ listError }}
            </p>
          </div>
        </div>

        <div v-if="0 < rows.length" class="mt-8 flex flex-col">
          <div class="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-between">
            <div class="sm:flex-auto">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ rows.length }} transfers.
              </h1>
              <p class="mt-2 text-sm text-gray-700">
                {{ rows.length }} transfers.
              </p>
            </div>

            <div>
              <button class="jt-btn gray gap-2" @click="toggleTable">
                <span> Details </span>
                <ChevronDownIcon v-if="!showTable" class="block h-5 w-5" />
                <ChevronUpIcon v-else class="block h-5 w-5" />
              </button>
            </div>
          </div>

          <div v-if="showTable" class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="
              overflow-hidden
              shadow
              ring-1 ring-black ring-opacity-5
              md:rounded-lg
            ">
                  <table class="min-w-full divide-y divide-gray-300 tx-table font-mono">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col">Index</th>
                        <th scope="col">Address</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 bg-white">
                      <tr v-for="(row, index) in rows" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ row.address }}</td>
                        <td>
                          <FormattedBN :bn-value="row.amount" :decimals="decimals" />
                          {{ unit }}
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
    </Connected>
  </div>
</template>
