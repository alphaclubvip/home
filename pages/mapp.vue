<script setup lang="ts">
import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@/utils/ethers';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";
import utilWeb3 from '@/utils/web3';
import ERC20_ABI from '@/contracts/ERC20.json';
import MAPPING_GALLERY_ABI from '@/contracts/MappingGallery.json';

const config = useRuntimeConfig();
const account = useWeb3Account();
// const balance = useWeb3Balance();
const nativeSymbol = useNativeSymbol();
const nativeDecimals = useNativeDecimals();
const nativeCurrency = useNativeCurrency();
const contract = ref<ethers.Contract>();

// section: tx
const tx = ref<TransactionResponse>();
watch(tx, async () => {
  if (tx.value && 0 === tx.value.confirmations) {
    await tx.value.wait()
      .then((_receipt: TransactionReceipt) => {
        txReceipt.value = _receipt;
      })
      .catch((_e: Error) => {
        if (_e.hasOwnProperty('reason')) {
          txReplaced.value = _e['reason'];

          if (_e.hasOwnProperty('replacement')) {
            tx.value = _e['replacement'];
          }

          if (_e.hasOwnProperty('receipt')) {
            txReceipt.value = _e['receipt'];
          }
        }
      });
  }
});
const txReceipt = ref<TransactionReceipt>();
const txReplaced = ref<string>("");
const txName = ref<string>("");
const deleteTx = () => {
  tx.value = undefined;
  txReceipt.value = undefined;
  txReplaced.value = "";
  txName.value = "";
}

const name = ref<string>();
const symbol = ref<string>();
const totalSupply = ref<ethers.BigNumber>();


const merkleProof = ref();


// select: type
const amountOptions = [
  { value: 0, title: "-" },
  { value: 1, title: "1" },
  { value: 2, title: "2" },
  { value: 3, title: "3" },
];
const amount = ref<number>(amountOptions[0].value);


// mounted
onMounted(async function () {
  console.log("/contracts/bulk");
  await touchContract();
});

// watch: account
watch(account, async () => {
  await touchContract();
});

// init contract
async function touchContract() {
  if (account.value) {
    contract.value = await utilWeb3.makeContract(config.MAPPING_GALLERY, MAPPING_GALLERY_ABI);

    const resp = await contract.value.read();

    name.value = resp.name;
    symbol.value = resp.symbol;
    totalSupply.value = resp.totalSupply;

    const proof = await useFetch(`/proofs/${account.value}.json`);

    merkleProof.value = proof.data.value;
    console.log('proof:', proof.data.value);
  }
}

async function mint() {
  console.log("mint");

  deleteTx();
  txName.value = "Mint";
  tx.value = await contract.value.whitelistMint(amount.value, merkleProof.value)
    .catch((e: Error) => {
      deleteTx();
    });
}

async function setMerkleRoot() {
  console.log("setMerkleRoot");

  txName.value = "Set MerkleRoot";
  tx.value = await contract.value.setMerkleRoot("0xaaada86de0e110f20092d9fb0eba05a091ed2f286532b121661b1b8ae2c7c7ba")
    .catch((e: Error) => {
      deleteTx();
    });
}
</script>


<template>
  <div>
    <Connected>
      <LAutoWidth class="py-16">
        <div>
          Mapping Gallery
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
          <div class="md:col-span-3">
            <label for="type" class="block font-medium text-gray-700">
              Type
            </label>
            <div class="mt-1">
              <select id="type" name="type" v-model="amount"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono">
                <option v-for="option in amountOptions" :value="option.value" :key="option.value">
                  {{ option.title }}
                </option>
              </select>
            </div>
          </div>

          <STx class="md:col-span-6 mt-4 lg:mt-6" :tx="tx" :tx-receipt="txReceipt" :tx-name="txName"
            :tx-replaced="txReplaced" />
        </div>
        <div>
          account: {{ account }}
        </div>
        <div>
          merkleProof: {{ merkleProof }}
        </div>
        <div class="md:col-span-6 flex gap-4">
          <button type="button" class="flex-1 w-full jt-btn pink" @click="mint">
            Mint
          </button>
          <button type="button" class="flex-1 w-full jt-btn pink" @click="setMerkleRoot">
            Set MerkleRoot
          </button>
        </div>

        <div>
          {{ config.MAPPING_GALLERY }}
        </div>
        <div>
          name: {{ name }}
        </div>
        <div>
          symbol: {{ symbol }}
        </div>
        <div>
          totalSupply: {{ totalSupply }}
        </div>
      </LAutoWidth>
    </Connected>
  </div>
</template>
