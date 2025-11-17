import { ethers } from "ethers";

export function getProvider(providerUrl:string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(providerUrl);
}
