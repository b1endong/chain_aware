import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { authController } from "../controllers/auth.js"

export function authRouter(db) {
    const c = authController(db)
    const r = Router()

    r.post("/auth/login", c.login)
    r.post("/auth/register", c.register)
    r.post("/auth/logout", c.logout)
    r.get("/me", requireAuth(), c.me)

    return r
}
