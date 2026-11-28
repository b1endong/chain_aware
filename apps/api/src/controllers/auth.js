import { hashPassword, verifyPassword } from "../password.js";
import { setSession, clearSession } from "../middleware/auth.js";

export function authController(db) {

    async function register(req, res){
        const {username, email, password} = req.body
        if (!username || !email || !password) return res.status(400).json({error: "bad_request"})
        
        const {rows: [user]} = await db.query(
            `SELECT username, email FROM users WHERE $1 = email`, [email.toLowerCase()]
        )
        if (user) return res.status(409).json({error: "already_registered"})

        const stored = await hashPassword(password)
        const {rows: [new_user]} = await db.query(
            `INSERT INTO users(username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, role`, [username, email.toLowerCase(), stored]
        )
        //console.log(new_user)
        return res.status(200).json({ new_user });
    }

    async function login(req, res) {
        const {email, password} = req.body
        if (!email || !password) return res.status(400).json({error: "bad_request"})
        const {rows: [user]} = await db.query(
            `SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]
        )
        const ok = user && (await verifyPassword(password, user.password_hash));
        if (!ok) return res.status(401).json({ error: "invalid_credentials" });
        setSession(res, user)
        const { password_hash, ...safeUser } = user;
        return res.status(200).json({safeUser})
    }

    async function logout(_req, res){
        clearSession(res)
        res.status(204).end()
    }

    async function me(req, res){
        const {rows: [user]} = await db.query(
            `SELECT id, username, email, role, wallet_address FROM users
            WHERE $1 = id`, [req.user.id]
        )
        if (!user) return res.status(401).json({ error: "unauthenticated" });
        return res.status(200).json({user})
    }
    return {register, login, logout, me}
}