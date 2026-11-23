import { verifyMessage, getAddress } from "ethers";
import { randomBytes } from "node:crypto";

export function walletChallenge(userId){
    const nonce = randomBytes(16).toString('hex')
    const message = `ChainAware: Liên kết ví với tài khoản ${userId}\nNonce:${nonce}`
    const expiredDate = Date.now + 5 * 60000
    console.log(message, expiredDate)
    return {message, expiredDate}
}

export function verifyWalletAddress(address, message, signature){
    const check = getAddress(verifyMessage(message, signature) === getAddress(address))
}

