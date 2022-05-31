import { ethers } from 'ethers';
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const getProvider = async function () {
  return new ethers.providers.Web3Provider(await web3Modal.connect());
}

const getSigner = async function () {
  const provider = await getProvider();
  return provider.getSigner();
}

export default {
  web3Modal: web3Modal,
  getProvider: getProvider,
  getSigner: getSigner,
}
