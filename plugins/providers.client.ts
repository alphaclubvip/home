import Web3 from 'web3'

export default defineNuxtPlugin(async function(nuxtApp) {
    const config = useRuntimeConfig();
    const ETH = new Web3(config.ETH_RPOVIDER);
    const BSC = new Web3(config.BSC_PROVIDER);

    return {
        provide: {
            providers: {
                ETH: ETH,
                BSC: BSC,
            }
        }
    }
})
