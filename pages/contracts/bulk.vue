<script setup lang="ts">
import { ethers } from "ethers";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";
import ALPHA_CLUB_001_ABI from '@/contracts/AlphaClub001.json';


const provider = useWeb3Provider();
const signer = ref<ethers.Signer>();
const config = useRuntimeConfig();
const account = useWeb3Account();
const balance = useWeb3Balance();
const nativeSymbol = useNativeSymbol();
const nativeDecimals = useNativeDecimals();

const contract = ref<ethers.Contract>();



watch(account, async () => {
  if (account.value) {

    signer.value = provider.value.getSigner();
    console.log("signer:", signer.value);

    contract.value = new ethers.Contract(config.ALPHA_CLUB_001, ALPHA_CLUB_001_ABI, signer.value);
    console.log(contract.value);
  }
});


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
  '-- An address, a comma, and the amount for it; in each line.',
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
const amountSame = ref<string>("");
const amountDonate = ref<string>("0.005");
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

// tx: _recipients, _amount(s), value, donate
const txRecipients = ref<string[]>([]);
const txAmount = computed(() => {
  if (amountSame.value) {
    return ethers.utils.parseUnits(amountSame.value, transferDecimals.value)
  }

  return ethers.BigNumber.from(0);
});
const txAmounts = ref<ethers.BigNumber[]>([]);
const txValue = computed(() => {
  if (isERC20.value) {
    return txDonate.value;
  } else {
    return amountAccu.value.add(txDonate.value);
  }
});
const txDonate = computed(() => {
  if (amountDonate.value) {
    return ethers.utils.parseUnits(amountDonate.value, nativeDecimals.value)
  }

  return ethers.BigNumber.from(0);
});

//
const amountAccu = computed(() => {
  if (txAmounts.value.length) {
    let rlt = ethers.BigNumber.from(0);

    txAmounts.value.forEach((_value, _index) => {
      rlt = rlt.add(_value);
    });

    return rlt;
  }

  return ethers.BigNumber.from(0);
});
const rows = computed(() => {
  let rlt = [];
  for (let i: number = 0; i < Math.min(txRecipients.value.length, txAmounts.value.length); i++) {
    rlt.push({
      address: txRecipients.value[i],
      amount: txAmounts.value[i],
    });
  }
  return rlt;
});

const listError = ref<string>("");

const transferDecimals = computed(() => {
  return 18;
});


const formatAmount = function (s: String, decimals: number) {
  return s
    .replace("。", ".")
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "#")
    .replace(/\./g, "")
    .replace("#", ".")
    .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimals}}).*$`), "$1.$2");
};


function touchAddresses() {
  let arrAddress = [];

  txRecipients.value = arrAddress;

  lines.value.forEach((_line: string, _i: number) => {
    const arrLine = _line.split(',');
    const p0 = arrLine[0].trim();

    try {
      const address = ethers.utils.getAddress(p0);
      if (address) {
        arrAddress.push(address);
      }
    } catch (e) {
      listError.value = `Line #${_i} - Invalid address: "${p0}"`;
      return;
    }
  });

  txRecipients.value = arrAddress;
}

function touchAmounts() {
  let arrAmount = [];

  txAmounts.value = arrAmount;

  lines.value.forEach((_line: string, _i: number) => {
    const arrLine = _line.split(',');

    if (arrLine.length > 1) {
      const p1 = arrLine[1].trim();
      try {
        const amount = ethers.BigNumber.from(ethers.utils.parseUnits(p1, transferDecimals.value));
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

  txAmounts.value = arrAmount;
}

function touchSameAmounts() {
  let arrAmount = [];

  txAmounts.value = arrAmount;

  if (amountSame.value) {
    const _amount = ethers.utils.parseUnits(amountSame.value, transferDecimals.value);
    txRecipients.value.forEach((_address: string, _i: number) => {
      arrAmount.push(_amount);
    });

    txAmounts.value = arrAmount;
  }
}

watch(amountDonate, () => {
  amountDonate.value = formatAmount(amountDonate.value, nativeDecimals.value);
});

watch(amountSame, () => {
  txAmounts.value = [];
  amountSame.value = formatAmount(amountSame.value, transferDecimals.value);
  touchSameAmounts();
});

watch(type, () => {
  if (isSameAmount.value) {
    if (txRecipients.value) {
      list.value = txRecipients.value.join('\n');
      return;
    }
  } else {
    if (txRecipients.value && txAmounts.value) {
      let arr = [];
      for (let i: number = 0; i < txRecipients.value.length; i++) {
        if (txAmounts.value.length > i) {
          arr.push(`${txRecipients.value[i]}, ${ethers.utils.formatUnits(txAmounts.value[i], transferDecimals.value)}`);
        } else {
          arr.push(`${txRecipients.value[i]}, `);
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

  txRecipients.value = arrAddress;
  txAmounts.value = arrAmount;

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
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
          <div class="md:col-span-3">
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

          <div v-if="isSameAmount" class="md:col-span-3 lg:col-span-2">
            <label for="amount" class="block font-medium text-gray-700">
              Amount
            </label>
            <div class="mt-1 relative">
              <input type="text" name="amount" id="amount"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
                v-model="amountSame" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-400 sm:text-sm">
                  {{ unit }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="isERC20" class="md:col-span-6">
            <label for="token-address" class="block font-medium text-gray-700">
              Token Contract Address
            </label>
            <div class="mt-1">
              <input type="text" name="token-address" id="token-address"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full font-mono sm:text-sm border-gray-300 rounded-md"
                v-model="tokenAddress" />
            </div>
          </div>

          <div class="md:col-span-6">
            <label for="about" class="block font-medium text-gray-700">
              {{ listLable }}
            </label>
            <div class="mt-1">
              <textarea id="about" name="about" rows="10"
                class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md shadow-sm font-mono text-sm placeholder:text-gray-400"
                v-model="list" :placeholder="placeHolderBulkTransfer" />
            </div>
            <p v-if="listError" class="mt-2 text-sm font-semibold text-rose-500">
              {{ listError }}
            </p>
          </div>


          <div class="md:col-span-3 lg:col-span-2">
            <label for="donate" class="block font-medium text-gray-700">
              Dontate
            </label>
            <div class="mt-1 relative">
              <input type="text" name="donate" id="donate"
                class="shadow-sm focus:ring-green-500 focus:border-indigo-500 block w-full bg-green-50 pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
                v-model="amountDonate" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-400 sm:text-sm">
                  {{ nativeSymbol }}
                </span>
              </div>
            </div>
            <p class="mt-2 text-sm font-semibold text-green-600">
              Donate to help us build more useful tools.
            </p>
          </div>
        </div>

        <div class="mt-6">
          txAmount: {{ txAmount }}
        </div>
        <div>
          txValue: {{ txValue }}
        </div>
        <div>
          txDonate: {{ txDonate }}
        </div>
        <div>
          ALPHA_CLUB_001: {{ config.ALPHA_CLUB_001 }}
        </div>

        <div v-if="0 < rows.length" class="mt-8 flex flex-col">
          <div class="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-between">
            <div class="sm:flex-auto">
              <h1 class="text-xl font-semibold text-gray-900">
                Total
                <FormattedBN :bn-value="amountAccu" :decimals="transferDecimals" />
                {{ unit }}
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
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                          <FormattedBN :bn-value="row.amount" :decimals="transferDecimals" />
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
