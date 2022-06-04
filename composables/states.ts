import { ethers } from 'ethers';

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
  const chainId = useState<number>('web3.chainId');

  switch (chainId.value) {
    // ETH
    case 1:
      return 'ETH';
    case 3:
    case 4:
    case 5:
    case 42:
      return 'tETH';
    // BNB
    case 56:
      return 'BNB';
    case 97:
      return 'tBNB';
    // HT
    case 128:
      return 'HT';
    // MATIC
    case 137:
      return 'MATIC';
    default:
      return 'Unknown';
  }
});

export const useDefaultDonation = () => computed(() => {
  const nativeSymbol = useNativeSymbol();

  switch (nativeSymbol.value) {
    case 'BNB':
    case 'tBNB':
      return '0.01';
    case 'HT':
      return '0.01';
    case 'MATIC':
      return '0.01';
    default:
      return '0.005';
  }
});

export const useNativeCurrency = () => computed(() => {
  const chainId = useState<number>('web3.chainId');

  switch (chainId.value) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 42:
      return 'Ξ';
    default:
      return '';
  }
});

export const useNativeDecimals = () => computed(() => {
  return 18;
});

