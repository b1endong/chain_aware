import {Wallet, randomBytes, toBigInt} from "ethers"

const attester = new Wallet(process.env.ATTESTER_PRIVATE_KEY)

const type = {
    Completion: [
        {name:"learner", type:"address"},
        {name:"moduleId", type:"uint256"},
        {name:"nonce", type:"unit256"},
        {name:"score", type:"unit256"},
        {name:"deadline", type:"unit256"}
    ]
}

const domain = {
    name: "ChainAware",
    version: "1",
    chainId: Number(process.env.CHAIN_ID ?? 202601),
    verifyingContract: process.env.TRACKER_ADDRESS
}

// Ký attestation
export async function signCompletion(learner, moudleId, score) {
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
   