import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
// import ERC20_ABI from 'contracts/ERC20.json';
// import ERC721_ABI from 'contracts/ERC721.json';

export default defineNuxtPlugin(async function (nuxtApp) {
    const config = useRuntimeConfig();

    const ETH = new ethers.providers.JsonRpcProvider(config.ETH_RPOVIDER);
    const BSC = new ethers.providers.JsonRpcProvider(config.BSC_RPOVIDER);

    nuxtApp.provide('ETH', ETH);
    nuxtApp.provide('BSC', BSC);

    const connectWallet = async function () {
        console.log('connectWallet');

        const provider = await detectEthereumProvider();

        if (!provider) {
            console.error('no web3 provider');
        } else {
            const web3 = new ethers.providers.Web3Provider(provider)
            
            web3.send("eth_requestAccounts", []).then(accounts => {
                useState('account', () => accounts[0]);
                nuxtApp.provide('web3', web3);
            }).catch(async function (error: Error) {
                console.error('>>> Plugin[providers] connectWallet ~ get accounts:', error);
            });
        }
    };

    const getNetwork = async function (provider: ethers.providers.JsonRpcProvider) {
        return await provider.getNetwork().catch(async function (error: Error) {
            console.error('>>> Plugin[providers] getNetwork:', error);
        });
    };

    return {
        provide: {
            fn: () => {
                return {
                    connectWallet: connectWallet,
                    getNetwork: getNetwork,
                }
            }
        }
    };
});
