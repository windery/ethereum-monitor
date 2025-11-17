import { getProvider } from "../provider/provider.ts";

export async function testProvider() {
  const providerUrl = process.env.PROVIDER_URL;
  const testTransactionId = process.env.TEST_TRANSACTION_ID as string;
  if (!providerUrl) {
    throw new Error("PROVIDER_URL is not defined");
  }
  const provider = getProvider(providerUrl);
  const network = await provider.getNetwork();
  console.log(`Network: ${JSON.stringify(network, null, 2)}`);

  const feeData = await provider.getFeeData();
  console.log(`Fee Data: ${JSON.stringify(feeData, null, 2)}`);

  const blockNumber = await provider.getBlockNumber();
  console.log(`Block Number: ${blockNumber}`);

  const transaction = await provider.getTransaction(testTransactionId);
  console.log(`Transaction: ${JSON.stringify(transaction, null, 2)}`);
}
