import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import ERC20_ABI from 'contracts/ERC20.json';
import ERC721_ABI from 'contracts/ERC721.json';

export default defineNuxtPlugin(async function (nuxtApp) {
    const config = useRuntimeConfig();
    const ETH = new ethers.providers.JsonRpcProvider(config.ETH_RPOVIDER);
    nuxtApp.provide('ETH', ETH);

    // nuxtApp.provide('ethers', ethers);
    // nuxtApp.provide('web3', ETH);

    let web3 = null;
    nuxtApp.provide('web3', web3);

    const connectWallet = async function () {
        console.log('connectWallet');

        const provider = await detectEthereumProvider();

        if (!provider) {
            console.error('no web3 provider');
        }
        else {
            web3 = new ethers.providers.Web3Provider(provider)
            const accounts = await web3.send("eth_requestAccounts", []).catch(async function (error) {
                console.error('>>> Plugin[providers] connectWallet ~ get accounts:', error);
            });
            const account = useState('account', () => accounts[0]);
        }
    };

    const getChainId = async function (provider) {
        // return await provider.eth.getChainId().catch();
        return ''
    };

    console.log('nuxtApp:', nuxtApp);

    return {
        provide: {
            fn: () => {
                return {
                    getChainId: getChainId,
                    connectWallet: connectWallet,
                }
            }
        }
    };
});
