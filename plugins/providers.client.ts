import Web3 from 'web3'
import ERC20_ABI from 'contracts/ERC20.json'
import ERC721_ABI from 'contracts/ERC721.json'

export default defineNuxtPlugin(async function (nuxtApp) {
    const config = useRuntimeConfig();
    const ETH = new Web3(config.ETH_RPOVIDER);
    const BSC = new Web3(config.BSC_PROVIDER);

    const getChainId = async function (provider: Web3) {
        return await provider.eth.getChainId().catch();
    }

    return {
        provide: {
            providers: () => {
                return {
                    ETH: ETH,
                    BSC: BSC,
                }
            },
            fn: () => {
                return {
                    getChainId: getChainId,
                }
            }
        }
    }
})
