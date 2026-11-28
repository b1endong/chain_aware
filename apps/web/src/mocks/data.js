// =============================================================================
// DỮ LIỆU MẪU cho giao diện — mỗi export có đúng hình dạng response của API thật
// (xem apps/api/src/controllers/*). Khi nối API, thay các import từ file này
// bằng dữ liệu fetch về. Có thể xoá cả thư mục mocks/ khi không còn dùng.
// =============================================================================
import { lessons, questionBank } from "./seed";

// GET /api/me → { user }
export const mockUser = {
  id: "8f1c2a4e-3b7d-4c55-9a0e-2d6f1b9c7e31",
  username: "Nguyễn Minh Anh",
  email: "minhanh@example.com",
  role: "admin", // đổi thành "user" để ẩn menu Quản trị
  wallet_address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // null = chưa liên kết ví
};

const MODULES = [
  {
    id: 0,
    slug: "wallet-security",
    title: "Bảo mật ví, Private Key & Seed Phrase",
    iso27001: ["A.5.17", "A.6.3", "A.8.1", "A.8.5", "A.8.7", "A.8.13", "A.8.24"],
    soc2: ["CC1.4", "CC2.2", "CC6.1", "CC6.8"],
  },
  {
    id: 1,
    slug: "phishing-social-engineering",
    title: "Nhận diện Phishing & Social Engineering trong Web3",
    iso27001: ["A.5.7", "A.5.24", "A.5.26", "A.6.3", "A.6.8", "A.8.23"],
    soc2: ["CC1.4", "CC2.2", "CC7.2", "CC7.3", "CC7.4"],
  },
  {
    id: 2,
    slug: "token-approvals-signatures",
    title: "Token Approval & Chữ ký giao dịch",
    iso27001: ["A.5.15", "A.5.18", "A.6.3", "A.8.2", "A.8.24"],
    soc2: ["CC6.1", "CC6.2", "CC6.3"],
  },
];

// GET /api/modules → { module: [...] }
export const mockModules = [
  { ...MODULES[0], enrolled: true, best_score: 90, passed: true },
  { ...MODULES[1], enrolled: true, best_score: 40, passed: false },
  { ...MODULES[2], enrolled: false, best_score: null, passed: false },
];

// GET /api/modules/:moduleId → { module, questions }
// LƯU Ý: API hiện chưa trả body_md (nội dung bài học) — cần thêm vào SELECT của getModule.
export function mockGetModule(moduleId) {
  const base = MODULES.find((m) => m.id === Number(moduleId)) ?? MODULES[0];
  return {
    module: { ...base, body_md: lessons[base.id] },
    questions: questionBank[base.id].map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options.map(({ id, label }) => ({ id, label })),
    })),
  };
}

// POST /api/modules/:moduleId/quiz → { attemptId, score, passed, results }
export function mockQuizResult(moduleId) {
  const questions = questionBank[Number(moduleId)] ?? questionBank[0];
  const wrong = new Set([3, 7]); // giả lập sai câu 4 và câu 8
  const results = questions.map((q, i) => {
    const pick = wrong.has(i) ? q.options.find((o) => !o.is_correct) : q.options.find((o) => o.is_correct);
    return { question_id: q.id, topic: q.topic, option_id: pick.id, correct: !wrong.has(i) };
  });
  const score = Math.round((100 * results.filter((r) => r.correct).length) / results.length);
  return { attemptId: "c1d2e3f4-5a6b-4c7d-8e9f-0a1b2c3d4e5f", score, passed: score >= 50, results };
}

// Tra cứu câu hỏi để hiển thị phần xem lại đáp án.
// (prompt + options có sẵn từ getModule; explanation & đáp án đúng hiện API CHƯA trả về.)
export function mockQuestionLookup(moduleId) {
  const questions = questionBank[Number(moduleId)] ?? questionBank[0];
  return new Map(questions.map((q) => [q.id, q]));
}

// POST /api/modules/:moduleId/attestation → { completion, signature }
export const mockAttestation = {
  completion: {
    learner: mockUser.wallet_address,
    moduleId: "0",
    score: "90",
    nonce: "84720661093475839201746528390174652839017465283901746528390174652839017465",
    deadline: String(Math.floor(Date.now() / 1000) + 14 * 60 + 32),
  },
  signature:
    "0x8d3f6c2b9a41e07d5c3b2a19f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b4a3928170f6e5d4c3b2a1908f7e6d5c4b3a29180f7e6d5c4b3a2918071b",
};

// GET /api/me/wallet/challenge → { message }
export const mockChallenge = {
  message: `ChainAware liên kết ví với tài khoản ${mockUser.id}\nNonce: 3f9a7c1e5b2d48a6904e1f7c3a5b9d2e`,
};

// Trạng thái đọc từ contract (CompleteTracker.completeMask, SoulboundCertificate.certificateOf / issuedAt)
export const mockChainState = {
  connectedAddress: mockUser.wallet_address, // địa chỉ ví đang kết nối trong trình duyệt
  chainId: 202601,
  completeMask: 0b001, // module 01 đã ghi on-chain. Thử 0b111 để xem trạng thái đủ 3 module
  certificate: {
    tokenId: 0, // certificateOf(learner) — 0 nghĩa là chưa có. Thử 12 để xem chứng chỉ đã mint
    issuedAt: 1764318720, // issuedAt(tokenId) — unix timestamp
  },
  lastTxHash: "0x5c1e9a4b7d2f80e3c6a9b1d4f7e2a5c8b0d3f6e9a2c5b8d1f4e7a0c3b6d9f2e5",
};

// Phòng thực hành (TestToken.balanceOf / allowance(user, sink))
export const mockLab = {
  balance: "1000",
  allowance: "100", // "unlimited" khi allowance = type(uint256).max
  transactions: [
    { hash: "0x9b2e4f6a8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e1f3a5b7c9d0e2f4", action: "approve(ApprovalSink, 100)", detail: "Cấp quyền 100 CALT", time: "2 phút trước", tone: "warning" },
    { hash: "0x1a3c5e7f9b2d4f6a8c0e2a4c6e8f1b3d5f7a9c1e3b5d7f9a2c4e6b8d0f2a4c6e8", action: "faucet()", detail: "+1.000 CALT", time: "5 phút trước", tone: "success" },
  ],
};

// GET /api/admin/stats → { totals, modules }
// LƯU Ý: cột `complete` là COUNT không ép ::int nên pg trả về chuỗi — nhớ Number() khi dùng.
export const mockAdminStats = {
  totals: { users: 128 },
  modules: [
    { id: 0, title: MODULES[0].title, enrolled: 96, complete: 81, completion_pct: 84.4, avg_score: 78.6 },
    { id: 1, title: MODULES[1].title, enrolled: 74, complete: 52, completion_pct: 70.3, avg_score: 64.2 },
    { id: 2, title: MODULES[2].title, enrolled: 41, complete: 19, completion_pct: 46.3, avg_score: 55.8 },
  ],
};
