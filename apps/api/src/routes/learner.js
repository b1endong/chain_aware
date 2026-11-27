import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { learnerController } from "../controllers/learner.js"

export function learnerRouter(db){
    const r = Router()
    const c = learnerController(db)

    r.get("/modules", requireAuth(), c.listModules)
    r.get("/modules/:moduleId", requireAuth(), c.getModule)
    r.post("/modules/:moduleId/enroll", requireAuth(), c.enroll)
    r.post("/modules/:moduleId/quiz", requireAuth(), c.submitQuiz)
    r.post("/modules/:moduleId/attestation", requireAuth(), c.createAttestation)

    return r

}