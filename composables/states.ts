export const useWeb3ChainId = () => useState<number>('web3.chainId');
export const useWeb3Account = () => useState<string>("web3.account");
export const useWeb3Address = () => computed(() => {
  const accountENS = useState<string>("web3.account.ens");
  if (accountENS.value) {
    return accountENS.value;
  }

  const account = useState<string>("web3.account");
  if (account.value) {
    return account.value.slice(0, 6) + "..." + account.value.slice(-4);
  }

  return "";
});
export const useWeb3AccountENS = () => useState<string>("web3.account.ens");
export const web3AccountAvatar = () => useState<string>("web3.account.avatar");
