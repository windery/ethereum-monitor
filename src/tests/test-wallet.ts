import { createWallets, saveWallets, loadWallets, getWalletBalance } from "../wallet/wallets.ts";
import { ethers } from "ethers";

export function testCreateWallets() {
  const wallets = createWallets();
  saveWallets(wallets);
}

export function testLoadWallets() {
  const loadedWallets = loadWallets();
  console.log(JSON.stringify(loadedWallets, null, 2));
}

export function testGetWalletBalance() {
  const providerUrl = process.env.PROVIDER_URL;
  const testWalletAddress = process.env.TEST_WALLET_ADDRESS;
  const provider = new ethers.JsonRpcProvider(providerUrl);

  const loadedWallets = loadWallets();
  const testWallet = loadedWallets.filter(
    (wallet) => wallet.address === testWalletAddress
  )?.[0];
  const walletBalance = getWalletBalance(testWallet, provider);
  console.log(walletBalance);
}