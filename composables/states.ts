import { ethers } from 'ethers';


export const useWeb3Provider = () => useState<ethers.providers.Web3Provider>('web3.provider');
export const useWeb3Signer = () => computed(() => {
  const provider = useWeb3Provider();
  return provider.value.getSigner();
});

export const useWeb3ChainId = () => useState<number>('web3.chainId');
export const useWeb3Balance = () => useState<ethers.BigNumber>('web3.balance');
export const useWeb3Account = () => useState<string>('web3.account');
export const useWeb3Address = () => computed(() => {
  const accountENS = useState<string>('web3.account.ens');
  if (accountENS.value) {
    return accountENS.value;
  }

  const account = useState<string>('web3.account');
  if (account.value) {
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`;
  }

  return "";
});
export const useWeb3AccountENS = () => useState<string>('web3.account.ens');
export const web3AccountAvatar = () => useState<string>('web3.account.avatar');

export const useNativeSymbol = () => computed(() => {
  const chainId = useWeb3ChainId();

  switch (chainId.value) {
    case 1:
    case 4:
      return 'ETH';
    default:
      return 'Unknown';
  }
});

export const useNativeDecimals = () => computed(() => {
  return 18;
});

