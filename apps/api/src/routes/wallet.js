import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { walletController } from "../controllers/wallet.js";

export function walletRouter(db){
    const r = Router()
    const c = walletController(db)

    r.get("/me/wallet/challenge", requireAuth(), c.createChallenge)
    r.post("/me/wallet", requireAuth(), c.linkWallet)

    return r
}