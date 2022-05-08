import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import ERC20_ABI from 'contracts/ERC20.json'
import ERC721_ABI from 'contracts/ERC721.json'

export default defineNuxtPlugin(async function (nuxtApp) {
    const config = useRuntimeConfig();
    const ETH = new Web3(config.ETH_RPOVIDER);
    const BSC = new Web3(config.BSC_PROVIDER);

    const connectWallet = async function () {
        console.log('connectWallet');

        const provider = await detectEthereumProvider();
        console.log('provider:', provider);

        if (provider) {
            const web3 = new Web3(provider);
            console.log('web3:', web3);

            const accounts = await provider.request({ method: 'eth_requestAccounts' }).catch(async function (error) {
                console.error('>>> Plugin[providers] connectWallet ~ get accounts:', error);
            });

            const account = useState('account', () => accounts[0]);
            console.log('account:', account);
        } else {
            // no web3 provider
        }
    };

    const getChainId = async function (provider: Web3) {
        return await provider.eth.getChainId().catch();
    };

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
                    connectWallet: connectWallet,
                }
            }
        }
    };
});
