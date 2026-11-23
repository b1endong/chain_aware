import {jwt} from "jsonwebtoken"

export function requireAuth(role) {
    const path = (req, res, next) => {
        const token = req.cookies?.session
        if (!token) return res.status(401).json({error: "unauthenticated"})
    } 
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET, {algorithm: ["HS256"]})
        if (user.role !== role && role) return res.status(403).json({error: "forbidden"})
        req.user = user
        next()
    }
    catch{
        return res.status(401).json({ error: "unauthenticated" });
    }
}