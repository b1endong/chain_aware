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
    const result = rows.map((r) => {
        const option_id = picked.get(r.question_id) ?? null;
        return {
            question_id: r.question_id,
            topic: r.topic,
            option_id,
            correct: option_id === r.correct_option,
        };
    });
    const score = Math.round((100 * result.filter((r) => r.correct).length) / rows.length);
    return {score, passed: score >= PASSED_SCORE, result}
        
}