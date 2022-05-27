import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
// import ERC20_ABI from '../contracts/ERC20.json';
// import ERC721_ABI from '../contracts/ERC721.json';

export default defineNuxtPlugin(async function (nuxtApp) {
  const config = useRuntimeConfig();
  nuxtApp.provide('ethers', ethers);
  nuxtApp.provide('ETH', new ethers.providers.JsonRpcProvider(config.ETH_RPOVIDER));
  nuxtApp.provide('BSC', new ethers.providers.JsonRpcProvider(config.BSC_RPOVIDER));

  const web3Account = useState<string>('web3.account', () => "");
  const web3ChainId = useState<number>('web3.chainId', () => 0);
  // const ABI_ERC20 = useState('ABI_ERC20', () => ERC20_ABI);
  // const ABI_ERC721 = useState('ABI_ERC721', () => ERC721_ABI);

  nuxtApp.provide('connectWallet', async function () {
    console.log('connectWallet');

    const provider = await detectEthereumProvider();

    if (!provider) {
      console.error('no web3 provider');
    } else {
      const web3 = new ethers.providers.Web3Provider(provider);

      const accounts = await web3.send("eth_requestAccounts", []).catch(async function (error: Error) {
        console.error('>>> Plugin[providers] connectWallet ~ get accounts:', error);
      });

      if (accounts) {
        nuxtApp.provide('web3', web3);

        // account
        web3Account.value = ethers.utils.getAddress(accounts[0]);

        // sync chain ID
        await web3.send("eth_chainId", []).then((chainIdHex: string) => {
          web3ChainId.value = parseInt(chainIdHex);
        }).catch(async function (error: Error) {
          console.error('>>> Plugin[providers] connectWallet ~ eth_chainId:', error)
        });

        // on: accountsChanged
        provider.on('accountsChanged', (accounts: string[]) => {
          web3Account.value = ethers.utils.getAddress(accounts[0]);
        });

        // on: chainChanged
        provider.on('chainChanged', async (chainId: string) => {
          web3ChainId.value = parseInt(chainId);
        });
      }
    }
  });
});
