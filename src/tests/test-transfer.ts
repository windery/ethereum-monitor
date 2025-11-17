import { ethers } from "ethers";
import { getProvider } from "../provider/provider.ts";
import { loadWallet } from "../wallet/wallets.ts";

export async function testTransfer() {
  const providerUrl = process.env.PROVIDER_URL;
  if (!providerUrl) {
    throw new Error("PROVIDER_URL is not defined");
  }
  const provider = getProvider(providerUrl);

  const walletAddress = process.env.TEST_WALLET_ADDRESS as string;
  const wallet = loadWallet(walletAddress);
  if (!wallet) {
    throw new Error(`Wallet ${walletAddress} not found`);
  }

  const recipientAddress = process.env.TEST_RECIPIENT_ADDRESS as string;
  if (!recipientAddress) {
    throw new Error("TEST_RECIPIENT_ADDRESS is not defined");
  }

  const amountInEther = "0.1";
  const nounce = await provider.getTransactionCount(walletAddress, "pending");
  const feeData = await provider.getFeeData();
  const tx = {
    to: recipientAddress,
    value: ethers.parseEther(amountInEther),
    nounce: nounce,
    gasLimit: 21000,
    gasPrice: feeData.gasPrice
  }

  const transaction = await wallet.sendTransaction(tx);

  const recipt = await transaction.wait();

  console.log("Transaction receipt:", recipt);
}