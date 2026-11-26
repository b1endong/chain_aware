import { readFileSync } from "node:fs";
import { Wallet } from "ethers";

const { message } = {"message":"ChainAware liên kết ví với tài khoản fe614977-3ac1-4976-85d0-4121c02c18e3\nNonce: d5003eaaca890702ff8fd66aacc9556b"}
const wallet = process.env.TEST_PK ? new Wallet(process.env.TEST_PK) : Wallet.createRandom();

console.log(JSON.stringify({
  address: wallet.address,
  signature: await wallet.signMessage(message),
}, null, 2));
