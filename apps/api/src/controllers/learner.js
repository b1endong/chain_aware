import { scoringQuiz, attemptResults } from "../scoring.js"
import { signCompletion, toJson } from "../attestation.js"

export function learnerController(db){
    
    // Liệt kê tất cả module cùng trạng thái hoạt động của học viên 
    // (đã enroll vào module hay chưa, có điểm cao nhất chưa, đã passed module nào chưa)
    async function listModules(req, res) {
        console.log(1)
        const { rows } = await db.query(
            `SELECT m.id, m.slug, m.title, m.iso27001, m.soc2,
                    (e.user_id IS NOT NULL) AS enrolled,
                    max(a.score)::int AS best_score,
                    coalesce(bool_or(a.passed), false) AS passed
            FROM modules m
            LEFT JOIN enrollments e ON m.id = e.module_id AND e.user_id = $1
            LEFT JOIN quiz_attempts a ON m.id = a.module_id AND a.user_id = $1
            GROUP BY m.id, e.user_id
            ORDER BY m.id`, [req.user.id]
        ) 

        res.json({module: rows})
    }

    // Trả về nội dung câu hỏi và các lựa chọn của nó theo moduleId
    async function getModule(req, res) {
        const moduleId = req.params.moduleId
        // Lấy module theo Id
        const {rows: [module]} = await db.query(
            `SELECT id, slug, title, iso27001, soc2 FROM modules
            WHERE id = $1`, [moduleId]
        )
        if (!module) return res.status(404).json({ error: "not_found" });

        const {rows: questions} = await db.query(
            `SELECT q.id, q.prompt, 
                    json_agg(json_build_object('id', o.id, 'label', o.label) ORDER BY random()) AS options 
            FROM questions q
            JOIN options o ON o.question_id = q.id
            WHERE q.module_id = $1
            GROUP BY q.id, q.prompt
            ORDER BY random()`, [moduleId]
        )

        res.json({ module: module, questions });
    }

    // export async function scoringQuiz(db, moduleId, answers)
    // return {score, passed: score >= PASSED_SCORE, result}       
    // export async function attemptResults(db, userId, moduleId, graded)
    // const answers_test = [
    //     { question_id: "00000000-0000-4000-8000-000000000100", option_id: "00000000-0000-4000-8000-000000000101" },
    //     { question_id: "00000000-0000-4000-8000-000000000200", option_id: "00000000-0000-4000-8000-000000000203" },
    //     { question_id: "00000000-0000-4000-8000-000000000300", option_id: "00000000-0000-4000-8000-000000000304" }
    // ]
    async function enroll(req, res){
        const moduleId = req.params.moduleId
        if (!moduleId) return res.status(400).json({ error: "bad_request" });
        await db.query(
            `INSERT INTO enrollments(user_id, module_id) 
            VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.user.id, moduleId]
        )
        res.status(204).end()
    }

    async function submitQuiz(req, res) {
        const moduleId = req.params.moduleId
        const answers = req.body.answers
        if (!moduleId) return res.status(400).json({ error: "bad_request" });
        await db.query(
            `INSERT INTO enrollments(user_id, module_id) 
            VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.user.id, moduleId]
        )

        const graded = await scoringQuiz(db, moduleId, answers)
        // console.log(graded)
        const attemptId = attemptResults(db, req.user.id, moduleId, graded)

        res.json({ attemptId, score: graded.score, passed: graded.passed, results: graded.results });
        
    }

    // export async function signCompletion(learner, moduleId, score) 
    async function createAttestation(req, res){
        const moduleId = req.params.moduleId
        const {rows: [user]} = await db.query(
            `SELECT wallet_address FROM users WHERE id = $1 `, [req.user.id]
        )
        if (!user?.wallet_address) return res.status(409).json({ error: "wallet_not_linked" });

        const {rows: [best]} = await db.query(
            `SELECT max(score)::int AS score FROM quiz_attempts
            WHERE user_id = $1 AND module_id = $2 AND passed`, [req.user.id, moduleId] 
        )
        if (best?.score == null) return res.status(403).json({ error: "quiz_not_passed" });

        const {signature, value} = await signCompletion(user.wallet_address, moduleId, best.score)
        await db.query(
            `INSERT INTO attestations (nonce, user_id, module_id, score, deadline, signature)
            VALUES ($1, $2, $3, $4, to_timestamp($5), $6)`, 
            [value.nonce.toString(), req.user.id, moduleId, best.score, Number(value.deadline), signature]
        )
        res.json({ completion: toJson(value), signature });
    } 
    

    return {listModules, getModule, enroll, submitQuiz, createAttestation}
}