import { z } from "zod";
import { verifyMessage, getAddress } from "ethers";
import { randomBytes } from "node:crypto";

// Project chỉ là thử nghiệm, không chạy thực tế nên challenge chỉ cần set Map
const challenges = new Map()

export function walletController(db){
    function createChallenge(req, res){
        const nonce = randomBytes(16).toString("hex")
        const message = `ChainAware liên kết ví với tài khoản ${req.user.id}\nNonce: ${nonce}`  
        challenges.set(req.user.id, {message, expiredAt: Date.now() + 10 * 60000}) // challenge chỉ tồn tại trong 5 phút
        res.json({message})  
    }

    async function linkWallet(req, res){
        const {address, signature} = req.body
        if (!address || ! signature) return res.status(400).json({error: "bad_request"})
        const entry = challenges.get(req.user.id)
        challenges.delete(req.user.id); // mỗi thông điệp chỉ dùng một lần
        console.log(entry, Date.now())
        if (!entry || entry.expiredAt < Date.now()) return res.status(400).json({ error: "challenge_expired" });
        let signer, claimed

        try {
            signer = getAddress(verifyMessage(entry.message, signature))
            claimed = getAddress(address)
            // console.log(signer, claimed)
        }
        catch {
            return res.status(400).json({error: "bad_signature"})
        }

        if (signer !== claimed) return res.status(401).json({ error: "signature_mismatch" });

        const {rows: [taken]} = await db.query(
            `SELECT id FROM users WHERE wallet_address = $1 AND id <> $2`, [claimed, req.user.id]
        )
        if (taken) return res.status(409).json({ error: "wallet_already_linked" });

        await db.query(`UPDATE users SET wallet_address = $1 WHERE id = $2`, [claimed, req.user.id]);
        res.json({ walletAddress: address });
    }
    return {createChallenge, linkWallet}
}   