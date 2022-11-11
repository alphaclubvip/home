<script setup lang="ts">

import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@/utils/ethers';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";
import utilWeb3 from '@/utils/web3';
import CONTRACT_JSON from '@/contracts/MonarchMixer.json';

const config = useRuntimeConfig();
const account = useWeb3Account();
// const balance = useWeb3Balance();
const nativeSymbol = useNativeSymbol();
const nativeDecimals = useNativeDecimals();
const nativeCurrency = useNativeCurrency();
const contract = ref<ethers.Contract>();

const CONTRACT_ADDRESS = config.MONARCH_MIXER;


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

        // await touchERC20();
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


const accountIsHost = ref<boolean>(false);
const accountIsOwner = ref<boolean>(false);
const contractOwner = ref<string>("");
const contractBaseURI = ref<string>("");
const contractContractURI = ref<string>("");




async function clearContract() {
    contract.value = undefined;
    accountIsHost.value = undefined;
    accountIsOwner.value = undefined;

    contractOwner.value = undefined;
    contractBaseURI.value = undefined;
    contractContractURI.value = undefined;
}

// init contract
async function touchContract() {
    if (account.value) {
        const _signer = await utilWeb3.getSigner();
        contract.value = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_JSON.abi, _signer);

        accountIsHost.value = await contract.value.isHost(account.value);
        if (accountIsHost.value) {
            contractOwner.value = await contract.value.owner();
            accountIsOwner.value = (account.value === contractOwner.value);
        }

        contractBaseURI.value = await contract.value.baseURI();
        contractContractURI.value = await contract.value.contractURI();
    }
}

interface MintCode {
    tokenId: number,
    proofId: number,
    proof: string[]
}


// input: Mint Code
const mintCodeJSON = ref<MintCode>();
const mintCodeError = ref<string>("");
const inputMintCode = ref<string>("");

const mintButtonTXT = computed(() => {
    if (mintCodeJSON.value) {
        return `Mint Mixer#${mintCodeJSON.value.tokenId}`;
    } else {
        return "Mint";
    }
});

watch(inputMintCode, async () => {
    const s = inputMintCode.value.trim();
    if (s) {
        try {
            const strJson = new TextDecoder().decode(ethers.utils.base58.decode(s));
            mintCodeJSON.value = JSON.parse(strJson);
            mintCodeError.value = undefined;
        } catch (e) {
            mintCodeJSON.value = undefined;
            mintCodeError.value = 'MintCode: invalid';
        }

        if (mintCodeJSON.value) {
            const resp = await contract.value.check(account.value, mintCodeJSON.value.tokenId, mintCodeJSON.value.proofId, mintCodeJSON.value.proof);

            switch (resp.err) {
                case 1:
                    mintCodeError.value = `You have claimed before`;
                    break;
                case 2:
                    mintCodeError.value = 'MintCode is already used';
                    break;
                case 3:
                    mintCodeError.value = 'MintCode is not valid';
                    break;
                case 0:
                    mintCodeError.value = undefined;
                    break;
            }

            // console.log(mintCodeJSON.value.tokenId);
            // console.log(mintCodeJSON.value.proofId);
            // console.log(mintCodeJSON.value.proof);
        }
    } else {
        mintCodeJSON.value = undefined;
        mintCodeError.value = undefined;
    }
});



const mint = async () => {
    console.log("mint");
    deleteTx();
    txName.value = "Mint";
    tx.value = await contract.value.mint(mintCodeJSON.value.tokenId, mintCodeJSON.value.proofId, mintCodeJSON.value.proof)
        .catch((e: Error) => {
            deleteTx();
        });
}



// input: Base URI
const newBaseURI = ref<string>("");
const newBaseURIError = ref<string>("");
const inputNewBaseURI = ref<string>("");

watch(inputNewBaseURI, async () => {
    const s = inputNewBaseURI.value.trim();

    if (s) {
        newBaseURI.value = s;
        newBaseURIError.value = undefined;
    } else {
        newBaseURI.value = undefined;
        newBaseURIError.value = undefined;
    }
});

const setURI = async () => {
    console.log("setURI");
    deleteTx();
    txName.value = "Set BaseURI";
    tx.value = await contract.value.setURI(newBaseURI.value)
        .catch((e: Error) => {
            deleteTx();
        });
}



// input: Contract URI
const newContractURI = ref<string>("");
const newContractURIError = ref<string>("");
const inputNewContractURI = ref<string>("");

watch(inputNewContractURI, async () => {
    const s = inputNewContractURI.value.trim();

    if (s) {
        newContractURI.value = s;
        newContractURIError.value = undefined;
    } else {
        newContractURI.value = undefined;
        newContractURIError.value = undefined;
    }
});

const setContractURI = async () => {
    console.log("setContractURI");
    deleteTx();
    txName.value = "Set ContractURI";
    tx.value = await contract.value.setContractURI(newContractURI.value)
        .catch((e: Error) => {
            deleteTx();
        });
}


// input: set whitelist
const setWhitelistTokenId = ref<ethers.BigNumber>();
const setWhitelistTokenIdError = ref<string>("");
const inputSetWhitelistTokenId = ref<string>("");
const placeHolderWLMerkleRoot = ref<string>("");
const placeHolderWLTimestamp = ref<ethers.BigNumber>();

watch(inputSetWhitelistTokenId, async () => {
    const s = inputSetWhitelistTokenId.value.trim();

    if (s) {
        try {
            setWhitelistTokenId.value = ethers.BigNumber.from(s);
        } catch (e) {
            setWhitelistTokenId.value = undefined;
            setWhitelistTokenIdError.value = `Invalid integer: "${s}"`;

            placeHolderWLMerkleRoot.value = undefined;
            placeHolderWLTimestamp.value = undefined;
            return;
        }

        setWhitelistTokenIdError.value = undefined;

        if (setWhitelistTokenId.value.gt(0)) {
            const resp = await contract.value.getWhitelist(setWhitelistTokenId.value);
            if (resp) {
                placeHolderWLMerkleRoot.value = resp.merkleRoot;
                placeHolderWLTimestamp.value = resp.timestamp;
            } else {
                placeHolderWLMerkleRoot.value = undefined;
                placeHolderWLTimestamp.value = undefined;
            }
        }
    } else {
        setWhitelistTokenId.value = undefined;
        setWhitelistTokenIdError.value = undefined;

        placeHolderWLMerkleRoot.value = undefined;
        placeHolderWLTimestamp.value = undefined;
    }
});

const setWhitelistMerkleRoot = ref<string>();
const setWhitelistMerkleRootError = ref<string>("");
const inputSetWhitelistMerkleRoot = ref<string>("");

watch(inputSetWhitelistMerkleRoot, async () => {
    const s = inputSetWhitelistMerkleRoot.value.trim();

    if (s) {
        try {
            setWhitelistMerkleRoot.value = ethers.utils.hexlify(s);
        } catch (e) {
            setWhitelistMerkleRoot.value = undefined;
            setWhitelistMerkleRootError.value = `Invalid HEX: "${s}"`;
            return;
        }

        setWhitelistMerkleRootError.value = undefined;
    } else {
        setWhitelistMerkleRoot.value = undefined;
        setWhitelistMerkleRootError.value = undefined;
    }
});


const setWhitelistTimestamp = ref<ethers.BigNumber>();
const setWhitelistTimestampError = ref<string>("");
const inputSetWhitelistTimestamp = ref<string>("");

watch(inputSetWhitelistTimestamp, async () => {
    const s = inputSetWhitelistTimestamp.value.trim();

    if (s) {
        try {
            setWhitelistTimestamp.value = ethers.BigNumber.from(s);
        } catch (e) {
            setWhitelistTimestamp.value = undefined;
            setWhitelistTimestampError.value = `Invalid integer: "${s}"`;
            return;
        }

        setWhitelistTimestampError.value = undefined;
    } else {
        setWhitelistTimestamp.value = undefined;
        setWhitelistTimestampError.value = undefined;
    }
});

const setWhitelist = async () => {
    if (setWhitelistTokenId.value && setWhitelistMerkleRoot.value && setWhitelistTimestamp.value) {
        deleteTx();
        txName.value = "setWhitelist";

        tx.value = await contract.value.setWhitelist(
            setWhitelistTokenId.value,
            setWhitelistMerkleRoot.value,
            setWhitelistTimestamp.value,
        ).catch((e: Error) => {
            deleteTx();
        });
    } else if (setWhitelistTokenId.value && setWhitelistMerkleRoot.value) {
        deleteTx();
        txName.value = "setWhitelistMerkleRoot";

        tx.value = await contract.value.setWhitelistMerkleRoot(
            setWhitelistTokenId.value,
            setWhitelistMerkleRoot.value,
        ).catch((e: Error) => {
            deleteTx();
        });
    } else if (setWhitelistTokenId.value && setWhitelistTimestamp.value) {
        deleteTx();
        txName.value = "setWhitelistTimestamp";

        tx.value = await contract.value.setWhitelistTimestamp(
            setWhitelistTokenId.value,
            setWhitelistTimestamp.value,
        ).catch((e: Error) => {
            deleteTx();
        });
    }
}


// input: set host
const newHost = ref<string>("");
const newHostError = ref<string>("");
const inputNewHost = ref<string>("");

watch(inputNewHost, async () => {
    const s = inputNewHost.value.trim();

    if (s) {
        try {
            newHost.value = ethers.utils.getAddress(s);
        } catch (e) {
            newHost.value = undefined;
            newHostError.value = `Invalid address: "${s}"`;
            return;
        }

        newHostError.value = undefined;
    } else {
        newHost.value = undefined;
        newHostError.value = undefined;
    }
});

const setHost = async () => {
    console.log("setHost");
    deleteTx();
    txName.value = "Set Host";
    tx.value = await contract.value.setHost(newHost.value)
        .catch((e: Error) => {
            deleteTx();
        });
}


// input: revoke host
const oldHost = ref<string>("");
const oldHostError = ref<string>("");
const inputOldHost = ref<string>("");

watch(inputOldHost, async () => {
    const s = inputOldHost.value.trim();

    if (s) {
        try {
            oldHost.value = ethers.utils.getAddress(s);
        } catch (e) {
            oldHost.value = undefined;
            oldHostError.value = `Invalid address: "${s}"`;
            return;
        }

        oldHostError.value = undefined;
    } else {
        oldHost.value = undefined;
        oldHostError.value = undefined;
    }
});

const revokeHost = async () => {
    console.log("revokeHost");
    deleteTx();
    txName.value = "Revoke Host";
    tx.value = await contract.value.revokeHost(oldHost.value)
        .catch((e: Error) => {
            deleteTx();
        });
}


// input: owner
const newOwner = ref<string>("");
const newOwnerError = ref<string>("");
const inputNewOwner = ref<string>("");

watch(inputNewOwner, async () => {
    const s = inputNewOwner.value.trim();

    if (s) {
        try {
            newOwner.value = ethers.utils.getAddress(s);
        } catch (e) {
            newOwner.value = undefined;
            newOwnerError.value = `Invalid address: "${s}"`;
            return;
        }

        newOwnerError.value = undefined;
    } else {
        newOwner.value = undefined;
        newOwnerError.value = undefined;
    }
});

const transferOwnership = async () => {
    console.log("transferOwnership");
    deleteTx();
    txName.value = "Transfer Ownership";
    tx.value = await contract.value.transferOwnership(newOwner.value)
        .catch((e: Error) => {
            deleteTx();
        });
}

// mounted
onMounted(async function () {
    console.log("/monarch/host");
    // await touchContract();
});

// watch: account
watch(account, async () => {
    await clearContract();
    await touchContract();
});

</script>

<template>
    <div>
        <SHeroMonarch />
        <Connected :chain-ids="[1, 4, 5, 56, 97, 10001]">
            <LAutoWidth class="py-16">
                <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">

                    <div class="md:col-span-6">
                        <label for="mint-code" class="block font-medium text-gray-700">
                            Mint Code
                        </label>
                        <div class="mt-1">
                            <textarea id="mint-code" name="mint-code" rows="10"
                                class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md shadow-sm font-mono text-sm placeholder:text-gray-400"
                                v-model="inputMintCode" placeholder="Input Mint Code Here..." />
                        </div>
                        <p v-if="mintCodeError" class="mt-2 text-sm font-semibold text-rose-500">
                            {{ mintCodeError }}
                        </p>
                    </div>

                    <div class="md:col-span-6 flex gap-4">
                        <button type="button" class="flex-1 w-full jt-btn indigo" @click="mint"
                            :disabled="mintCodeJSON === undefined || mintCodeError !== undefined">
                            {{ mintButtonTXT }}
                        </button>
                    </div>

                    <STx class="md:col-span-6 mt-4 lg:mt-6" :tx="tx" :tx-receipt="txReceipt" :tx-name="txName"
                        :tx-replaced="txReplaced" />

                    <div v-if="accountIsOwner" class="md:col-span-6 lg:col-span-3">
                        <label for="base-uri" class="block font-medium text-gray-700">
                            BaseURI
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="base-uri" id="base-uri" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputNewBaseURI"
                                :placeholder="contractBaseURI ? contractBaseURI : 'BaseURI'" />
                            <div v-if="newBaseURI" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="btn-clear font-mono text-indigo-500 sm:text-sm" @click="setURI">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="newBaseURIError" class="mt-2 text-sm text-orange-600">
                            {{ newBaseURIError }}
                        </p>
                    </div>

                    <div v-if="accountIsOwner" class="md:col-span-6 lg:col-span-3">
                        <label for="contract-uri" class="block font-medium text-gray-700">
                            ContractURI
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="contract-uri" id="contract-uri" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputNewContractURI"
                                :placeholder="contractContractURI ? contractContractURI : 'ContractURI'" />
                            <div v-if="newContractURI" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="setContractURI">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="newContractURIError" class="mt-2 text-sm text-orange-600">
                            {{ newContractURIError }}
                        </p>
                    </div>



                    <div v-if="accountIsHost" class="md:col-span-1 lg:col-span-2">
                        <label for="token-id" class="block font-medium text-gray-700">
                            Token ID
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="token-id" id="token-id" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputSetWhitelistTokenId" placeholder="#ID" />
                        </div>
                        <p v-if="setWhitelistTokenIdError" class="mt-2 text-sm text-orange-600">
                            {{ setWhitelistTokenIdError }}
                        </p>
                    </div>

                    <div v-if="accountIsHost" class="md:col-span-5 lg:col-span-4">
                        <label for="merkle-root" class="block font-medium text-gray-700">
                            Merkle Root
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="merkle-root" id="merkle-root" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputSetWhitelistMerkleRoot"
                                :placeholder="placeHolderWLMerkleRoot ? placeHolderWLMerkleRoot : 'Merkle Root'" />
                            <div v-if="setWhitelistMerkleRoot"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="setWhitelist">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="setWhitelistMerkleRootError" class="mt-2 text-sm text-orange-600">
                            {{ setWhitelistMerkleRootError }}
                        </p>
                    </div>

                    <div v-if="accountIsHost" class="md:col-span-4 lg:col-span-3">
                        <label for="timestamp" class="block font-medium text-gray-700">
                            Timestamp
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="timestamp" id="timestamp" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputSetWhitelistTimestamp"
                                :placeholder="placeHolderWLTimestamp ? placeHolderWLTimestamp.toString() : 'Timestamp'" />
                            <div v-if="setWhitelistTimestamp" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="setWhitelist">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="setWhitelistTimestampError" class="mt-2 text-sm text-orange-600">
                            {{ setWhitelistTimestampError }}
                        </p>
                    </div>




                    <div v-if="accountIsOwner" class="md:col-span-4 lg:col-span-3">
                        <label for="ownership" class="block font-medium text-gray-700">
                            Transfer Ownership
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="ownership" id="ownership" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputNewOwner" placeholder="Owner Address" />
                            <div v-if="newOwner" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="transferOwnership">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="newOwnerError" class="mt-2 text-sm text-orange-600">
                            {{ newOwnerError }}
                        </p>
                    </div>



                    <div v-if="accountIsOwner" class="md:col-span-4 lg:col-span-3">
                        <label for="set-host" class="block font-medium text-gray-700">
                            Set Host
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="set-host" id="set-host" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputNewHost" placeholder="Host Address" />
                            <div v-if="newHost" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="setHost">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="newHostError" class="mt-2 text-sm text-orange-600">
                            {{ newHostError }}
                        </p>
                    </div>


                    <div v-if="accountIsOwner" class="md:col-span-4 lg:col-span-3">
                        <label for="revoke-host" class="block font-medium text-gray-700">
                            Revoke Host
                        </label>
                        <div class="mt-1 relative">
                            <input type="text" name="revoke-host" id="revoke-host" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputOldHost" placeholder="Host Address" />
                            <div v-if="oldHost" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button class="font-mono text-indigo-500 sm:text-sm" @click="revokeHost">
                                    EXEC
                                </button>
                            </div>
                        </div>
                        <p v-if="oldHostError" class="mt-2 text-sm text-orange-600">
                            {{ oldHostError }}
                        </p>
                    </div>



                    <div class="md:col-span-6 flex gap-4">
                        <!-- <button v-if="showApprove" type="button" class="flex-1 w-full jt-btn pink"
                            @click="approveERC20">
                            Approve {{ ERC20Symbol }}
                        </button> -->
                        <!-- <button type="button" class="flex-1 w-full jt-btn indigo" @click="bulkTransfer"
                            :disabled="transferDisabled">
                            Bulk Transfer
                        </button> -->
                    </div>
                </div>
            </LAutoWidth>
        </Connected>
    </div>
</template>

