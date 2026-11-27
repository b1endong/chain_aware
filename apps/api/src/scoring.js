// Phải khớp với CompleteTracker.PASS_SCORE (contract kiểm tra score >= 50)
export const PASSED_SCORE = 50

// Câu trả lời sẽ có dạng [{ question_id, option_id }]
export async function scoringQuiz(db, moduleId, answers){
    // Chọn đáp án đúng của mọi câu hỏi trong module
    const {rows} = await db.query(
        `SELECT q.id AS question_id, q.topic, o.id AS correct_option
        FROM questions q
        JOIN options o ON q.id = o.question_id AND o.is_correct = true
        WHERE q.module_id = $1`,
        [moduleId]
    )

    // Module không có câu hỏi → tránh chia cho 0 (score = NaN)
    if (rows.length === 0) {
        throw new Error(`Module ${moduleId} không có câu hỏi`)
    }

    // Map lựa chọn của candidate
    const picked = new Map(answers.map((a) => [a.question_id, a.option_id]));
    // So sánh lựa chọn của candidate với đáp án đúng (câu bỏ trống tính là sai)
    const results = rows.map((r) => {
        const option_id = picked.get(r.question_id) ?? null;
        return {
            question_id: r.question_id,
            topic: r.topic,
            option_id,
            correct: option_id === r.correct_option,
        };
    });
    const score = Math.round((100 * results.filter((r) => r.correct).length) / rows.length);
    return {score, passed: score >= PASSED_SCORE, results}       
}

export async function attemptResults(db, userId, moduleId, graded){

    const {rows} = await db.query(
        `INSERT INTO quiz_attempts (user_id, module_id, score, passed) 
        VALUES ($1, $2, $3, $4) RETURNING id`, [userId, moduleId, graded.score, graded.passed]
    )
    const attempt_id = rows[0].id
    for (const r of graded.results){
        await db.query(
            `INSERT INTO attempt_answers (attempt_id, question_id, option_id, is_correct)
            VALUES ($1, $2, $3, $4)`, [attempt_id, r.question_id, r.option_id, r.correct]
        )
    }
    return attempt_id
}


//TESTING
// import pg from "pg"
// process.loadEnvFile(new URL("../.env", import.meta.url))
// const db = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
// });
// const answers_test = [
//     { question_id: "00000000-0000-4000-8000-000000000100", option_id: "00000000-0000-4000-8000-000000000101" },
//     { question_id: "00000000-0000-4000-8000-000000000200", option_id: "00000000-0000-4000-8000-000000000203" },
//     { question_id: "00000000-0000-4000-8000-000000000300", option_id: "00000000-0000-4000-8000-000000000304" }
// ]
// const passed = await scoringQuiz(db, 0, answers_test)
// console.log(passed)