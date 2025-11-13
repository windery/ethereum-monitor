import dotenv from "dotenv";
import { testCreateWallets, testLoadWallets, testGetWalletBalance } from "./tests/test-wallet.ts";

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

// testCreateWallets();
testLoadWallets();
