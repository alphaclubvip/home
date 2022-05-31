<script setup lang="ts">
import { ethers } from 'ethers';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";
import ERC20_ABI from '@/contracts/ERC20.json';
import ALPHA_CLUB_001_ABI from '@/contracts/AlphaClub001.json';
import utilWeb3 from '@/utils/web3';

const config = useRuntimeConfig();
const account = useWeb3Account();
const balance = useWeb3Balance();
const nativeSymbol = useNativeSymbol();
const nativeDecimals = useNativeDecimals();

const contractBulk = ref<ethers.Contract>();
const contractERC20 = ref<ethers.Contract>();

watch(account, async () => {
  await touchContractBulk();
});



const xx = async () => {
  console.log("xx");

  const overrides = {
    // from: account.value,
    value: txValue.value
  }

  if (isERC20.value) {

  } else {
    if (isSameAmount.value) {
      const tx = await contractBulk.value.bulkTransferSame(txRecipients.value, bnAmount.value, overrides);
      console.log(tx);
    } else {
      const tx = await contractBulk.value.bulkTransfer(txRecipients.value, txAmounts.value, overrides);
      console.log(tx);
    }
  }

  // ["0x0000002d55c53Ed508AB99f88e0473c0D4e002f7", "0x000000d2537D519b693f8ca4c8a3fB8A36EE8990"], 1
}














// select: type
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

// input: amount
const amountSame = ref<string>("");
const symbol = computed(() => {
  if (isERC20.value) {
    return ERC20Symbol.value;
  }

  return nativeSymbol.value;
});

// input: donate
const amountDonate = ref<string>("0.005");

// textarea: list
const list = ref<string>("");
const listError = ref<string>("");
const listLable = computed(() => {
  if (isERC20.value) {
    if (ERC20Symbol.value) {
      return isSameAmount.value ? `${ERC20Symbol.value} Recipients` : `Recipients and ${ERC20Symbol.value} amounts`;
    }

    return 'Recipients...';
  } else {
    return isSameAmount.value ? `${nativeSymbol.value} Recipients` : `Recipients and ${nativeSymbol.value} values`;
  }
});
const placeholderListDiff = [
  '0x0000000000000000000000000000000000000001, 0.1',
  '0x0000000000000000000000000000000000000002, 0.2',
  '0x0000000000000000000000000000000000000003, 0.3',
  '',
  '-- An address, a comma, then the amount; for each line.',
];
const placeholderListSame = [
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
  '',
  '-- An address for each line.',
];
const placeholderList = computed(() => {
  return isSameAmount.value ? placeholderListSame.join('\n') : placeholderListDiff.join('\n');
});
const lines = computed(() => {
  let rlt = [];
  list.value.split('\n').forEach((_line: string, _index: number) => {
    const s = _line.trim();
    if (s) {
      rlt.push(s);
    }
  });
  return rlt;
});


// _token
// 0xce0E62C41EB744859Ce9869809A1f2ddea315d68 APE
// 0xce0e62c41eb744859ce9869809a1f2ddea315d68
const inputToken = ref<string>("");
const inputTokenError = ref<string>("");
const ERC20Address = ref<string>("");
const ERC20Name = ref<string>("");
const ERC20Symbol = ref<string>("");
const ERC20Decimals = ref<number>(0);

watch(inputToken, async () => {
  clearERC20();

  const s = inputToken.value.trim();
  if (s) {
    try {
      ERC20Address.value = ethers.utils.getAddress(s);
    } catch (e) {
      inputTokenError.value = `Invalid address: "${s}"`;
      return;
    }

    if (ERC20Address.value) {
      await touchERC20();
    }
  }
});

async function touchERC20() {
  try {
    const data = await contractBulk.value.readERC20Metadata(ERC20Address.value);
    ERC20Name.value = data.name;
    ERC20Symbol.value = data.symbol;
    ERC20Decimals.value = data.decimals;
  } catch (e) {
    clearERC20();
    inputTokenError.value = `Not a ERC20 Token Address`;
    return;
  }
}

function clearERC20() {
  inputTokenError.value = "";
  ERC20Address.value = "";
  ERC20Name.value = "";
  ERC20Symbol.value = "";
  ERC20Decimals.value = 0;
}


// _recipients
const txRecipients = ref<string[]>([]);

// _amounts
const bnAmounts = ref<ethers.BigNumber[]>([]);
const txAmounts = computed(() => {
  let rlt = [];
  bnAmounts.value.forEach((_value: ethers.BigNumber, _index: number) => {
    rlt.push(_value.toString());
  })

  return rlt;
});

// _amount
const bnAmount = computed(() => {
  if (amountSame.value) {
    return ethers.utils.parseUnits(amountSame.value, ERC20Decimals.value);
  }

  return ethers.BigNumber.from(0);
});
const txAmount = computed(() => {
  return bnAmount.value.toString();
});
const bnAmountAccu = computed(() => {
  if (bnAmounts.value.length) {
    let rlt = ethers.BigNumber.from(0);

    bnAmounts.value.forEach((_value, _index) => {
      rlt = rlt.add(_value);
    });

    return rlt;
  }

  return ethers.BigNumber.from(0);
});

// donate
const bnDonate = computed(() => {
  if (amountDonate.value) {
    return ethers.utils.parseUnits(amountDonate.value, nativeDecimals.value);
  }

  return ethers.BigNumber.from(0);
});

// tx: value
const bnValue = computed(() => {
  if (isERC20.value) {
    return bnDonate.value;
  } else {
    return bnAmountAccu.value.add(bnDonate.value);
  }
});
const txValue = computed(() => {
  return bnValue.value.toString();
});

// preview
const showPreview = ref(false);
const previewRows = computed(() => {
  let rlt = [];
  for (let i: number = 0; i < Math.min(txRecipients.value.length, bnAmounts.value.length); i++) {
    rlt.push({
      address: txRecipients.value[i],
      amount: bnAmounts.value[i],
    });
  }
  return rlt;
});
function togglePreview() {
  showPreview.value = !showPreview.value;
}





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


// list => address(es)
function touchAddresses() {
  let arrAddress = [];
  txRecipients.value = arrAddress;

  if (isSameAmount.value) {
    lines.value.forEach((_line: string, _i: number) => {
      try {
        const address = ethers.utils.getAddress(_line.trim());
        if (address) {
          arrAddress.push(address);
        }
      } catch (e) {
        listError.value = `Line #${_i + 1} - Invalid address: "${_line}"`;
        return;
      }
    });
  } else {
    lines.value.forEach((_line: string, _i: number) => {
      const arrLine = _line.split(',');
      const p0 = arrLine[0].trim();

      try {
        const address = ethers.utils.getAddress(p0);
        if (address) {
          arrAddress.push(address);
        }
      } catch (e) {
        listError.value = `Line #${_i + 1} - Invalid address: "${p0}"`;
        return;
      }
    });
  }

  txRecipients.value = arrAddress;
}


// list => amounts
function touchAmounts() {
  let arrAmount = [];
  bnAmounts.value = arrAmount;

  lines.value.forEach((_line: string, _i: number) => {
    const lineNumber = _i + 1;

    const arrLine = _line.split(',');
    if (arrLine.length > 1) {
      const p1 = arrLine[1].trim();
      try {
        const amount = ethers.BigNumber.from(ethers.utils.parseUnits(p1, ERC20Decimals.value));
        if (amount.gt(0)) {
          arrAmount.push(amount);
        } else {
          listError.value = `Line #${lineNumber} - Invalid amount: "${p1}"`;
          return;
        }
      } catch (e) {
        listError.value = `Line #${lineNumber} - Invalid amount: "${p1}"`;
        return;
      }
    } else {
      listError.value = `Line #${lineNumber} - Empty amount`;
      return;
    }
  });

  bnAmounts.value = arrAmount;
}

function touchSameAmounts() {
  let arrAmount = [];

  bnAmounts.value = arrAmount;

  if (amountSame.value) {
    const _amount = ethers.utils.parseUnits(amountSame.value, ERC20Decimals.value);
    txRecipients.value.forEach((_address: string, _i: number) => {
      arrAmount.push(_amount);
    });

    bnAmounts.value = arrAmount;
  }
}

watch(amountDonate, () => {
  amountDonate.value = formatAmount(amountDonate.value, nativeDecimals.value);
});

watch(amountSame, () => {
  bnAmounts.value = [];
  amountSame.value = formatAmount(amountSame.value, ERC20Decimals.value);
  touchSameAmounts();
});

watch(type, () => {
  if (isSameAmount.value) {
    if (txRecipients.value) {
      list.value = txRecipients.value.join('\n');
      return;
    }
  } else {
    if (txRecipients.value && bnAmounts.value) {
      let arr = [];
      for (let i: number = 0; i < txRecipients.value.length; i++) {
        if (bnAmounts.value.length > i) {
          arr.push(`${txRecipients.value[i]}, ${ethers.utils.formatUnits(bnAmounts.value[i], ERC20Decimals.value)}`);
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
  bnAmounts.value = arrAmount;

  touchAddresses();

  if (isSameAmount.value) {
    touchSameAmounts();
  } else {
    touchAmounts();
  }
});

async function touchContractBulk() {
  if (account.value) {
    const _signer = await utilWeb3.getSigner();
    contractBulk.value = new ethers.Contract(config.ALPHA_CLUB_001, ALPHA_CLUB_001_ABI, _signer);
  }
}

onMounted(async function () {
  console.log("/contracts/bulk");
  await touchContractBulk();
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
                  {{ symbol }}
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
                v-model="inputToken" />
            </div>
            <p v-if="inputTokenError" class="mt-2 text-sm font-semibold text-rose-500">
              inputTokenError
            </p>
            <p v-if="ERC20Name" class="mt-2 text-sm text-gray-500">
              {{ ERC20Name }} {{ ERC20Symbol }} {{ ERC20Decimals }}
            </p>
          </div>

          <div class="md:col-span-6">
            <label for="about" class="block font-medium text-gray-700">
              {{ listLable }}
            </label>
            <div class="mt-1">
              <textarea id="about" name="about" rows="10"
                class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md shadow-sm font-mono text-sm placeholder:text-gray-400"
                v-model="list" :placeholder="placeholderList" />
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
          txAmount: {{ bnAmount }}
        </div>
        <div>
          txValue: {{ bnValue }}
        </div>
        <div>
          txDonate: {{ bnDonate }}
        </div>
        <div>
          ALPHA_CLUB_001: {{ config.ALPHA_CLUB_001 }}
        </div>
        <div>ERC20Address: {{ ERC20Address }}</div>
        <div>ERC20Name: {{ ERC20Name }}</div>
        <div>ERC20Symbol: {{ ERC20Symbol }}</div>
        <div>ERC20Decimals: {{ ERC20Decimals }}</div>

        <div v-if="0 < previewRows.length" class="mt-8 flex flex-col">
          <div class="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-between">
            <div class="sm:flex-auto">
              <h1 class="text-xl font-semibold text-gray-900">
                Total
                <FormattedBN :bn-value="bnAmountAccu" :decimals="ERC20Decimals" />
                {{ symbol }}
              </h1>
              <p class="mt-2 text-sm text-gray-700">
                {{ previewRows.length }} transfers.
              </p>
            </div>

            <div>
              <button class="jt-btn gray gap-2" @click="togglePreview">
                <span> Details </span>
                <ChevronDownIcon v-if="!showPreview" class="block h-5 w-5" />
                <ChevronUpIcon v-else class="block h-5 w-5" />
              </button>
            </div>
          </div>

          <div v-if="showPreview" class="mt-8 flex flex-col">
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
                      <tr v-for="(row, index) in previewRows" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ row.address }}</td>
                        <td>
                          <FormattedBN :bn-value="row.amount" :decimals="ERC20Decimals" />
                          {{ symbol }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="button" class="jt-btn gray" @click="xx">xx</button>
        </div>
      </LAutoWidth>
    </Connected>
  </div>
</template>
