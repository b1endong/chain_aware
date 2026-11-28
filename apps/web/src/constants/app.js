import { KeyRound, ShieldCheck, Signature } from "lucide-react";

// Phải khớp với backend (scoring.js PASSED_SCORE) và CompleteTracker.PASS_SCORE
export const PASS_SCORE = 50;
// Khớp CompleteTracker.MODULE_COUNT
export const MODULE_COUNT = 3;
// Thời hạn chữ ký attestation (attestation.js: deadline = now + 15 phút)
export const ATTESTATION_TTL_MIN = 15;
// Thời hạn thông điệp liên kết ví (wallet.js: expiredAt = now + 10 phút)
export const CHALLENGE_TTL_MIN = 10;
// TestToken.FAUCET_AMOUNT
export const FAUCET_AMOUNT = 1000;
export const TOKEN_SYMBOL = "CALT";

// Trạng thái module trên giao diện (tính từ API + completeMask on-chain)
export const MODULE_STATUS = {
  not_started: { label: "Chưa bắt đầu", tone: "neutral" },
  in_progress: { label: "Đang học", tone: "primary" },
  passed: { label: "Đã đạt — chờ ghi on-chain", tone: "success" },
  onchain: { label: "Đã ghi on-chain", tone: "chain" },
};

// Thông tin hiển thị thêm cho từng module (id khớp bảng modules)
export const MODULE_META = {
  0: {
    icon: KeyRound,
    summary:
      "Hiểu seed phrase → private key → địa chỉ ví, cách sao lưu đúng, phân biệt ví nóng/lạnh/multisig và mối đe doạ trên thiết bị.",
  },
  1: {
    icon: ShieldCheck,
    summary:
      "Nhận diện website & popup ví giả, airdrop lừa đảo, các chiêu thao túng tâm lý và quy trình xử lý khi lỡ tương tác.",
  },
  2: {
    icon: Signature,
    summary:
      "Hiểu approve / transferFrom, rủi ro approval không giới hạn, cách thu hồi và đọc hiểu các loại yêu cầu ký (EIP-712, eth_sign...).",
  },
};

// Nhãn tiếng Việt cho cột questions.topic
export const TOPIC_LABELS = {
  "seed-phrase": "Seed phrase",
  "private-key": "Private key",
  "wallet-types": "Các loại ví",
  "device-security": "An toàn thiết bị",
  "backup-recovery": "Sao lưu & khôi phục",
  "fake-website": "Website giả mạo",
  "social-engineering": "Social engineering",
  "airdrop-scam": "Airdrop lừa đảo",
  impersonation: "Giả danh",
  "incident-response": "Ứng phó sự cố",
  "token-approval": "Token approval",
  "unlimited-approval": "Approval không giới hạn",
  revoke: "Thu hồi approval",
  "signature-types": "Các loại chữ ký",
  "transaction-simulation": "Mô phỏng giao dịch",
};

// Mô tả control tiêu chuẩn (dùng cho tooltip của tag ISO / SOC 2)
export const STANDARD_LABELS = {
  "A.5.7": "Thông tin về mối đe doạ",
  "A.5.15": "Kiểm soát truy cập – đặc quyền tối thiểu",
  "A.5.17": "Quản lý thông tin xác thực",
  "A.5.18": "Quyền truy cập – cấp, rà soát, thu hồi",
  "A.5.24": "Lập kế hoạch ứng phó sự cố",
  "A.5.26": "Ứng phó sự cố ATTT",
  "A.6.3": "Nâng cao nhận thức, đào tạo ATTT",
  "A.6.8": "Báo cáo sự kiện ATTT",
  "A.8.1": "Thiết bị đầu cuối người dùng",
  "A.8.2": "Quyền truy cập đặc quyền",
  "A.8.5": "Xác thực an toàn",
  "A.8.7": "Phòng chống mã độc",
  "A.8.13": "Sao lưu thông tin",
  "A.8.23": "Lọc truy cập web",
  "A.8.24": "Sử dụng mật mã",
  "CC1.4": "Cam kết về năng lực",
  "CC2.2": "Truyền thông trách nhiệm bảo mật nội bộ",
  "CC6.1": "Kiểm soát truy cập logic, bảo vệ khoá",
  "CC6.2": "Cấp quyền truy cập",
  "CC6.3": "Điều chỉnh & thu hồi quyền truy cập",
  "CC6.8": "Ngăn chặn phần mềm độc hại",
  "CC7.2": "Giám sát bất thường",
  "CC7.3": "Đánh giá sự kiện bảo mật",
  "CC7.4": "Ứng phó sự cố",
};
