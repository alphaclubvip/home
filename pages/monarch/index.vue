<script setup lang="ts">
import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@/utils/ethers';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/outline";
import utilWeb3 from '@/utils/web3';
import ERC20_ABI from '@/contracts/ERC20.json';
import ALPHA_CLUB_001_ABI from '@/contracts/AlphaClub001.json';

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

        await touchERC20();
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

// approve: ERC20
const approveERC20 = async () => {
    console.log("approveERC20");

    const ERC20Contract = await utilWeb3.makeContract(ERC20Address.value, ERC20_ABI);

    deleteTx();
    txName.value = "Approve";
    tx.value = await ERC20Contract.approve(config.ALPHA_CLUB_001, ethers.constants.MaxUint256)
        .catch((e: Error) => {
            deleteTx();
        });
    // TODO: update ERC20Allowance
}

// bulk transfer
const bulkTransfer = async () => {
    console.log("bulkTransfer");

    const overrides = { value: txValue.value }

    if (isERC20.value) {
        if (isSameAmount.value) {
            deleteTx();
            txName.value = "Bulk Transfer";
            tx.value = await contract.value.bulkTransferERC20Same(ERC20Address.value, txRecipients.value, bnAmount.value, overrides)
                .catch((e: Error) => {
                    deleteTx();
                });
        } else {
            deleteTx();
            txName.value = "Bulk Transfer";
            tx.value = await contract.value.bulkTransferERC20(ERC20Address.value, txRecipients.value, txAmounts.value, overrides)
                .catch((e: Error) => {
                    deleteTx();
                });
        }
    } else if (isSameAmount.value) {
        deleteTx();
        txName.value = "Bulk Transfer";
        tx.value = await contract.value.bulkTransferSame(txRecipients.value, bnAmount.value, overrides)
            .catch((e: Error) => {
                deleteTx();
            });
    } else {
        deleteTx();
        txName.value = "Bulk Transfer";
        tx.value = await contract.value.bulkTransfer(txRecipients.value, txAmounts.value, overrides)
            .catch((e: Error) => {
                deleteTx();
            });
    }

    // 0xce0e62c41eb744859ce9869809a1f2ddea315d68 APE
    // ["0x0000002d55c53Ed508AB99f88e0473c0D4e002f7", "0x000000d2537D519b693f8ca4c8a3fB8A36EE8990"], 1
}

// mounted
onMounted(async function () {
    console.log("/contracts/bulk");
    await touchContract();
});

// watch: account
watch(account, async () => {
    await touchContract();
    await touchERC20();
});

// init bulk contract
async function touchContract() {
    if (account.value) {
        if (isNative.value || isERC20.value) {
            const _signer = await utilWeb3.getSigner();
            contract.value = new ethers.Contract(config.ALPHA_CLUB_001, ALPHA_CLUB_001_ABI, _signer);
        }
    }
}

// symbol
const symbol = computed(() => {
    return isERC20.value ? ERC20Symbol.value : nativeSymbol.value;
});

// select: type
const typeOptions = computed(() => {
    return [
        {
            value: "A",
            title: `Type A - Bulk Transfer ${nativeSymbol.value}`,
        },
        {
            value: "B",
            title: `Type B - Bulk Transfer ${nativeSymbol.value} (Same Value)`,
        },
        {
            value: "C",
            title: "Type C - Bulk Transfer ERC20",
        },
        {
            value: "D",
            title: "Type D - Bulk Transfer ERC20 (Same Value)",
        },
    ]
});
const type = ref<string>('A');
watch(type, () => {
    console.log("type: start");
    touchList();
    touchContract();
    console.log("type: finished");
});
const typeDesc = computed(() => {
    switch (type.value) {
        case "A":
            return `Transfer different amounts of ${nativeSymbol.value} to multiple addresses.`;
            break;
        case "B":
            return `Transfer a same amount of ${nativeSymbol.value} to multiple addresses, less than type A.`;
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
const isNative = computed(() => {
    return type.value === "A" || type.value === "B";
});
const isERC20 = computed(() => {
    return type.value === "C" || type.value === "D";
});
const isERC721 = computed(() => {
    return type.value === "E" || type.value === "F";
});
const isERC1155 = computed(() => {
    return type.value === "G" || type.value === "H";
});
const isSameAmount = computed(() => {
    return type.value === "B" || type.value === "D";
});


const txDecimals = computed(() => {
    if (isNative.value) {
        return nativeDecimals.value;
    }

    if (isERC20.value) {
        return ERC20Decimals.value;
    }

    if (isERC721.value || isERC1155.value) {
        return 0;
    }

    return undefined;
});

function convertBN2String(bn: ethers.BigNumber) {
    if (ERC20Symbol.value) {
        // ERC20
        return ethers.utils.formatUnits(bn, txDecimals.value);

        // TODO: ERC721, ERC1155
    } else {
        // Native
        return ethers.utils.formatUnits(bn, nativeDecimals.value);
    }
}

function convertString2BN(s: string) {
    if (ERC20Symbol.value) {
        // ERC20
        return ethers.utils.parseUnits(s, txDecimals.value);

        // TODO: ERC721, ERC1155
    } else {
        // Native
        return ethers.utils.parseUnits(s, nativeDecimals.value);
    }
}


// _amount
const inputAmount = ref<string>("");
watch(inputAmount, () => {
    bnAmounts.value = [];
    if (inputAmount.value) {
        inputAmount.value = formatAmount(inputAmount.value, txDecimals.value);
    }
    touchList();
});
const bnAmount = computed(() => {
    if (inputAmount.value) {
        return convertString2BN(inputAmount.value);
    }

    return ethers.BigNumber.from(0);
});
const txAmount = computed(() => {
    return bnAmount.value.toString();
});

// _token
const inputERC20 = ref<string>("");
const inputERC20Error = ref<string>("");
watch(inputERC20, async () => {
    deleteERC20();

    const s = inputERC20.value.trim();
    if (s) {
        try {
            ERC20Address.value = ethers.utils.getAddress(s);
        } catch (e) {
            inputERC20Error.value = `Invalid address: "${s}"`;
            return;
        }

        await touchERC20();
    }
});

// ERC20
const ERC20Address = ref<string>("");
const ERC20Name = ref<string>("");
const ERC20Symbol = ref<string>("");
const ERC20Decimals = ref<number>(0);
const ERC20Balance = ref<ethers.BigNumber>(ethers.BigNumber.from(0));
const ERC20Allowance = ref<ethers.BigNumber>(ethers.BigNumber.from(0));
const ERC20Approved = computed(() => {
    return ERC20Allowance.value.gte(bnAmountSum.value);
});
async function touchERC20() {
    if (ERC20Address.value) {
        try {
            const data = await contract.value.readERC20(ERC20Address.value, account.value);
            ERC20Name.value = data.name;
            ERC20Symbol.value = data.symbol;
            ERC20Decimals.value = data.decimals;
            ERC20Balance.value = data.balance;
            ERC20Allowance.value = data.allowance;
            touchList();
        } catch (e) {
            deleteERC20();
            inputERC20Error.value = `Not a ERC20 Token Contract Address`;
            return;
        }
    }
}
function deleteERC20() {
    inputERC20Error.value = "";
    ERC20Address.value = "";
    ERC20Name.value = "";
    ERC20Symbol.value = "";
    ERC20Decimals.value = 0;
    ERC20Balance.value = ethers.BigNumber.from(0);
    ERC20Allowance.value = ethers.BigNumber.from(0);
}


// textarea: list
const list = ref<string>("");
watch(list, () => {
    listError.value = '';

    let arrAddress = [];
    let arrAmount = [];

    txRecipients.value = arrAddress;
    bnAmounts.value = arrAmount;

    makeAddresses();

    if (isSameAmount.value) {
        touchSameAmounts();
    } else {
        makeAmounts();
    }
});
function touchList() {
    if (isSameAmount.value) {
        // same amount

        if (txRecipients.value) {
            list.value = txRecipients.value.join('\n');
        }

        if (0 < bnAmounts.value.length) {
            inputAmount.value = convertBN2String(bnAmounts.value[0]);
        }

    } else if (txRecipients.value && bnAmounts.value) {
        // diff amount

        let arr = [];
        for (let i: number = 0; i < txRecipients.value.length; i++) {
            if (bnAmounts.value.length > i) {
                arr.push(`${txRecipients.value[i]}, ${convertBN2String(bnAmounts.value[i])}`);
            } else if (bnAmount.value.gt(0)) {
                arr.push(`${txRecipients.value[i]}, ${convertBN2String(bnAmount.value)}`);
            } else {
                // only recipients
                arr.push(`${txRecipients.value[i]}, `);
            }
        }

        list.value = arr.join('\n');
    }
}
const listError = ref<string>("");
const listLable = computed(() => {
    if (isERC20.value) {
        if (ERC20Symbol.value) {
            return isSameAmount.value ? `${ERC20Symbol.value} Recipients` : `Recipients and ${ERC20Symbol.value} amounts`;
        }

        return isSameAmount.value ? `Recipients` : `Recipients and amounts`;
    }

    return isSameAmount.value ? `${nativeSymbol.value} Recipients` : `Recipients and ${nativeSymbol.value} values`;
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
const bnAmountSum = computed(() => {
    if (bnAmounts.value.length) {
        let rlt = ethers.BigNumber.from(0);

        bnAmounts.value.forEach((_value, _index) => {
            rlt = rlt.add(_value);
        });

        return rlt;
    }

    return ethers.BigNumber.from(0);
});

// input: donate
const inputDonate = ref<string>("");
const defaultDonation = useDefaultDonation();
const bnDonate = computed(() => {
    if (inputDonate.value) {
        return ethers.utils.parseUnits(inputDonate.value, nativeDecimals.value);
    }

    return ethers.utils.parseUnits(defaultDonation.value, nativeDecimals.value);
});
watch(inputDonate, () => {
    inputDonate.value = formatAmount(inputDonate.value, nativeDecimals.value);
});

// tx: value
const bnValue = computed(() => {
    if (isERC20.value) {
        return bnDonate.value;
    } else {
        return bnAmountSum.value.add(bnDonate.value);
    }
});
const txValue = computed(() => {
    return bnValue.value.toString();
});

// preview
const previewReady = computed(() => {
    if (isERC20.value) {
        if (!ERC20Symbol.value) {
            return false;
        }
    }

    return 0 < previewRows.value.length;
});
const showPreview = ref(false);
function togglePreview() {
    showPreview.value = !showPreview.value;
}
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
function makeAddresses() {
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
function makeAmounts() {
    let arrAmounts = [];
    bnAmounts.value = arrAmounts;

    lines.value.forEach((_line: string, _i: number) => {
        const lineNumber = _i + 1;

        const arrLine = _line.split(',');
        if (isERC20.value && !ERC20Symbol.value) {
            listError.value = `Please input Token Contract Address first.`;
            return;
        }

        if (arrLine.length > 1) {
            const _pos1 = arrLine[1].trim();
            try {
                const _amount = ethers.BigNumber.from(ethers.utils.parseUnits(_pos1, txDecimals.value));
                if (_amount.gt(0)) {
                    arrAmounts.push(_amount);
                } else {
                    listError.value = `Line #${lineNumber} - Invalid amount: "${_pos1}"`;
                    return;
                }
            } catch (e) {
                listError.value = `Line #${lineNumber} - Invalid amount: "${_pos1}"`;
                return;
            }
        } else {
            listError.value = `Line #${lineNumber} - Empty amount`;
            return;
        }
    });

    bnAmounts.value = arrAmounts;
}

// same amout => amounts
function touchSameAmounts() {
    let arrAmount = [];
    bnAmounts.value = arrAmount;

    if (inputAmount.value) {
        txRecipients.value.forEach((_address: string, _i: number) => {
            arrAmount.push(bnAmount.value);
        });

        bnAmounts.value = arrAmount;
    }
}




const showApprove = computed(() => {
    if (isERC20.value) {
        if (ERC20Approved.value) {
            return false;
        }

        return true;
    }

    return false;
});


const transferDisabled = computed(() => {
    if (isERC20.value) {
        if (ERC20Balance.value.gte(bnAmountSum.value) && ERC20Approved.value) {
            return false;
        }

        return true;
    }

    return false;
});
</script>

<template>
    <div>
        <SHeroMonarch />
        <Connected :chain-ids="[1, 4, 5, 56, 97, 10001]">
            <LAutoWidth class="py-16">
                <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
                    <div class="md:col-span-3">
                        <label for="type" class="block font-medium text-gray-700">
                            Type
                        </label>
                        <div class="mt-1">
                            <select id="type" name="type" v-model="type"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono">
                                <option v-for="option in typeOptions" :value="option.value" :key="option.value">
                                    {{ option.title }}
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
                            <input type="text" name="amount" id="amount" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md"
                                v-model="inputAmount" />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="font-mono text-gray-400 sm:text-sm">
                                    {{ symbol }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="isERC20" class="md:col-span-5 lg:col-span-4">
                        <label for="token-address" class="block font-medium text-gray-700">
                            ERC20 Token Contract Address
                        </label>
                        <div class="mt-1">
                            <input type="text" name="token-address" id="token-address" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full font-mono sm:text-sm border-gray-300 rounded-md"
                                v-model="inputERC20" />
                        </div>
                        <p v-if="inputERC20Error" class="mt-2 text-sm font-semibold text-rose-500">
                            {{ inputERC20Error }}
                        </p>
                        <p v-if="ERC20Name" class="mt-2 flex gap-1 text-sm text-gray-500">
                            <span>Balance:</span>
                            <FormattedBN :bn-value="ERC20Balance" :decimals="ERC20Decimals" />
                            <span class="font-semibold">{{ ERC20Symbol }}</span>
                            <span>({{ ERC20Name }})</span>
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
                            <input type="text" name="donate" id="donate" autocomplete="off"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 font-mono sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
                                v-model="inputDonate" :placeholder="defaultDonation" />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="font-mono text-gray-400 sm:text-sm">
                                    {{ nativeSymbol }}
                                </span>
                            </div>
                        </div>
                        <p v-if="bnDonate.gt(0)" class="mt-2 text-sm text-gray-500">
                            Donate to help us build more useful tools.
                        </p>
                        <p v-else class="mt-2 text-sm text-orange-600">
                            Sad, but of course you can use this for FREE.
                        </p>
                    </div>

                    <div v-if="previewReady" class="md:col-span-6 flex flex-col">
                        <div class="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-between">
                            <div class="sm:flex-auto">
                                <h1 class="text-xl font-semibold text-gray-900">
                                    Total
                                    <FormattedBN v-if="isERC20" :bn-value="bnAmountSum" :decimals="ERC20Decimals" />
                                    <FormattedBN v-else :bn-value="bnAmountSum" :decimals="nativeDecimals" />
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
                                                    <th scope="col" class="hidden md:block">Index</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-gray-100 bg-white">
                                                <tr v-for="(row, index) in previewRows" :key="index">
                                                    <td class="hidden md:block">{{ index + 1 }}</td>
                                                    <td>{{ row.address }}</td>
                                                    <td class="end">
                                                        <FormattedBN v-if="isERC20" :bn-value="row.amount"
                                                            :decimals="ERC20Decimals" :prefix="nativeCurrency" />
                                                        <FormattedBN v-else :bn-value="row.amount"
                                                            :decimals="nativeDecimals" :prefix="nativeCurrency" />
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

                    <STx class="md:col-span-6 mt-4 lg:mt-6" :tx="tx" :tx-receipt="txReceipt" :tx-name="txName"
                        :tx-replaced="txReplaced" />

                    <div class="md:col-span-6 flex gap-4">
                        <button v-if="showApprove" type="button" class="flex-1 w-full jt-btn pink"
                            @click="approveERC20">
                            Approve {{ ERC20Symbol }}
                        </button>
                        <button type="button" class="flex-1 w-full jt-btn indigo" @click="bulkTransfer"
                            :disabled="transferDisabled">
                            Bulk Transfer
                        </button>
                    </div>
                </div>
            </LAutoWidth>
        </Connected>
    </div>
</template>
