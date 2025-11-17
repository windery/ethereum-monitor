import { ethers } from "ethers";
import fs from "fs";

/**
 * 统一的钱包数据类型接口
 * 用于标准化钱包数据的存储和传输
 * 
 * @interface WalletData
 * @property {string} address - 钱包地址（0x开头）
 * @property {string} privateKey - 钱包私钥
 * @property {string} publicKey - 钱包公钥
 * @property {string} [phrase] - 助记词短语（可选，仅HD钱包有）
 */
export interface WalletData {
  address: string;
  privateKey: string;
  publicKey: string;
  phrase?: string;
}

/**
 * 创建指定数量的HD钱包
 * 使用ethers.Wallet.createRandom()生成随机钱包，支持助记词功能
 * 
 * @function createWallets
 * @param {number} [walletCount=10] - 要创建的钱包数量，默认为10个
 * @returns {ethers.HDNodeWallet[]} HD钱包数组，包含完整的钱包信息
 * 
 * @example
 * // 创建5个HD钱包
 * const wallets = createWallets(5);
 * console.log(wallets[0].address); // 输出第一个钱包地址
 */
export function createWallets(walletCount: number = 10): ethers.HDNodeWallet[] {
  const wallets: ethers.HDNodeWallet[] = [];
  for (let i = 0; i < walletCount; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push(wallet);
  }
  return wallets;
}

/**
 * 保存钱包数据到文件系统
 * 将HD钱包数据序列化为JSON格式并保存到指定目录
 * 
 * @function saveWallets
 * @param {ethers.HDNodeWallet[]} wallets - 要保存的钱包数组
 * @param {string} [walletsDir="./wallets"] - 钱包保存目录，默认为"./wallets"
 * @returns {void}
 * 
 * @example
 * // 保存钱包到指定目录
 * const wallets = createWallets(3);
 * saveWallets(wallets, "./my-wallets");
 */
export function saveWallets(wallets: ethers.HDNodeWallet[], walletsDir: string = "./wallets"): void {
  if (!fs.existsSync(walletsDir)) {
    fs.mkdirSync(walletsDir);
  }
  wallets.forEach((wallet) => {
    const walletData: WalletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      phrase: wallet.mnemonic?.phrase,
    };
    const walletJson = JSON.stringify(walletData, null, 2);
    const walletFilePath = `${walletsDir}/${wallet.address}.json`;
    fs.writeFileSync(walletFilePath, walletJson);
  });
}

/**
 * 从文件系统加载所有钱包数据
 * 读取指定目录下的所有钱包JSON文件并恢复为钱包实例
 * 
 * @function loadWallets
 * @param {string} [walletsDir="./wallets"] - 钱包文件所在目录，默认为"./wallets"
 * @returns {ethers.BaseWallet[]} 恢复的钱包数组
 * 
 * @example
 * // 从默认目录加载所有钱包
 * const wallets = loadWallets();
 * // 从自定义目录加载所有钱包
 * const wallets = loadWallets("./my-wallets");
 */
export function loadWallets(walletsDir: string = "./wallets"): ethers.HDNodeWallet[] {
  const wallets: ethers.HDNodeWallet[] = [];

  if (!fs.existsSync(walletsDir)) {
    return wallets;
  }

  const walletFiles = fs.readdirSync(walletsDir);
  walletFiles.forEach((walletFile) => {
    // 只处理.json文件
    if (!walletFile.endsWith(".json")) {
      return;
    }

    const walletFilePath = `${walletsDir}/${walletFile}`;

    try {
      const walletJson = fs.readFileSync(walletFilePath, "utf8");
      const walletData: WalletData = JSON.parse(walletJson);

      // 如果有助记词，使用助记词恢复HD钱包
      if (walletData.phrase) {
        const wallet = ethers.HDNodeWallet.fromPhrase(walletData.phrase);
        wallets.push(wallet);
      } 
    } catch (error) {
      console.error(`加载钱包文件失败: ${walletFilePath}`, error);
    }
  });

  return wallets;
}

/**
 * 从文件系统加载单个钱包数据
 * 根据钱包地址加载指定的钱包文件并恢复为HD钱包实例
 * 
 * @function loadWallet
 * @param {string} walletAddress - 要加载的钱包地址
 * @param {string} [walletsDir="./wallets"] - 钱包文件所在目录，默认为"./wallets"
 * @returns {ethers.HDNodeWallet | null} 恢复的HD钱包实例，如果未找到则返回null
 * 
 * @example
 * // 加载指定地址的钱包
 * const wallet = loadWallet("0x123...");
 * if (wallet) {
 *   console.log("找到钱包:", wallet.address);
 * }
 */
export function loadWallet(walletAddress: string, walletsDir: string = "./wallets"): ethers.HDNodeWallet | null {
  const walletFilePath = `${walletsDir}/${walletAddress}.json`;
  if (!fs.existsSync(walletFilePath)) {
    return null;
  }

  try {
    const walletJson = fs.readFileSync(walletFilePath, "utf8");
    const walletData: WalletData = JSON.parse(walletJson);

    // 如果有助记词，使用助记词恢复HD钱包
    if (walletData.phrase) {
      return ethers.HDNodeWallet.fromPhrase(walletData.phrase);
    }   
  } catch (error) {
    console.error(`加载钱包文件失败: ${walletFilePath}`, error);
  }

  return null;
}

/**
 * 获取钱包的标准数据格式
 * 将HD钱包实例转换为统一的WalletData格式
 * 
 * @function getWalletData
 * @param {ethers.HDNodeWallet} wallet - HD钱包实例
 * @returns {WalletData} 标准化的钱包数据对象
 * 
 * @example
 * const wallet = createWallets(1)[0];
 * const walletData = getWalletData(wallet);
 * console.log(walletData.address); // 输出钱包地址
 */
export function getWalletData(wallet: ethers.HDNodeWallet): WalletData {
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    phrase: wallet.mnemonic?.phrase,
  };
}

/**
 * 获取指定钱包的余额
 * 通过以太坊Provider查询钱包地址的余额
 * 
 * @function getWalletBalance
 * @param {ethers.HDNodeWallet} wallet - 要查询余额的钱包
 * @param {ethers.Provider} provider - 以太坊Provider实例
 * @returns {Promise<bigint>} 钱包余额（wei单位）
 * 
 * @example
 * const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR-PROJECT-ID");
 * const wallet = createWallets(1)[0];
 * const balance = await getWalletBalance(wallet, provider);
 * console.log(`余额: ${ethers.formatEther(balance)} ETH`);
 */
export async function getWalletBalance(wallet: ethers.HDNodeWallet, provider: ethers.Provider): Promise<bigint> {
  return await provider.getBalance(wallet.address);
}