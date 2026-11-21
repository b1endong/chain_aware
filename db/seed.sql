-- =============================================================================
-- ChainAware — Seed data: modules, questions (topic), options
-- -----------------------------------------------------------------------------
-- * modules.id = 0..2 để khớp với CompleteTracker.sol (MODULE_COUNT = 3,
--   moduleId < MODULE_COUNT, bitmask 1 << moduleId).
-- * UUID cố định để seed chạy lại được (idempotent) và dễ viết test:
--     question : 00000000-0000-4000-8000-0000000M QQ 00
--     option   : 00000000-0000-4000-8000-0000000M QQ 0N
--   M = module id (0..2), QQ = số thứ tự câu hỏi (01..10), N = đáp án (1..4).
--   Ví dụ: câu 3 của module 1 = ...-000000010300, đáp án 2 = ...-000000010302
-- * Mỗi câu hỏi có đúng 1 đáp án đúng (được kiểm tra ở cuối file).
-- * File nằm trong ./db nên docker-entrypoint chạy sau schema.sql (thứ tự a-z)
--   ở lần khởi tạo volume đầu tiên. Chạy tay:
--     docker exec -i training-db psql -U app -d training < db/seed.sql
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- MODULES
-- -----------------------------------------------------------------------------
INSERT INTO modules (id, slug, title, body_md, iso27001, soc2) VALUES
(
  0,
  'wallet-security',
  'Bảo mật ví, Private Key & Seed Phrase',
  $md$
# Bảo mật ví, Private Key & Seed Phrase

## Mục tiêu bài học
Sau bài học này bạn sẽ:
- Hiểu mối quan hệ giữa **seed phrase → private key → public key → địa chỉ ví**.
- Biết cách lưu trữ và sao lưu seed phrase đúng cách.
- Phân biệt ví nóng, ví lạnh, ví cứng, multisig/MPC và biết khi nào dùng loại nào.
- Nhận diện các mối đe doạ trên thiết bị: tiện ích trình duyệt độc hại, clipboard hijacker.

## 1. Seed phrase và private key
- **Seed phrase** (12 hoặc 24 từ, chuẩn BIP-39) là "chìa khoá gốc". Từ nó, ví sinh ra toàn bộ private key (BIP-32/BIP-44).
- **Private key** dùng để ký giao dịch. Từ private key suy ra public key, rồi lấy 20 byte cuối của `keccak256(publicKey)` làm **địa chỉ ví**.
- Quá trình này **một chiều**: biết địa chỉ không thể tính ngược ra private key.
- Không có "quên mật khẩu" trên blockchain: **mất seed phrase = mất tài sản**, **lộ seed phrase = mất tài sản**.

> Không một dịch vụ hợp pháp nào (ví, sàn, đội hỗ trợ, admin dự án) yêu cầu bạn cung cấp seed phrase hay private key.

## 2. Lưu trữ & sao lưu
| Nên | Không nên |
|---|---|
| Ghi ra giấy hoặc khắc lên tấm kim loại | Chụp màn hình, lưu thư viện ảnh |
| Cất nơi an toàn, ngoại tuyến | Lưu Google Docs, Notes, email, chat |
| Có bản sao thứ hai ở địa điểm khác | Đồng bộ lên cloud |
| Kiểm tra lại bản sao lưu bằng cách khôi phục thử trên ví mới | Chia nhỏ gửi cho nhiều người qua tin nhắn |

## 3. Các loại ví
- **Ví nóng** (extension, mobile): tiện lợi, luôn online → dùng với số dư nhỏ để tương tác dApp.
- **Ví lạnh / ví cứng**: private key nằm trong chip bảo mật, ký giao dịch bên trong thiết bị. Vẫn phải **đọc kỹ nội dung hiển thị trên màn hình thiết bị** – ví cứng không ngăn bạn ký một giao dịch độc hại.
- **Multisig / MPC**: yêu cầu nhiều người phê duyệt (ví dụ 2/3, 3/5). Bắt buộc với quỹ doanh nghiệp để loại bỏ điểm lỗi duy nhất và đảm bảo phân tách nhiệm vụ.

**Nguyên tắc tách ví:** ví "burner" cho dApp mới / airdrop, ví chính cho tài sản giá trị, ví lạnh cho lưu trữ dài hạn.

## 4. An toàn thiết bị
- Chỉ cài tiện ích trình duyệt từ nguồn chính thức; gỡ tiện ích không dùng.
- **Clipboard hijacker** tự thay địa chỉ bạn vừa copy bằng địa chỉ kẻ gian → luôn đối chiếu **đầu, giữa và cuối** địa chỉ trước khi gửi, ưu tiên sổ địa chỉ đã xác minh.
- Cập nhật hệ điều hành, trình duyệt, firmware ví cứng.
- Mất thiết bị có ví nóng → coi như seed phrase đã lộ: khôi phục trên thiết bị an toàn, **chuyển tài sản sang ví mới với seed phrase mới**, báo cáo sự cố.

## Checklist
- [ ] Seed phrase được lưu ngoại tuyến, có 2 bản ở 2 nơi.
- [ ] Đã khôi phục thử để kiểm tra bản sao lưu.
- [ ] Tài sản chính nằm ở ví lạnh hoặc multisig.
- [ ] Ví dùng cho dApp mới chỉ giữ số dư nhỏ.
- [ ] Đã rà soát và gỡ các tiện ích trình duyệt không cần thiết.

## Liên hệ tiêu chuẩn
| Tiêu chuẩn | Control | Nội dung liên quan |
|---|---|---|
| ISO/IEC 27001:2022 | A.5.17 | Quản lý thông tin xác thực (seed phrase, private key) |
| ISO/IEC 27001:2022 | A.8.5 | Xác thực an toàn (ví cứng, multisig) |
| ISO/IEC 27001:2022 | A.8.24 | Sử dụng mật mã |
| ISO/IEC 27001:2022 | A.8.13 | Sao lưu thông tin |
| ISO/IEC 27001:2022 | A.8.1, A.8.7 | Thiết bị đầu cuối & phòng chống mã độc |
| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |
| SOC 2 | CC6.1 | Kiểm soát truy cập logic, bảo vệ khoá |
| SOC 2 | CC6.8 | Ngăn chặn phần mềm độc hại |
| SOC 2 | CC1.4, CC2.2 | Năng lực & truyền thông trách nhiệm bảo mật |
$md$,
  ARRAY['A.5.17', 'A.6.3', 'A.8.1', 'A.8.5', 'A.8.7', 'A.8.13', 'A.8.24'],
  ARRAY['CC1.4', 'CC2.2', 'CC6.1', 'CC6.8']
),
(
  1,
  'phishing-social-engineering',
  'Nhận diện Phishing & Social Engineering trong Web3',
  $md$
# Nhận diện Phishing & Social Engineering trong Web3

## Mục tiêu bài học
Sau bài học này bạn sẽ:
- Nhận diện website giả mạo, popup ví giả, airdrop lừa đảo.
- Hiểu các chiêu thao túng tâm lý phổ biến (khẩn cấp, sợ hãi, lòng tham, giả danh).
- Biết xử lý và báo cáo sự cố khi lỡ tương tác với kẻ gian.

## 1. Website & popup giả mạo
- **Typosquatting**: tên miền gần giống bản gốc (`chainaware-app.io`, `chainawere.app`).
- **Homoglyph / punycode**: dùng ký tự Unicode trông giống chữ Latin (chữ `і` Cyrillic thay cho `i`).
- **Quảng cáo tìm kiếm** giả mạo thường đứng đầu kết quả.
- **HTTPS (ổ khoá) chỉ mã hoá kết nối**, không chứng minh trang đó là thật.
- **Popup ví giả**: một khung HTML trong trang được vẽ giống hệt cửa sổ ví và yêu cầu nhập seed phrase. Ví thật **không bao giờ** yêu cầu seed phrase để kết nối hay "xác minh".

**Thói quen an toàn:** truy cập dApp qua **bookmark** đã lưu từ nguồn chính thức.

## 2. Social engineering
| Chiêu thức | Dấu hiệu |
|---|---|
| Khẩn cấp / sợ hãi | "Ví của bạn sẽ bị khoá trong 24 giờ" |
| Lòng tham | "Bạn được airdrop 5.000 USDT, claim ngay" |
| Giả danh | Tài khoản trùng tên/avatar admin, DM chủ động "hỗ trợ" |
| Tuyển dụng giả | Yêu cầu tải & chạy "bài test kỹ thuật" (repo, package, file cài đặt) |
| Recovery scam | "Chuyên gia" hứa lấy lại tiền bị mất nếu trả phí trước |

- **Airdrop lạ**: token xuất hiện trong ví kèm link "claim" → ẩn token, không tương tác.
- **Address poisoning**: kẻ gian gửi giao dịch 0 hoặc rất nhỏ từ địa chỉ có đầu/cuối giống địa chỉ bạn hay dùng, để bạn copy nhầm từ lịch sử giao dịch.
- Code lạ từ "nhà tuyển dụng" chỉ chạy trong **máy ảo / sandbox** tách biệt, sau khi đã đọc code.

## 3. Khi đã lỡ tương tác
1. Ngắt kết nối website, ngừng ký thêm bất cứ thứ gì.
2. **Thu hồi (revoke)** các approval vừa cấp.
3. Chuyển tài sản còn lại sang ví an toàn (seed phrase mới nếu nghi lộ khoá).
4. **Báo cáo** đội bảo mật kèm bằng chứng: URL, tx hash, ảnh chụp tin nhắn.
5. Cảnh giác với "hỗ trợ" xuất hiện ngay sau đó – đó thường là lần lừa đảo thứ hai.

## Checklist
- [ ] Truy cập dApp qua bookmark, không qua quảng cáo hay link trong tin nhắn.
- [ ] Không bao giờ nhập seed phrase vào website.
- [ ] Không phản hồi DM tự xưng admin / support.
- [ ] Biết kênh báo cáo sự cố nội bộ.

## Liên hệ tiêu chuẩn
| Tiêu chuẩn | Control | Nội dung liên quan |
|---|---|---|
| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |
| ISO/IEC 27001:2022 | A.5.7 | Thông tin về mối đe doạ (threat intelligence) |
| ISO/IEC 27001:2022 | A.8.23 | Lọc truy cập web |
| ISO/IEC 27001:2022 | A.6.8 | Báo cáo sự kiện ATTT |
| ISO/IEC 27001:2022 | A.5.24, A.5.26 | Lập kế hoạch & ứng phó sự cố |
| SOC 2 | CC1.4, CC2.2 | Năng lực & truyền thông trách nhiệm bảo mật |
| SOC 2 | CC7.2, CC7.3, CC7.4 | Giám sát, đánh giá & ứng phó sự cố |
$md$,
  ARRAY['A.5.7', 'A.5.24', 'A.5.26', 'A.6.3', 'A.6.8', 'A.8.23'],
  ARRAY['CC1.4', 'CC2.2', 'CC7.2', 'CC7.3', 'CC7.4']
),
(
  2,
  'token-approvals-signatures',
  'Token Approval & Chữ ký giao dịch',
  $md$
# Token Approval & Chữ ký giao dịch

## Mục tiêu bài học
Sau bài học này bạn sẽ:
- Hiểu `approve` / `transferFrom` của ERC-20 và `setApprovalForAll` của NFT.
- Nhận ra rủi ro của approval không giới hạn và cách thu hồi.
- Đọc hiểu các loại yêu cầu ký: giao dịch on-chain, `personal_sign`, EIP-712 typed data, `eth_sign`.

## 1. Approval hoạt động thế nào
- `approve(spender, amount)` cho phép `spender` gọi `transferFrom` để rút **tối đa `amount`** token từ ví bạn, **bất cứ lúc nào**, cho tới khi bị thu hồi.
- Approval **không tự hết hạn**. Ngắt kết nối website khỏi ví **không** thu hồi approval.
- `setApprovalForAll(operator, true)` cho phép operator chuyển **toàn bộ NFT** của bộ sưu tập đó.

### Approval không giới hạn
`approve(spender, type(uint256).max)` → nếu spender độc hại hoặc bị hack, nó rút được **toàn bộ** số dư – kể cả token bạn nhận thêm sau này – mà không cần thêm chữ ký nào của bạn.

**Nguyên tắc đặc quyền tối thiểu:** chỉ approve đúng số lượng cần cho giao dịch.

## 2. Thu hồi & rà soát
- Thu hồi = gửi giao dịch `approve(spender, 0)` hoặc dùng công cụ revoke uy tín.
- **Định kỳ rà soát** approval: dApp cũ không còn dùng vẫn giữ quyền; nếu contract đó bị khai thác, token của bạn có thể bị rút.

## 3. Chữ ký off-chain cũng nguy hiểm
| Loại | Ý nghĩa | Rủi ro |
|---|---|---|
| Giao dịch on-chain | Tốn gas, thay đổi trạng thái | Đọc kỹ hàm được gọi (`approve`, `setApprovalForAll`, ...) |
| `personal_sign` | Ký một thông điệp văn bản (đăng nhập SIWE) | Thấp nếu nội dung rõ ràng |
| EIP-712 typed data | Dữ liệu có cấu trúc: domain + message | `Permit` / Permit2 có thể cấp quyền chi tiêu token mà **không tốn gas** |
| `eth_sign` | Ký một hash bất kỳ (blind signing) | Có thể là hash của bất kỳ giao dịch nào → **từ chối** |

Khi gặp EIP-712, kiểm tra: **domain** (name, chainId, verifyingContract), **loại thông điệp** (ví dụ `Permit`), **spender**, **value**, **deadline**.

> ChainAware cũng dùng EIP-712: chứng nhận hoàn thành (`Completion`) gồm learner, moduleId, score, nonce, deadline được attester ký và contract `CompleteTracker` kiểm tra.

## 4. Mô phỏng giao dịch
Tính năng mô phỏng của ví hiển thị trước thay đổi số dư và quyền ("−1.000 CALT", "cấp approval"). Hữu ích nhưng **không đảm bảo 100%** – contract độc hại có thể hành xử khác khi phát hiện môi trường mô phỏng.

## Thực hành (testnet)
1. Gọi `faucet()` trên **ChainAware Lesson Token (CALT)** để nhận 1.000 CALT.
2. `approve` cho contract **ApprovalSink** – contract này cố ý không có hàm di chuyển tài sản.
3. Xem approval trong công cụ rà soát, sau đó **thu hồi** bằng `approve(sink, 0)`.

Bài test `Drainer` trong repo minh hoạ điều kẻ tấn công thật làm được sau một approve không giới hạn: rút sạch số dư chỉ bằng một lệnh `transferFrom`.

## Checklist
- [ ] Không approve unlimited cho dApp mới.
- [ ] Từ chối `setApprovalForAll` khi chỉ "mint" hoặc "claim".
- [ ] Từ chối mọi yêu cầu `eth_sign` / blind signing.
- [ ] Rà soát approval ít nhất mỗi tháng.

## Liên hệ tiêu chuẩn
| Tiêu chuẩn | Control | Nội dung liên quan |
|---|---|---|
| ISO/IEC 27001:2022 | A.5.15 | Kiểm soát truy cập – đặc quyền tối thiểu |
| ISO/IEC 27001:2022 | A.5.18 | Quyền truy cập – cấp, rà soát, thu hồi |
| ISO/IEC 27001:2022 | A.8.2 | Quyền truy cập đặc quyền |
| ISO/IEC 27001:2022 | A.8.24 | Sử dụng mật mã (chữ ký số) |
| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |
| SOC 2 | CC6.1, CC6.2, CC6.3 | Cấp, điều chỉnh, thu hồi quyền truy cập |
$md$,
  ARRAY['A.5.15', 'A.5.18', 'A.6.3', 'A.8.2', 'A.8.24'],
  ARRAY['CC6.1', 'CC6.2', 'CC6.3']
)
ON CONFLICT (id) DO UPDATE SET
  slug     = EXCLUDED.slug,
  title    = EXCLUDED.title,
  body_md  = EXCLUDED.body_md,
  iso27001 = EXCLUDED.iso27001,
  soc2     = EXCLUDED.soc2;

-- -----------------------------------------------------------------------------
-- QUESTIONS
-- topic dùng cho thống kê theo chủ đề (scoring trả về topic của từng câu)
--   Module 0: seed-phrase, private-key, wallet-types, device-security, backup-recovery
--   Module 1: fake-website, social-engineering, airdrop-scam, impersonation, incident-response
--   Module 2: token-approval, unlimited-approval, revoke, signature-types, transaction-simulation
-- -----------------------------------------------------------------------------
INSERT INTO questions (id, module_id, topic, prompt, explanation) VALUES
-- ===== Module 0: Bảo mật ví =====
('00000000-0000-4000-8000-000000000100', 0, 'seed-phrase',
 'Seed phrase (cụm 12 hoặc 24 từ khôi phục) cho phép làm gì?',
 'Seed phrase sinh ra toàn bộ private key của ví (BIP-39/BIP-32). Ai nắm seed phrase có toàn quyền với mọi tài sản của ví, trên bất kỳ thiết bị nào – mật khẩu ứng dụng ví chỉ bảo vệ dữ liệu trên một thiết bị.'),
('00000000-0000-4000-8000-000000000200', 0, 'seed-phrase',
 'Cách lưu trữ seed phrase nào an toàn nhất?',
 'Seed phrase phải được lưu ngoại tuyến, không đồng bộ lên cloud hay ứng dụng nhắn tin. Bản sao vật lý thứ hai ở địa điểm khác giúp phòng mất mát do cháy, ngập hoặc thất lạc.'),
('00000000-0000-4000-8000-000000000300', 0, 'seed-phrase',
 'Một "nhân viên hỗ trợ" của ví nhắn tin yêu cầu bạn cung cấp seed phrase để "đồng bộ lại ví". Bạn nên làm gì?',
 'Không dịch vụ hợp pháp nào yêu cầu seed phrase. Gửi một phần seed phrase cũng nguy hiểm vì làm giảm mạnh số khả năng kẻ gian phải dò. Hãy từ chối và báo cáo tài khoản giả mạo.'),
('00000000-0000-4000-8000-000000000400', 0, 'private-key',
 'Quan hệ giữa private key và địa chỉ ví là gì?',
 'Public key được suy ra từ private key (ECDSA secp256k1), địa chỉ là 20 byte cuối của keccak256(public key). Đây là hàm một chiều: không thể tính ngược private key từ địa chỉ, và cũng không ai "cấp lại" được private key khi bạn làm mất.'),
('00000000-0000-4000-8000-000000000500', 0, 'wallet-types',
 'Ví cứng (hardware wallet) bảo vệ bạn chủ yếu bằng cách nào?',
 'Ví cứng giữ private key trong chip bảo mật và ký giao dịch ngay bên trong thiết bị, nên khoá không bị lộ dù máy tính nhiễm mã độc. Tuy nhiên nó không ngăn bạn ký một giao dịch độc hại – vẫn phải đọc kỹ nội dung hiển thị trên màn hình thiết bị.'),
('00000000-0000-4000-8000-000000000600', 0, 'wallet-types',
 'Doanh nghiệp quản lý quỹ lớn trên blockchain nên dùng cơ chế nào để tránh "điểm lỗi duy nhất"?',
 'Multisig hoặc MPC yêu cầu nhiều người phê duyệt (ví dụ 2/3, 3/5), đảm bảo phân tách nhiệm vụ: một người bị lừa, bị mất thiết bị hay có ý đồ xấu cũng không thể tự mình chuyển quỹ.'),
('00000000-0000-4000-8000-000000000700', 0, 'wallet-types',
 'Nguyên tắc tách ví nào sau đây là hợp lý?',
 'Tách ví giúp giới hạn thiệt hại: nếu ví dùng để thử dApp mới bị lừa, chỉ mất số dư nhỏ trong ví đó. Tài sản chính nằm ở ví lạnh và hạn chế ký các giao dịch lạ.'),
('00000000-0000-4000-8000-000000000800', 0, 'device-security',
 'Bạn cài một tiện ích trình duyệt "tối ưu phí gas" từ nguồn không rõ. Rủi ro lớn nhất là gì?',
 'Tiện ích trình duyệt có quyền đọc và sửa nội dung trang web, có thể tráo địa chỉ nhận, chèn yêu cầu ký độc hại hoặc đánh cắp dữ liệu. Chỉ cài tiện ích từ nguồn chính thức và gỡ những tiện ích không dùng.'),
('00000000-0000-4000-8000-000000000900', 0, 'device-security',
 'Clipboard hijacker (mã độc theo dõi clipboard) gây hại thế nào và phòng tránh ra sao?',
 'Mã độc này thay địa chỉ bạn vừa copy bằng địa chỉ của kẻ gian, thậm chí có đầu/cuối giống hệt. Hãy đối chiếu cả phần đầu, giữa và cuối địa chỉ trước khi gửi, và ưu tiên dùng sổ địa chỉ đã xác minh.'),
('00000000-0000-4000-8000-000000001000', 0, 'backup-recovery',
 'Bạn làm mất điện thoại có cài ví nóng (seed phrase đã được sao lưu an toàn). Bước ưu tiên là gì?',
 'Thiết bị bị mất phải coi như khoá có thể đã lộ. Khôi phục ví trên thiết bị an toàn, chuyển tài sản sang ví mới với seed phrase mới và báo cáo sự cố. Đổi mật khẩu ứng dụng không giúp gì, và blockchain không có cơ chế "đóng băng" địa chỉ.'),

-- ===== Module 1: Phishing & Social Engineering =====
('00000000-0000-4000-8000-000000010100', 1, 'fake-website',
 'Dấu hiệu nào cho thấy một trang web có thể đang giả mạo dApp?',
 'Typosquatting (chainawere.app) và ký tự Unicode trông giống chữ Latin (homoglyph) là dấu hiệu điển hình. HTTPS chỉ mã hoá kết nối, không chứng minh trang là thật; logo và nút "Connect Wallet" thì ai cũng sao chép được.'),
('00000000-0000-4000-8000-000000010200', 1, 'fake-website',
 'Cách an toàn nhất để truy cập một dApp bạn dùng thường xuyên là gì?',
 'Bookmark được lưu từ nguồn chính thức loại bỏ rủi ro gõ nhầm tên miền, quảng cáo tìm kiếm giả mạo và link độc hại trong tin nhắn hay bình luận.'),
('00000000-0000-4000-8000-000000010300', 1, 'airdrop-scam',
 'Ví của bạn bỗng nhận được một token lạ kèm website "claim phần thưởng". Bạn nên làm gì?',
 'Token airdrop lạ thường là mồi nhử: website claim sẽ yêu cầu approve hoặc ký permit để rút tài sản, và việc bán token đó cũng có thể đòi một approval độc hại. Hãy ẩn token và không tương tác.'),
('00000000-0000-4000-8000-000000010400', 1, 'social-engineering',
 'Yếu tố tâm lý nào được kẻ tấn công lợi dụng nhiều nhất trong phishing?',
 'Tạo cảm giác khẩn cấp hoặc sợ hãi khiến nạn nhân hành động vội, bỏ qua bước kiểm tra. Bất kỳ thông điệp nào ép bạn hành động ngay đều đáng nghi.'),
('00000000-0000-4000-8000-000000010500', 1, 'impersonation',
 'Trong Discord của dự án, một tài khoản có tên và avatar giống admin nhắn riêng mời bạn vào "whitelist". Điều nào đúng?',
 'Tên hiển thị và avatar sao chép rất dễ. Các dự án uy tín thường thông báo rằng đội ngũ không bao giờ nhắn riêng trước. Chỉ tin thông tin trên kênh thông báo chính thức.'),
('00000000-0000-4000-8000-000000010600', 1, 'social-engineering',
 'Bạn nhận lời mời làm việc từ một "công ty Web3" và được yêu cầu tải về, chạy một repo "bài test kỹ thuật". Rủi ro chính là gì?',
 'Tuyển dụng giả là chiêu phổ biến để phát tán mã độc đánh cắp ví, khoá SSH và cookie trình duyệt (ví dụ qua script postinstall của npm). Chỉ chạy code lạ trong máy ảo hoặc sandbox tách biệt, sau khi đã đọc code.'),
('00000000-0000-4000-8000-000000010700', 1, 'fake-website',
 'Một trang web hiện cửa sổ giống hệt popup ví, yêu cầu nhập seed phrase để "xác minh ví". Đây là gì?',
 'Ví thật không bao giờ yêu cầu nhập seed phrase để kết nối hay xác minh. Popup đó thường chỉ là HTML được vẽ bên trong trang để đánh cắp seed phrase.'),
('00000000-0000-4000-8000-000000010800', 1, 'impersonation',
 'Address poisoning là gì?',
 'Kẻ gian tạo địa chỉ có phần đầu/cuối giống địa chỉ bạn hay giao dịch, rồi gửi giao dịch 0 hoặc rất nhỏ để nó xuất hiện trong lịch sử. Nạn nhân copy nhầm từ lịch sử và gửi tiền cho kẻ gian.'),
('00000000-0000-4000-8000-000000010900', 1, 'incident-response',
 'Bạn lỡ ký một giao dịch trên trang nghi là phishing. Cách xử lý hợp lý nhất là gì?',
 'Cần cô lập nhanh: ngắt kết nối, thu hồi approval, chuyển tài sản còn lại sang ví an toàn, rồi báo cáo đội bảo mật kèm bằng chứng (URL, tx hash). Giữ im lặng làm chậm phản ứng của tổ chức; "hỗ trợ" trong bình luận thường là lừa đảo tiếp.'),
('00000000-0000-4000-8000-000000011000', 1, 'incident-response',
 'Sau khi bị lừa, có người tự xưng "chuyên gia khôi phục tài sản crypto" cam kết lấy lại tiền nếu bạn trả phí trước. Đây là gì?',
 'Recovery scam nhắm vào người vừa bị lừa. Giao dịch trên blockchain không thể đảo ngược bằng "dịch vụ" trả phí trước. Chỉ làm việc với cơ quan chức năng và đội bảo mật chính thức.'),

-- ===== Module 2: Token Approval & Chữ ký =====
('00000000-0000-4000-8000-000000020100', 2, 'token-approval',
 'Khi gọi approve(spender, amount) trên một token ERC-20, bạn đang làm gì?',
 'approve không chuyển token ngay mà cấp cho spender quyền gọi transferFrom để rút tối đa amount token từ ví bạn, bất cứ lúc nào, cho tới khi quyền bị thu hồi.'),
('00000000-0000-4000-8000-000000020200', 2, 'unlimited-approval',
 'Vì sao approve với số lượng type(uint256).max (không giới hạn) là rủi ro?',
 'Với approval không giới hạn, nếu spender độc hại hoặc bị hack, nó rút được toàn bộ số dư token đó – kể cả token nhận thêm sau này – mà không cần thêm chữ ký nào. Bài test Drainer trong ChainAware minh hoạ đúng kịch bản này.'),
('00000000-0000-4000-8000-000000020300', 2, 'unlimited-approval',
 'Một dApp hoán đổi token yêu cầu approve. Lựa chọn tốt nhất là gì?',
 'Theo nguyên tắc đặc quyền tối thiểu, chỉ approve đúng số lượng cần cho giao dịch. Tốn thêm một ít phí gas cho lần sau rẻ hơn nhiều so với rủi ro mất toàn bộ số dư.'),
('00000000-0000-4000-8000-000000020400', 2, 'revoke',
 'Cách nào thực sự thu hồi (revoke) một approval ERC-20?',
 'Approval được lưu on-chain trong contract token, nên phải gửi giao dịch approve(spender, 0) (hoặc dùng công cụ revoke uy tín). Ẩn token hay ngắt kết nối website trong ví không thay đổi trạng thái on-chain.'),
('00000000-0000-4000-8000-000000020500', 2, 'revoke',
 'Vì sao nên định kỳ rà soát danh sách approval của ví?',
 'Approval không tự hết hạn. dApp bạn đã ngừng dùng vẫn giữ quyền; nếu contract đó bị khai thác, token của bạn có thể bị rút. Rà soát định kỳ tương đương việc review quyền truy cập trong ISO 27001 A.5.18.'),
('00000000-0000-4000-8000-000000020600', 2, 'signature-types',
 'Vì sao một chữ ký off-chain (không tốn gas) vẫn có thể làm bạn mất tài sản?',
 'Chữ ký EIP-2612 Permit hoặc Permit2 là một approval dạng chữ ký. Kẻ gian đem chữ ký đó lên chuỗi gọi permit rồi transferFrom để rút token – bạn không hề gửi giao dịch nào.'),
('00000000-0000-4000-8000-000000020700', 2, 'signature-types',
 'Khi ví hiển thị yêu cầu ký dữ liệu EIP-712 (typed data), bạn cần kiểm tra những gì?',
 'EIP-712 hiển thị dữ liệu có cấu trúc nên bạn có thể đọc được: domain (name, chainId, verifyingContract) cho biết contract nào sẽ dùng chữ ký; loại thông điệp, spender, value và deadline cho biết bạn đang cấp quyền gì.'),
('00000000-0000-4000-8000-000000020800', 2, 'signature-types',
 'Yêu cầu ký eth_sign với một chuỗi hex khó đọc (blind signing) nguy hiểm vì sao?',
 'eth_sign ký một hash tuỳ ý, có thể là hash của bất kỳ giao dịch nào, chẳng hạn chuyển toàn bộ tài sản. Bạn không thể biết mình đang ký gì, nên hãy từ chối. Nhiều ví đã tắt eth_sign theo mặc định.'),
('00000000-0000-4000-8000-000000020900', 2, 'token-approval',
 'Khi bạn bấm "mint miễn phí" một NFT, ví hiển thị yêu cầu setApprovalForAll. Điều này có nghĩa gì?',
 'setApprovalForAll cấp cho operator quyền chuyển TOÀN BỘ NFT của bạn trong bộ sưu tập đó. Việc mint không cần quyền này, nên đây là dấu hiệu lừa đảo rõ ràng.'),
('00000000-0000-4000-8000-000000021000', 2, 'transaction-simulation',
 'Tính năng mô phỏng giao dịch (transaction simulation) trong ví giúp gì?',
 'Mô phỏng cho thấy trước thay đổi số dư và quyền để bạn phát hiện bất thường. Tuy nhiên contract độc hại có thể hành xử khác khi phát hiện môi trường mô phỏng, nên đây chỉ là một lớp phòng thủ bổ sung.')
ON CONFLICT (id) DO UPDATE SET
  module_id   = EXCLUDED.module_id,
  topic       = EXCLUDED.topic,
  prompt      = EXCLUDED.prompt,
  explanation = EXCLUDED.explanation;

-- -----------------------------------------------------------------------------
-- OPTIONS (4 đáp án / câu, đúng 1 đáp án is_correct = true, vị trí xáo trộn)
-- -----------------------------------------------------------------------------
INSERT INTO options (id, question_id, label, is_correct) VALUES
-- ----- Module 0 -----
-- M0 Q01
('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000100', 'Chỉ dùng để mở khoá ứng dụng ví trên thiết bị hiện tại', false),
('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000100', 'Khôi phục toàn bộ ví và mọi tài sản trên bất kỳ thiết bị nào', true),
('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000100', 'Đổi mật khẩu của ứng dụng ví', false),
('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000100', 'Xem lịch sử giao dịch nhưng không thể chuyển tài sản', false),
-- M0 Q02
('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000200', 'Chụp màn hình và lưu trong thư viện ảnh có đồng bộ cloud', false),
('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000200', 'Lưu trong Google Docs hoặc ứng dụng ghi chú có đặt mật khẩu', false),
('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000200', 'Ghi ra giấy hoặc khắc lên kim loại, cất ngoại tuyến và có bản sao ở địa điểm thứ hai', true),
('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000200', 'Gửi email cho chính mình để không bao giờ bị mất', false),
-- M0 Q03
('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000300', 'Cung cấp, vì đó là nhân viên hỗ trợ chính thức', false),
('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000300', 'Chỉ gửi 6 từ đầu tiên để họ xác minh', false),
('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000300', 'Nhập seed phrase vào đường link họ gửi thay vì gửi qua tin nhắn', false),
('00000000-0000-4000-8000-000000000304', '00000000-0000-4000-8000-000000000300', 'Từ chối, không chia sẻ seed phrase với bất kỳ ai và báo cáo tài khoản giả mạo', true),
-- M0 Q04
('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000400', 'Địa chỉ suy ra từ public key, public key suy ra từ private key; không thể tính ngược lại', true),
('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000400', 'Có thể tính ngược private key từ địa chỉ nếu có đủ nhiều giao dịch', false),
('00000000-0000-4000-8000-000000000403', '00000000-0000-4000-8000-000000000400', 'Private key và địa chỉ là hai tên gọi của cùng một chuỗi ký tự', false),
('00000000-0000-4000-8000-000000000404', '00000000-0000-4000-8000-000000000400', 'Private key do blockchain cấp và có thể yêu cầu cấp lại khi bị mất', false),
-- M0 Q05
('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000500', 'Mã hoá lịch sử giao dịch để không ai xem được trên blockchain', false),
('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000500', 'Tự động hoàn tiền nếu bạn bị lừa', false),
('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000500', 'Giữ private key trong chip bảo mật và ký giao dịch bên trong thiết bị, khoá không rời khỏi thiết bị', true),
('00000000-0000-4000-8000-000000000504', '00000000-0000-4000-8000-000000000500', 'Tự động chặn mọi smart contract độc hại', false),
-- M0 Q06
('00000000-0000-4000-8000-000000000601', '00000000-0000-4000-8000-000000000600', 'Một ví nóng do kế toán trưởng giữ', false),
('00000000-0000-4000-8000-000000000602', '00000000-0000-4000-8000-000000000600', 'Chia sẻ chung một private key cho cả phòng tài chính', false),
('00000000-0000-4000-8000-000000000603', '00000000-0000-4000-8000-000000000600', 'Lưu private key trong biến môi trường của server', false),
('00000000-0000-4000-8000-000000000604', '00000000-0000-4000-8000-000000000600', 'Ví đa chữ ký (multisig) hoặc MPC yêu cầu nhiều người phê duyệt, ví dụ 2/3 hoặc 3/5', true),
-- M0 Q07
('00000000-0000-4000-8000-000000000701', '00000000-0000-4000-8000-000000000700', 'Dùng một ví duy nhất cho mọi việc để dễ quản lý', false),
('00000000-0000-4000-8000-000000000702', '00000000-0000-4000-8000-000000000700', 'Ví nóng số dư nhỏ để thử dApp mới; ví lạnh giữ tài sản chính và hạn chế ký giao dịch lạ', true),
('00000000-0000-4000-8000-000000000703', '00000000-0000-4000-8000-000000000700', 'Dùng ví lạnh để săn airdrop, ví nóng để giữ tài sản chính', false),
('00000000-0000-4000-8000-000000000704', '00000000-0000-4000-8000-000000000700', 'Tạo nhiều ví từ cùng một seed phrase rồi chia sẻ seed cho người thân giữ hộ', false),
-- M0 Q08
('00000000-0000-4000-8000-000000000801', '00000000-0000-4000-8000-000000000800', 'Trình duyệt chạy chậm hơn', false),
('00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000800', 'Tiện ích có thể đọc và sửa nội dung trang, tráo địa chỉ nhận hoặc đánh cắp dữ liệu ví', true),
('00000000-0000-4000-8000-000000000803', '00000000-0000-4000-8000-000000000800', 'Phí gas sẽ tăng gấp đôi', false),
('00000000-0000-4000-8000-000000000804', '00000000-0000-4000-8000-000000000800', 'Không có rủi ro vì ví đã có mật khẩu', false),
-- M0 Q09
('00000000-0000-4000-8000-000000000901', '00000000-0000-4000-8000-000000000900', 'Nó xoá ví; phòng tránh bằng cách đổi mật khẩu ví thường xuyên', false),
('00000000-0000-4000-8000-000000000902', '00000000-0000-4000-8000-000000000900', 'Nó chỉ ảnh hưởng văn bản thông thường, không ảnh hưởng địa chỉ ví', false),
('00000000-0000-4000-8000-000000000903', '00000000-0000-4000-8000-000000000900', 'Nó thay địa chỉ vừa copy bằng địa chỉ kẻ gian; đối chiếu đầu, giữa, cuối địa chỉ và dùng sổ địa chỉ đã xác minh', true),
('00000000-0000-4000-8000-000000000904', '00000000-0000-4000-8000-000000000900', 'Nó chỉ hoạt động trên điện thoại nên dùng máy tính là an toàn', false),
-- M0 Q10
('00000000-0000-4000-8000-000000001001', '00000000-0000-4000-8000-000000001000', 'Chờ xem có giao dịch lạ không rồi mới xử lý', false),
('00000000-0000-4000-8000-000000001002', '00000000-0000-4000-8000-000000001000', 'Chỉ cần đổi mật khẩu mở khoá ứng dụng ví trên thiết bị mới', false),
('00000000-0000-4000-8000-000000001003', '00000000-0000-4000-8000-000000001000', 'Liên hệ blockchain để đóng băng địa chỉ ví', false),
('00000000-0000-4000-8000-000000001004', '00000000-0000-4000-8000-000000001000', 'Khôi phục ví trên thiết bị an toàn, chuyển tài sản sang ví mới với seed phrase mới và báo cáo sự cố', true),

-- ----- Module 1 -----
-- M1 Q01
('00000000-0000-4000-8000-000000010101', '00000000-0000-4000-8000-000000010100', 'Trang có biểu tượng ổ khoá HTTPS', false),
('00000000-0000-4000-8000-000000010102', '00000000-0000-4000-8000-000000010100', 'Tên miền gần giống bản gốc (chainawere.app) hoặc chứa ký tự Unicode trông giống chữ Latin', true),
('00000000-0000-4000-8000-000000010103', '00000000-0000-4000-8000-000000010100', 'Trang có nút "Connect Wallet"', false),
('00000000-0000-4000-8000-000000010104', '00000000-0000-4000-8000-000000010100', 'Trang hiển thị đúng logo của dự án', false),
-- M1 Q02
('00000000-0000-4000-8000-000000010201', '00000000-0000-4000-8000-000000010200', 'Bấm vào quảng cáo đầu tiên trên kết quả tìm kiếm', false),
('00000000-0000-4000-8000-000000010202', '00000000-0000-4000-8000-000000010200', 'Bấm link trong tin nhắn Telegram từ "admin" dự án', false),
('00000000-0000-4000-8000-000000010203', '00000000-0000-4000-8000-000000010200', 'Dùng bookmark đã lưu từ nguồn chính thức', true),
('00000000-0000-4000-8000-000000010204', '00000000-0000-4000-8000-000000010200', 'Bấm link trong phần bình luận dưới bài đăng của dự án', false),
-- M1 Q03
('00000000-0000-4000-8000-000000010301', '00000000-0000-4000-8000-000000010300', 'Truy cập website để claim trước khi hết hạn', false),
('00000000-0000-4000-8000-000000010302', '00000000-0000-4000-8000-000000010300', 'Bán ngay token đó trên một sàn DEX', false),
('00000000-0000-4000-8000-000000010303', '00000000-0000-4000-8000-000000010300', 'Chuyển token cho bạn bè nhờ kiểm tra hộ', false),
('00000000-0000-4000-8000-000000010304', '00000000-0000-4000-8000-000000010300', 'Ẩn token, không truy cập website hay tương tác với contract của nó', true),
-- M1 Q04
('00000000-0000-4000-8000-000000010401', '00000000-0000-4000-8000-000000010400', 'Tạo cảm giác khẩn cấp hoặc sợ hãi, ví dụ "Ví của bạn sẽ bị khoá trong 24 giờ"', true),
('00000000-0000-4000-8000-000000010402', '00000000-0000-4000-8000-000000010400', 'Cung cấp thông tin kỹ thuật chi tiết và chính xác', false),
('00000000-0000-4000-8000-000000010403', '00000000-0000-4000-8000-000000010400', 'Khuyên bạn dành thời gian kiểm tra kỹ trước khi làm', false),
('00000000-0000-4000-8000-000000010404', '00000000-0000-4000-8000-000000010400', 'Hướng dẫn bạn liên hệ qua kênh hỗ trợ chính thức', false),
-- M1 Q05
('00000000-0000-4000-8000-000000010501', '00000000-0000-4000-8000-000000010500', 'Admin thật thường chủ động nhắn riêng để hỗ trợ thành viên', false),
('00000000-0000-4000-8000-000000010502', '00000000-0000-4000-8000-000000010500', 'Tài khoản có cùng avatar và tên với admin thì chắc chắn là thật', false),
('00000000-0000-4000-8000-000000010503', '00000000-0000-4000-8000-000000010500', 'Tên và avatar rất dễ sao chép; hãy xác minh qua kênh thông báo chính thức, đội ngũ uy tín không nhắn riêng trước', true),
('00000000-0000-4000-8000-000000010504', '00000000-0000-4000-8000-000000010500', 'Làm theo ngay vì whitelist có giới hạn thời gian', false),
-- M1 Q06
('00000000-0000-4000-8000-000000010601', '00000000-0000-4000-8000-000000010600', 'Không có rủi ro vì đó chỉ là source code', false),
('00000000-0000-4000-8000-000000010602', '00000000-0000-4000-8000-000000010600', 'Chỉ mất thời gian làm bài', false),
('00000000-0000-4000-8000-000000010603', '00000000-0000-4000-8000-000000010600', 'Rủi ro chỉ tồn tại nếu bạn dùng Windows', false),
('00000000-0000-4000-8000-000000010604', '00000000-0000-4000-8000-000000010600', 'Repo có thể chứa mã độc đánh cắp ví, khoá SSH, cookie; chỉ chạy trong máy ảo/sandbox tách biệt sau khi đọc code', true),
-- M1 Q07
('00000000-0000-4000-8000-000000010701', '00000000-0000-4000-8000-000000010700', 'Phishing: ví thật không bao giờ yêu cầu seed phrase để kết nối hay xác minh', true),
('00000000-0000-4000-8000-000000010702', '00000000-0000-4000-8000-000000010700', 'Một tính năng bảo mật mới của ví', false),
('00000000-0000-4000-8000-000000010703', '00000000-0000-4000-8000-000000010700', 'Bình thường nếu trang web dùng HTTPS', false),
('00000000-0000-4000-8000-000000010704', '00000000-0000-4000-8000-000000010700', 'Chỉ nguy hiểm nếu bạn đang dùng ví cứng', false),
-- M1 Q08
('00000000-0000-4000-8000-000000010801', '00000000-0000-4000-8000-000000010800', 'Kẻ gian làm hỏng địa chỉ ví khiến bạn không nhận được tiền', false),
('00000000-0000-4000-8000-000000010802', '00000000-0000-4000-8000-000000010800', 'Kẻ gian gửi giao dịch nhỏ từ địa chỉ có đầu/cuối giống địa chỉ quen thuộc để bạn copy nhầm từ lịch sử', true),
('00000000-0000-4000-8000-000000010803', '00000000-0000-4000-8000-000000010800', 'Lỗi của blockchain khiến hai địa chỉ bị trùng nhau', false),
('00000000-0000-4000-8000-000000010804', '00000000-0000-4000-8000-000000010800', 'Một loại virus lây nhiễm vào ví cứng', false),
-- M1 Q09
('00000000-0000-4000-8000-000000010901', '00000000-0000-4000-8000-000000010900', 'Xoá lịch sử trình duyệt và không nói với ai', false),
('00000000-0000-4000-8000-000000010902', '00000000-0000-4000-8000-000000010900', 'Gửi thêm tiền vào ví để "giữ" tài khoản', false),
('00000000-0000-4000-8000-000000010903', '00000000-0000-4000-8000-000000010900', 'Ngắt kết nối, thu hồi approval, chuyển tài sản còn lại sang ví an toàn và báo cáo đội bảo mật kèm URL, tx hash', true),
('00000000-0000-4000-8000-000000010904', '00000000-0000-4000-8000-000000010900', 'Nhắn cho tài khoản "hỗ trợ" xuất hiện trong phần bình luận để lấy lại tiền', false),
-- M1 Q10
('00000000-0000-4000-8000-000000011001', '00000000-0000-4000-8000-000000011000', 'Dịch vụ hợp pháp, nên dùng ngay trước khi tiền bị chuyển đi xa', false),
('00000000-0000-4000-8000-000000011002', '00000000-0000-4000-8000-000000011000', 'An toàn nếu tài khoản đó có nhiều người theo dõi', false),
('00000000-0000-4000-8000-000000011003', '00000000-0000-4000-8000-000000011000', 'Recovery scam nhắm vào nạn nhân; chỉ làm việc với cơ quan chức năng và đội bảo mật chính thức', true),
('00000000-0000-4000-8000-000000011004', '00000000-0000-4000-8000-000000011000', 'Cách duy nhất vì giao dịch blockchain không thể truy vết', false),

-- ----- Module 2 -----
-- M2 Q01
('00000000-0000-4000-8000-000000020101', '00000000-0000-4000-8000-000000020100', 'Chuyển ngay amount token cho spender', false),
('00000000-0000-4000-8000-000000020102', '00000000-0000-4000-8000-000000020100', 'Xác minh danh tính của spender', false),
('00000000-0000-4000-8000-000000020103', '00000000-0000-4000-8000-000000020100', 'Cho phép spender gọi transferFrom để rút tối đa amount token bất cứ lúc nào, cho tới khi bị thu hồi', true),
('00000000-0000-4000-8000-000000020104', '00000000-0000-4000-8000-000000020100', 'Khoá token trong ví để không ai dùng được', false),
-- M2 Q02
('00000000-0000-4000-8000-000000020201', '00000000-0000-4000-8000-000000020200', 'Spender độc hại hoặc bị hack có thể rút toàn bộ số dư, kể cả token nhận sau này, mà không cần thêm chữ ký', true),
('00000000-0000-4000-8000-000000020202', '00000000-0000-4000-8000-000000020200', 'Tốn phí gas nhiều hơn đáng kể', false),
('00000000-0000-4000-8000-000000020203', '00000000-0000-4000-8000-000000020200', 'Token sẽ bị đốt sau khi approve', false),
('00000000-0000-4000-8000-000000020204', '00000000-0000-4000-8000-000000020200', 'Không rủi ro vì approval tự hết hạn sau 24 giờ', false),
-- M2 Q03
('00000000-0000-4000-8000-000000020301', '00000000-0000-4000-8000-000000020300', 'Luôn chọn unlimited để tiết kiệm phí cho những lần sau', false),
('00000000-0000-4000-8000-000000020302', '00000000-0000-4000-8000-000000020300', 'Approve một lần cho mọi token trong ví', false),
('00000000-0000-4000-8000-000000020303', '00000000-0000-4000-8000-000000020300', 'Từ chối mọi dApp vì approve luôn là lừa đảo', false),
('00000000-0000-4000-8000-000000020304', '00000000-0000-4000-8000-000000020300', 'Chỉnh số lượng approve bằng đúng số token cần cho giao dịch', true),
-- M2 Q04
('00000000-0000-4000-8000-000000020401', '00000000-0000-4000-8000-000000020400', 'Ẩn token khỏi danh sách hiển thị trong ví', false),
('00000000-0000-4000-8000-000000020402', '00000000-0000-4000-8000-000000020400', 'Gửi giao dịch approve(spender, 0) hoặc dùng công cụ revoke uy tín', true),
('00000000-0000-4000-8000-000000020403', '00000000-0000-4000-8000-000000020400', 'Ngắt kết nối (disconnect) website trong cài đặt ví', false),
('00000000-0000-4000-8000-000000020404', '00000000-0000-4000-8000-000000020400', 'Đổi mật khẩu mở khoá ví', false),
-- M2 Q05
('00000000-0000-4000-8000-000000020501', '00000000-0000-4000-8000-000000020500', 'Vì approval làm giảm số dư token theo thời gian', false),
('00000000-0000-4000-8000-000000020502', '00000000-0000-4000-8000-000000020500', 'Để giao dịch được xác nhận nhanh hơn', false),
('00000000-0000-4000-8000-000000020503', '00000000-0000-4000-8000-000000020500', 'Approval cũ vẫn còn hiệu lực; nếu contract đó bị khai thác, token của bạn có thể bị rút', true),
('00000000-0000-4000-8000-000000020504', '00000000-0000-4000-8000-000000020500', 'Vì spender của approval tự thay đổi theo thời gian', false),
-- M2 Q06
('00000000-0000-4000-8000-000000020601', '00000000-0000-4000-8000-000000020600', 'Không thể – chỉ giao dịch on-chain mới nguy hiểm', false),
('00000000-0000-4000-8000-000000020602', '00000000-0000-4000-8000-000000020600', 'Vì việc ký tốn một khoản phí ẩn', false),
('00000000-0000-4000-8000-000000020603', '00000000-0000-4000-8000-000000020600', 'Vì chữ ký làm lộ private key', false),
('00000000-0000-4000-8000-000000020604', '00000000-0000-4000-8000-000000020600', 'Chữ ký Permit/Permit2 cấp quyền chi tiêu token; kẻ gian đem lên chuỗi gọi permit rồi transferFrom', true),
-- M2 Q07
('00000000-0000-4000-8000-000000020701', '00000000-0000-4000-8000-000000020700', 'Domain (name, chainId, verifyingContract), loại thông điệp, spender, value và deadline', true),
('00000000-0000-4000-8000-000000020702', '00000000-0000-4000-8000-000000020700', 'Chỉ cần xem tên website đang yêu cầu', false),
('00000000-0000-4000-8000-000000020703', '00000000-0000-4000-8000-000000020700', 'Không cần kiểm tra vì EIP-712 luôn an toàn', false),
('00000000-0000-4000-8000-000000020704', '00000000-0000-4000-8000-000000020700', 'Chỉ cần kiểm tra phí gas', false),
-- M2 Q08
('00000000-0000-4000-8000-000000020801', '00000000-0000-4000-8000-000000020800', 'eth_sign tốn nhiều gas hơn các loại chữ ký khác', false),
('00000000-0000-4000-8000-000000020802', '00000000-0000-4000-8000-000000020800', 'Chuỗi đó có thể là hash của bất kỳ giao dịch nào, ví dụ chuyển toàn bộ tài sản; bạn không biết mình đang ký gì', true),
('00000000-0000-4000-8000-000000020803', '00000000-0000-4000-8000-000000020800', 'Nó sẽ tạo một ví mới thay cho ví hiện tại', false),
('00000000-0000-4000-8000-000000020804', '00000000-0000-4000-8000-000000020800', 'Không nguy hiểm vì eth_sign chỉ dùng để đăng nhập', false),
-- M2 Q09
('00000000-0000-4000-8000-000000020901', '00000000-0000-4000-8000-000000020900', 'Bình thường, mọi lần mint đều cần quyền này', false),
('00000000-0000-4000-8000-000000020902', '00000000-0000-4000-8000-000000020900', 'Chỉ cho phép xem NFT trong ví', false),
('00000000-0000-4000-8000-000000020903', '00000000-0000-4000-8000-000000020900', 'Bạn cấp quyền chuyển TOÀN BỘ NFT trong bộ sưu tập; mint không cần quyền này nên hãy từ chối', true),
('00000000-0000-4000-8000-000000020904', '00000000-0000-4000-8000-000000020900', 'Chỉ áp dụng cho NFT sắp được mint', false),
-- M2 Q10
('00000000-0000-4000-8000-000000021001', '00000000-0000-4000-8000-000000021000', 'Đảm bảo 100% giao dịch an toàn', false),
('00000000-0000-4000-8000-000000021002', '00000000-0000-4000-8000-000000021000', 'Hoàn tiền nếu giao dịch thất bại', false),
('00000000-0000-4000-8000-000000021003', '00000000-0000-4000-8000-000000021000', 'Giảm phí gas cho giao dịch', false),
('00000000-0000-4000-8000-000000021004', '00000000-0000-4000-8000-000000021000', 'Hiển thị trước thay đổi số dư và quyền để phát hiện bất thường, nhưng không thay thế việc tự kiểm tra', true)
ON CONFLICT (id) DO UPDATE SET
  question_id = EXCLUDED.question_id,
  label       = EXCLUDED.label,
  is_correct  = EXCLUDED.is_correct;

-- -----------------------------------------------------------------------------
-- KIỂM TRA TÍNH TOÀN VẸN: mỗi câu hỏi có >= 2 đáp án và đúng 1 đáp án đúng
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  bad record;
BEGIN
  SELECT q.id, count(o.id) AS n_opt, count(o.id) FILTER (WHERE o.is_correct) AS n_correct
    INTO bad
    FROM questions q
    LEFT JOIN options o ON o.question_id = q.id
   GROUP BY q.id
  HAVING count(o.id) < 2 OR count(o.id) FILTER (WHERE o.is_correct) <> 1
   LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION 'Seed không hợp lệ: question % có % đáp án, % đáp án đúng',
      bad.id, bad.n_opt, bad.n_correct;
  END IF;
END
$$;

COMMIT;
