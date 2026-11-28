import { BookOpen, CircleCheck, Percent, RotateCcw, Users } from "lucide-react";
import { Button, Card, StatTile } from "../components/ui";
import HBarChart from "../components/admin/HBarChart";
import { PASS_SCORE } from "../constants/app";
import { formatNumber, moduleCode } from "../lib/format";
import { mockAdminStats } from "../mocks/data";

export default function Admin() {
  // TODO: GET /api/admin/stats (requireAuth("admin")) → { totals: { users }, modules: [...] }
  //       403 → hiển thị trang không có quyền
  const { totals, modules: raw } = mockAdminStats;
  const loading = false;

  // `complete` có thể là chuỗi (COUNT không ép kiểu) → chuẩn hoá về số
  const modules = raw.map((m) => ({ ...m, complete: Number(m.complete), enrolled: Number(m.enrolled) }));
  const totalEnrolled = modules.reduce((s, m) => s + m.enrolled, 0);
  const totalComplete = modules.reduce((s, m) => s + m.complete, 0);
  const overallPct = totalEnrolled ? Math.round((1000 * totalComplete) / totalEnrolled) / 10 : null;

  // TODO: tải lại số liệu
  function handleRefresh() {}

  const label = (m) => `${moduleCode(m.id)} · ${m.title}`;

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Quản trị</p>
          <h1 className="page-title">Thống kê đào tạo</h1>
          <p className="page-subtitle">Tỉ lệ hoàn thành và điểm trung bình theo từng module — bằng chứng đào tạo nhận thức ATTT (ISO 27001 A.6.3).</p>
        </div>
        <Button variant="secondary" icon={RotateCcw} onClick={handleRefresh} loading={loading}>
          Làm mới
        </Button>
      </div>

      <div className="grid grid-4 mb-24">
        <StatTile icon={Users} label="Học viên" value={formatNumber(totals.users)} hint="Tài khoản vai trò user" />
        <StatTile icon={BookOpen} label="Lượt ghi danh" value={formatNumber(totalEnrolled)} hint={`Trên ${modules.length} module`} />
        <StatTile icon={CircleCheck} tone="success" label="Lượt hoàn thành" value={formatNumber(totalComplete)} hint="Đã đạt bài kiểm tra" />
        <StatTile
          icon={Percent}
          label="Tỉ lệ hoàn thành chung"
          value={overallPct != null ? formatNumber(overallPct) : "—"}
          suffix={overallPct != null ? "%" : undefined}
          hint="Hoàn thành / ghi danh"
        />
      </div>

      <div className="grid grid-2 mb-24">
        <Card title="Tỉ lệ hoàn thành theo module" subtitle="% học viên đã ghi danh và đạt bài kiểm tra">
          <HBarChart
            ariaLabel="Tỉ lệ hoàn thành theo module"
            rows={modules.map((m) => ({
              key: m.id,
              label: label(m),
              value: m.completion_pct,
              display: m.completion_pct != null ? `${formatNumber(m.completion_pct)}%` : "—",
              tooltip: [
                ["Hoàn thành", `${formatNumber(m.complete)} / ${formatNumber(m.enrolled)}`],
                ["Tỉ lệ", m.completion_pct != null ? `${formatNumber(m.completion_pct)}%` : "—"],
              ],
            }))}
          />
        </Card>

        <Card title="Điểm trung bình theo module" subtitle="Trung bình mọi lượt làm bài (thang 100)">
          <HBarChart
            ariaLabel="Điểm trung bình theo module"
            threshold={{ value: PASS_SCORE, label: `Điểm đạt ${PASS_SCORE}` }}
            rows={modules.map((m) => ({
              key: m.id,
              label: label(m),
              value: m.avg_score,
              display: m.avg_score != null ? formatNumber(m.avg_score) : "—",
              tooltip: [
                ["Điểm TB", m.avg_score != null ? formatNumber(m.avg_score) : "—"],
                ["So với điểm đạt", m.avg_score != null ? `${m.avg_score >= PASS_SCORE ? "+" : ""}${formatNumber(m.avg_score - PASS_SCORE)}` : "—"],
              ],
            }))}
          />
        </Card>
      </div>

      <Card title="Chi tiết theo module" padded={false}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Module</th>
                <th className="num">Ghi danh</th>
                <th className="num">Hoàn thành</th>
                <th className="num">Tỉ lệ hoàn thành</th>
                <th className="num">Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="row" style={{ "--gap": "10px", flexWrap: "nowrap" }}>
                      <span className="module-chip mono">{moduleCode(m.id)}</span>
                      <span className="fw-600">{m.title}</span>
                    </div>
                  </td>
                  <td className="num">{formatNumber(m.enrolled)}</td>
                  <td className="num">{formatNumber(m.complete)}</td>
                  <td className="num">{m.completion_pct != null ? `${formatNumber(m.completion_pct)}%` : "—"}</td>
                  <td className="num">
                    {m.avg_score != null ? (
                      <span className={m.avg_score >= PASS_SCORE ? "" : "text-danger"}>{formatNumber(m.avg_score)}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
