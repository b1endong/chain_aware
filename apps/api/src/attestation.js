import {Wallet, randomBytes, toBigInt, verifyTypedData} from "ethers"
import {pathToFileURL} from "node:url"
process.loadEnvFile(new URL("../.env", import.meta.url))

if (!process.env.ATTESTER_PRIVATE_KEY) {
    throw new Error("Thiếu ATTESTER_PRIVATE_KEY: chạy bằng `node --env-file=.env src/attestation.js` (từ thư mục apps/api)")
}
const attester = new Wallet(process.env.ATTESTER_PRIVATE_KEY)

const type = {
    Completion: [
        {name:"learner", type:"address"},
        {name:"moduleId", type:"uint256"},
        {name:"score", type:"uint256"},
        {name:"nonce", type:"uint256"},
        {name:"deadline", type:"uint256"}
    ]
}

const domain = {
    name: "ChainAware",
    version: "1",
    chainId: Number(process.env.CHAIN_ID ?? 202601),
    verifyingContract: process.env.TRACKER_ADDRESS
}

// Ký attestation
export async function signCompletion(learner, moduleId, score) {
    const value = {
        learner,
        moduleId: BigInt(moduleId),
        score: BigInt(score),
        nonce: toBigInt(randomBytes(32)),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 15 * 60),
    };
    const signature = await attester.signTypedData(domain, type, value)
    return {signature, value}
}

export function toJson(value) {
  return Object.fromEntries(
    Object.entries(value).map(([k, x]) => [k, typeof x === "bigint" ? x.toString() : x]),
  );
}


//TESTING

const learner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" // địa chỉ ví mẫu (anvil #1)
const {signature, value} = await signCompletion(learner, 1, 80)
const recovered = verifyTypedData(domain, type, value, signature)
console.log({value: toJson(value), signature})
console.log("attester :", attester.address)
console.log("recovered:", recovered, recovered === attester.address ? "✔ khớp" : "✘ KHÔNG khớp")

   