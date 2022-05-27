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
  const web3AccountENS = useState<string>('web3.account.ens', () => "");
  const web3AccountAvatar = useState<string>('web3.account.avatar', () => "");
  const web3ChainId = useState<number>('web3.chainId', () => 0);
  // const ABI_ERC20 = useState('ABI_ERC20', () => ERC20_ABI);
  // const ABI_ERC721 = useState('ABI_ERC721', () => ERC721_ABI);

  const resolveENS = async (web3: ethers.providers.Web3Provider) => {
    web3AccountENS.value = "";
    web3AccountAvatar.value = "";

    if (1 === web3ChainId.value) {
      console.log("Getting ENS Name...");
      await web3.lookupAddress(web3Account.value).then(_ensName => {
        web3AccountENS.value = _ensName;
      }).catch(async function (e: Error) {
        console.error('>>> Plugin[providers] connectWallet ~ lookupAddress:', e)
      });

      if (web3AccountENS.value) {
        console.log("Getting NFT Avatar...");
        await web3.getAvatar(web3Account.value).then(_avatar => {
          if (_avatar) {
            web3AccountAvatar.value = _avatar;
          }
        }).catch(async function (e: Error) {
          console.error('>>> Plugin[providers] connectWallet ~ getAvatar:', e)
        });
      }
    }
  }

  nuxtApp.provide('connectWallet', async function () {
    console.log('Connectting Wallet...');

    // provider
    const provider = await detectEthereumProvider();
    if (!provider) {
      console.error('no web3 provider');
    } else {
      const web3 = new ethers.providers.Web3Provider(provider);

      await web3.send("eth_requestAccounts", []).then(async (_accounts) => {
        nuxtApp.provide('web3', web3);

        // account
        web3Account.value = ethers.utils.getAddress(_accounts[0]);

        // sync chain ID
        await web3.send("eth_chainId", []).then((_chainId: string) => {
          web3ChainId.value = parseInt(_chainId);
        }).catch(async function (e: Error) {
          console.error('>>> Plugin[providers] connectWallet ~ eth_chainId:', e)
        });

        // on: accountsChanged
        provider.on('accountsChanged', async (_accountsChanged: string[]) => {
          web3Account.value = ethers.utils.getAddress(_accountsChanged[0]);
          await resolveENS(web3);
        });

        // on: chainChanged
        provider.on('chainChanged', async (_chainId: string) => {
          web3ChainId.value = parseInt(_chainId);
        });

        // ENS
        await resolveENS(web3);
      }).catch(async function (e: Error) {
        console.error('>>> Plugin[providers] connectWallet ~ get accounts:', e);
      });
    }
  });
});
