export function adminController(db){
    async function getStats(_req, res){
        // Số học viên
        const {rows: [totals]} = await db.query(
            `SELECT count(*)::int AS users
            FROM users WHERE role = 'user'`
        )

        // Tỉ lệ hoàn thành và điểm trung bình theo modules
        const { rows: modules} = await db.query(
            `SELECT m.id, m.title, COUNT(DISTINCT e.user_id)::int AS enrolled,
                    (COUNT(DISTINCT a.user_id) FILTER (WHERE a.passed)) AS complete,
                    ROUND(100.0 * COUNT(DISTINCT a.user_id) FILTER (WHERE a.passed) 
                        / NULLIF(COUNT(DISTINCT e.user_id), 0), 1)::float AS completion_pct,
                    ROUND(AVG(a.score), 1)::float AS avg_score
            FROM modules m
            LEFT JOIN enrollments e ON e.module_id = m.id
            LEFT JOIN quiz_attempts a ON a.module_id = m.id AND e.user_id = a.user_id
            GROUP BY m.id, m.title
            ORDER BY m.id`
        )

        res.json({totals: totals, modules})
    }

    return{getStats}
}