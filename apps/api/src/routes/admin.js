import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import { adminController } from "../controllers/admin.js"

export function adminRouter(db){
    const r = Router()
    const c = adminController(db)

    r.get("/admin/stats", requireAuth("admin"), c.getStats)

    return r
}