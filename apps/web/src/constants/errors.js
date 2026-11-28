// Thông báo lỗi tiếng Việt cho mã lỗi từ API ({ error: "..." }) và custom error của contract.
// Dùng: getErrorMessage(err.error) hoặc getErrorMessage(decodedRevert.name)

export const API_ERRORS = {
  bad_request: "Thiếu thông tin bắt buộc. Vui lòng kiểm tra lại.",
  unauthenticated: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  forbidden: "Bạn không có quyền truy cập trang này.",
  not_found: "Không tìm thấy nội dung yêu cầu.",
  already_registered: "Email này đã được đăng ký.",
  invalid_credentials: "Email hoặc mật khẩu không đúng.",
  challenge_expired: "Thông điệp xác minh đã hết hạn. Hãy lấy thông điệp mới.",
  bad_signature: "Chữ ký không hợp lệ.",
  signature_mismatch: "Chữ ký không khớp với địa chỉ ví đã kết nối.",
  wallet_already_linked: "Ví này đã được liên kết với một tài khoản khác.",
  wallet_not_linked: "Bạn cần liên kết ví trước khi nhận chứng nhận.",
  quiz_not_passed: "Bạn cần đạt bài kiểm tra trước khi nhận chứng nhận.",
};

export const CONTRACT_ERRORS = {
  // CompleteTracker
  Expired: "Chữ ký chứng nhận đã hết hạn (quá 15 phút). Hãy yêu cầu chữ ký mới.",
  UnknownModule: "Module không tồn tại trên contract.",
  ScoreTooLow: "Điểm chưa đạt mức tối thiểu để ghi on-chain.",
  NonceAlreadyUsed: "Chứng nhận này đã được sử dụng.",
  BadSignature: "Chữ ký của attester không hợp lệ.",
  // SoulboundCertificate
  Soulbound: "Chứng chỉ Soulbound không thể chuyển nhượng hay phê duyệt.",
  AlreadyCertified: "Ví này đã có chứng chỉ.",
  // Ví
  ACTION_REJECTED: "Bạn đã từ chối yêu cầu trong ví.",
  WRONG_NETWORK: "Ví đang ở sai mạng. Hãy chuyển sang đúng mạng.",
  NO_WALLET: "Không tìm thấy ví trình duyệt. Hãy cài MetaMask hoặc Ronin Wallet.",
};

export function getErrorMessage(code) {
  return API_ERRORS[code] ?? CONTRACT_ERRORS[code] ?? "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
