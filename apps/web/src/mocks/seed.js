// File được sinh tự động từ db/seed.sql — chỉ dùng làm dữ liệu mẫu cho giao diện.
// Khi nối API thật, có thể xoá file này.
export const lessons = {
  "0": "# Bảo mật ví, Private Key & Seed Phrase\n\n## Mục tiêu bài học\nSau bài học này bạn sẽ:\n- Hiểu mối quan hệ giữa **seed phrase → private key → public key → địa chỉ ví**.\n- Biết cách lưu trữ và sao lưu seed phrase đúng cách.\n- Phân biệt ví nóng, ví lạnh, ví cứng, multisig/MPC và biết khi nào dùng loại nào.\n- Nhận diện các mối đe doạ trên thiết bị: tiện ích trình duyệt độc hại, clipboard hijacker.\n\n## 1. Seed phrase và private key\n- **Seed phrase** (12 hoặc 24 từ, chuẩn BIP-39) là \"chìa khoá gốc\". Từ nó, ví sinh ra toàn bộ private key (BIP-32/BIP-44).\n- **Private key** dùng để ký giao dịch. Từ private key suy ra public key, rồi lấy 20 byte cuối của `keccak256(publicKey)` làm **địa chỉ ví**.\n- Quá trình này **một chiều**: biết địa chỉ không thể tính ngược ra private key.\n- Không có \"quên mật khẩu\" trên blockchain: **mất seed phrase = mất tài sản**, **lộ seed phrase = mất tài sản**.\n\n> Không một dịch vụ hợp pháp nào (ví, sàn, đội hỗ trợ, admin dự án) yêu cầu bạn cung cấp seed phrase hay private key.\n\n## 2. Lưu trữ & sao lưu\n| Nên | Không nên |\n|---|---|\n| Ghi ra giấy hoặc khắc lên tấm kim loại | Chụp màn hình, lưu thư viện ảnh |\n| Cất nơi an toàn, ngoại tuyến | Lưu Google Docs, Notes, email, chat |\n| Có bản sao thứ hai ở địa điểm khác | Đồng bộ lên cloud |\n| Kiểm tra lại bản sao lưu bằng cách khôi phục thử trên ví mới | Chia nhỏ gửi cho nhiều người qua tin nhắn |\n\n## 3. Các loại ví\n- **Ví nóng** (extension, mobile): tiện lợi, luôn online → dùng với số dư nhỏ để tương tác dApp.\n- **Ví lạnh / ví cứng**: private key nằm trong chip bảo mật, ký giao dịch bên trong thiết bị. Vẫn phải **đọc kỹ nội dung hiển thị trên màn hình thiết bị** – ví cứng không ngăn bạn ký một giao dịch độc hại.\n- **Multisig / MPC**: yêu cầu nhiều người phê duyệt (ví dụ 2/3, 3/5). Bắt buộc với quỹ doanh nghiệp để loại bỏ điểm lỗi duy nhất và đảm bảo phân tách nhiệm vụ.\n\n**Nguyên tắc tách ví:** ví \"burner\" cho dApp mới / airdrop, ví chính cho tài sản giá trị, ví lạnh cho lưu trữ dài hạn.\n\n## 4. An toàn thiết bị\n- Chỉ cài tiện ích trình duyệt từ nguồn chính thức; gỡ tiện ích không dùng.\n- **Clipboard hijacker** tự thay địa chỉ bạn vừa copy bằng địa chỉ kẻ gian → luôn đối chiếu **đầu, giữa và cuối** địa chỉ trước khi gửi, ưu tiên sổ địa chỉ đã xác minh.\n- Cập nhật hệ điều hành, trình duyệt, firmware ví cứng.\n- Mất thiết bị có ví nóng → coi như seed phrase đã lộ: khôi phục trên thiết bị an toàn, **chuyển tài sản sang ví mới với seed phrase mới**, báo cáo sự cố.\n\n## Checklist\n- [ ] Seed phrase được lưu ngoại tuyến, có 2 bản ở 2 nơi.\n- [ ] Đã khôi phục thử để kiểm tra bản sao lưu.\n- [ ] Tài sản chính nằm ở ví lạnh hoặc multisig.\n- [ ] Ví dùng cho dApp mới chỉ giữ số dư nhỏ.\n- [ ] Đã rà soát và gỡ các tiện ích trình duyệt không cần thiết.\n\n## Liên hệ tiêu chuẩn\n| Tiêu chuẩn | Control | Nội dung liên quan |\n|---|---|---|\n| ISO/IEC 27001:2022 | A.5.17 | Quản lý thông tin xác thực (seed phrase, private key) |\n| ISO/IEC 27001:2022 | A.8.5 | Xác thực an toàn (ví cứng, multisig) |\n| ISO/IEC 27001:2022 | A.8.24 | Sử dụng mật mã |\n| ISO/IEC 27001:2022 | A.8.13 | Sao lưu thông tin |\n| ISO/IEC 27001:2022 | A.8.1, A.8.7 | Thiết bị đầu cuối & phòng chống mã độc |\n| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |\n| SOC 2 | CC6.1 | Kiểm soát truy cập logic, bảo vệ khoá |\n| SOC 2 | CC6.8 | Ngăn chặn phần mềm độc hại |\n| SOC 2 | CC1.4, CC2.2 | Năng lực & truyền thông trách nhiệm bảo mật |",
  "1": "# Nhận diện Phishing & Social Engineering trong Web3\n\n## Mục tiêu bài học\nSau bài học này bạn sẽ:\n- Nhận diện website giả mạo, popup ví giả, airdrop lừa đảo.\n- Hiểu các chiêu thao túng tâm lý phổ biến (khẩn cấp, sợ hãi, lòng tham, giả danh).\n- Biết xử lý và báo cáo sự cố khi lỡ tương tác với kẻ gian.\n\n## 1. Website & popup giả mạo\n- **Typosquatting**: tên miền gần giống bản gốc (`chainaware-app.io`, `chainawere.app`).\n- **Homoglyph / punycode**: dùng ký tự Unicode trông giống chữ Latin (chữ `і` Cyrillic thay cho `i`).\n- **Quảng cáo tìm kiếm** giả mạo thường đứng đầu kết quả.\n- **HTTPS (ổ khoá) chỉ mã hoá kết nối**, không chứng minh trang đó là thật.\n- **Popup ví giả**: một khung HTML trong trang được vẽ giống hệt cửa sổ ví và yêu cầu nhập seed phrase. Ví thật **không bao giờ** yêu cầu seed phrase để kết nối hay \"xác minh\".\n\n**Thói quen an toàn:** truy cập dApp qua **bookmark** đã lưu từ nguồn chính thức.\n\n## 2. Social engineering\n| Chiêu thức | Dấu hiệu |\n|---|---|\n| Khẩn cấp / sợ hãi | \"Ví của bạn sẽ bị khoá trong 24 giờ\" |\n| Lòng tham | \"Bạn được airdrop 5.000 USDT, claim ngay\" |\n| Giả danh | Tài khoản trùng tên/avatar admin, DM chủ động \"hỗ trợ\" |\n| Tuyển dụng giả | Yêu cầu tải & chạy \"bài test kỹ thuật\" (repo, package, file cài đặt) |\n| Recovery scam | \"Chuyên gia\" hứa lấy lại tiền bị mất nếu trả phí trước |\n\n- **Airdrop lạ**: token xuất hiện trong ví kèm link \"claim\" → ẩn token, không tương tác.\n- **Address poisoning**: kẻ gian gửi giao dịch 0 hoặc rất nhỏ từ địa chỉ có đầu/cuối giống địa chỉ bạn hay dùng, để bạn copy nhầm từ lịch sử giao dịch.\n- Code lạ từ \"nhà tuyển dụng\" chỉ chạy trong **máy ảo / sandbox** tách biệt, sau khi đã đọc code.\n\n## 3. Khi đã lỡ tương tác\n1. Ngắt kết nối website, ngừng ký thêm bất cứ thứ gì.\n2. **Thu hồi (revoke)** các approval vừa cấp.\n3. Chuyển tài sản còn lại sang ví an toàn (seed phrase mới nếu nghi lộ khoá).\n4. **Báo cáo** đội bảo mật kèm bằng chứng: URL, tx hash, ảnh chụp tin nhắn.\n5. Cảnh giác với \"hỗ trợ\" xuất hiện ngay sau đó – đó thường là lần lừa đảo thứ hai.\n\n## Checklist\n- [ ] Truy cập dApp qua bookmark, không qua quảng cáo hay link trong tin nhắn.\n- [ ] Không bao giờ nhập seed phrase vào website.\n- [ ] Không phản hồi DM tự xưng admin / support.\n- [ ] Biết kênh báo cáo sự cố nội bộ.\n\n## Liên hệ tiêu chuẩn\n| Tiêu chuẩn | Control | Nội dung liên quan |\n|---|---|---|\n| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |\n| ISO/IEC 27001:2022 | A.5.7 | Thông tin về mối đe doạ (threat intelligence) |\n| ISO/IEC 27001:2022 | A.8.23 | Lọc truy cập web |\n| ISO/IEC 27001:2022 | A.6.8 | Báo cáo sự kiện ATTT |\n| ISO/IEC 27001:2022 | A.5.24, A.5.26 | Lập kế hoạch & ứng phó sự cố |\n| SOC 2 | CC1.4, CC2.2 | Năng lực & truyền thông trách nhiệm bảo mật |\n| SOC 2 | CC7.2, CC7.3, CC7.4 | Giám sát, đánh giá & ứng phó sự cố |",
  "2": "# Token Approval & Chữ ký giao dịch\n\n## Mục tiêu bài học\nSau bài học này bạn sẽ:\n- Hiểu `approve` / `transferFrom` của ERC-20 và `setApprovalForAll` của NFT.\n- Nhận ra rủi ro của approval không giới hạn và cách thu hồi.\n- Đọc hiểu các loại yêu cầu ký: giao dịch on-chain, `personal_sign`, EIP-712 typed data, `eth_sign`.\n\n## 1. Approval hoạt động thế nào\n- `approve(spender, amount)` cho phép `spender` gọi `transferFrom` để rút **tối đa `amount`** token từ ví bạn, **bất cứ lúc nào**, cho tới khi bị thu hồi.\n- Approval **không tự hết hạn**. Ngắt kết nối website khỏi ví **không** thu hồi approval.\n- `setApprovalForAll(operator, true)` cho phép operator chuyển **toàn bộ NFT** của bộ sưu tập đó.\n\n### Approval không giới hạn\n`approve(spender, type(uint256).max)` → nếu spender độc hại hoặc bị hack, nó rút được **toàn bộ** số dư – kể cả token bạn nhận thêm sau này – mà không cần thêm chữ ký nào của bạn.\n\n**Nguyên tắc đặc quyền tối thiểu:** chỉ approve đúng số lượng cần cho giao dịch.\n\n## 2. Thu hồi & rà soát\n- Thu hồi = gửi giao dịch `approve(spender, 0)` hoặc dùng công cụ revoke uy tín.\n- **Định kỳ rà soát** approval: dApp cũ không còn dùng vẫn giữ quyền; nếu contract đó bị khai thác, token của bạn có thể bị rút.\n\n## 3. Chữ ký off-chain cũng nguy hiểm\n| Loại | Ý nghĩa | Rủi ro |\n|---|---|---|\n| Giao dịch on-chain | Tốn gas, thay đổi trạng thái | Đọc kỹ hàm được gọi (`approve`, `setApprovalForAll`, ...) |\n| `personal_sign` | Ký một thông điệp văn bản (đăng nhập SIWE) | Thấp nếu nội dung rõ ràng |\n| EIP-712 typed data | Dữ liệu có cấu trúc: domain + message | `Permit` / Permit2 có thể cấp quyền chi tiêu token mà **không tốn gas** |\n| `eth_sign` | Ký một hash bất kỳ (blind signing) | Có thể là hash của bất kỳ giao dịch nào → **từ chối** |\n\nKhi gặp EIP-712, kiểm tra: **domain** (name, chainId, verifyingContract), **loại thông điệp** (ví dụ `Permit`), **spender**, **value**, **deadline**.\n\n> ChainAware cũng dùng EIP-712: chứng nhận hoàn thành (`Completion`) gồm learner, moduleId, score, nonce, deadline được attester ký và contract `CompleteTracker` kiểm tra.\n\n## 4. Mô phỏng giao dịch\nTính năng mô phỏng của ví hiển thị trước thay đổi số dư và quyền (\"−1.000 CALT\", \"cấp approval\"). Hữu ích nhưng **không đảm bảo 100%** – contract độc hại có thể hành xử khác khi phát hiện môi trường mô phỏng.\n\n## Thực hành (testnet)\n1. Gọi `faucet()` trên **ChainAware Lesson Token (CALT)** để nhận 1.000 CALT.\n2. `approve` cho contract **ApprovalSink** – contract này cố ý không có hàm di chuyển tài sản.\n3. Xem approval trong công cụ rà soát, sau đó **thu hồi** bằng `approve(sink, 0)`.\n\nBài test `Drainer` trong repo minh hoạ điều kẻ tấn công thật làm được sau một approve không giới hạn: rút sạch số dư chỉ bằng một lệnh `transferFrom`.\n\n## Checklist\n- [ ] Không approve unlimited cho dApp mới.\n- [ ] Từ chối `setApprovalForAll` khi chỉ \"mint\" hoặc \"claim\".\n- [ ] Từ chối mọi yêu cầu `eth_sign` / blind signing.\n- [ ] Rà soát approval ít nhất mỗi tháng.\n\n## Liên hệ tiêu chuẩn\n| Tiêu chuẩn | Control | Nội dung liên quan |\n|---|---|---|\n| ISO/IEC 27001:2022 | A.5.15 | Kiểm soát truy cập – đặc quyền tối thiểu |\n| ISO/IEC 27001:2022 | A.5.18 | Quyền truy cập – cấp, rà soát, thu hồi |\n| ISO/IEC 27001:2022 | A.8.2 | Quyền truy cập đặc quyền |\n| ISO/IEC 27001:2022 | A.8.24 | Sử dụng mật mã (chữ ký số) |\n| ISO/IEC 27001:2022 | A.6.3 | Nâng cao nhận thức, đào tạo ATTT |\n| SOC 2 | CC6.1, CC6.2, CC6.3 | Cấp, điều chỉnh, thu hồi quyền truy cập |"
};

export const questionBank = {
  "0": [
    {
      "id": "00000000-0000-4000-8000-000000000100",
      "module_id": 0,
      "topic": "seed-phrase",
      "prompt": "Seed phrase (cụm 12 hoặc 24 từ khôi phục) cho phép làm gì?",
      "explanation": "Seed phrase sinh ra toàn bộ private key của ví (BIP-39/BIP-32). Ai nắm seed phrase có toàn quyền với mọi tài sản của ví, trên bất kỳ thiết bị nào – mật khẩu ứng dụng ví chỉ bảo vệ dữ liệu trên một thiết bị.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000101",
          "label": "Chỉ dùng để mở khoá ứng dụng ví trên thiết bị hiện tại",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000102",
          "label": "Khôi phục toàn bộ ví và mọi tài sản trên bất kỳ thiết bị nào",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000103",
          "label": "Đổi mật khẩu của ứng dụng ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000104",
          "label": "Xem lịch sử giao dịch nhưng không thể chuyển tài sản",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000200",
      "module_id": 0,
      "topic": "seed-phrase",
      "prompt": "Cách lưu trữ seed phrase nào an toàn nhất?",
      "explanation": "Seed phrase phải được lưu ngoại tuyến, không đồng bộ lên cloud hay ứng dụng nhắn tin. Bản sao vật lý thứ hai ở địa điểm khác giúp phòng mất mát do cháy, ngập hoặc thất lạc.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000201",
          "label": "Chụp màn hình và lưu trong thư viện ảnh có đồng bộ cloud",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000202",
          "label": "Lưu trong Google Docs hoặc ứng dụng ghi chú có đặt mật khẩu",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000203",
          "label": "Ghi ra giấy hoặc khắc lên kim loại, cất ngoại tuyến và có bản sao ở địa điểm thứ hai",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000204",
          "label": "Gửi email cho chính mình để không bao giờ bị mất",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000300",
      "module_id": 0,
      "topic": "seed-phrase",
      "prompt": "Một \"nhân viên hỗ trợ\" của ví nhắn tin yêu cầu bạn cung cấp seed phrase để \"đồng bộ lại ví\". Bạn nên làm gì?",
      "explanation": "Không dịch vụ hợp pháp nào yêu cầu seed phrase. Gửi một phần seed phrase cũng nguy hiểm vì làm giảm mạnh số khả năng kẻ gian phải dò. Hãy từ chối và báo cáo tài khoản giả mạo.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000301",
          "label": "Cung cấp, vì đó là nhân viên hỗ trợ chính thức",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000302",
          "label": "Chỉ gửi 6 từ đầu tiên để họ xác minh",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000303",
          "label": "Nhập seed phrase vào đường link họ gửi thay vì gửi qua tin nhắn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000304",
          "label": "Từ chối, không chia sẻ seed phrase với bất kỳ ai và báo cáo tài khoản giả mạo",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000400",
      "module_id": 0,
      "topic": "private-key",
      "prompt": "Quan hệ giữa private key và địa chỉ ví là gì?",
      "explanation": "Public key được suy ra từ private key (ECDSA secp256k1), địa chỉ là 20 byte cuối của keccak256(public key). Đây là hàm một chiều: không thể tính ngược private key từ địa chỉ, và cũng không ai \"cấp lại\" được private key khi bạn làm mất.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000401",
          "label": "Địa chỉ suy ra từ public key, public key suy ra từ private key; không thể tính ngược lại",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000402",
          "label": "Có thể tính ngược private key từ địa chỉ nếu có đủ nhiều giao dịch",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000403",
          "label": "Private key và địa chỉ là hai tên gọi của cùng một chuỗi ký tự",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000404",
          "label": "Private key do blockchain cấp và có thể yêu cầu cấp lại khi bị mất",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000500",
      "module_id": 0,
      "topic": "wallet-types",
      "prompt": "Ví cứng (hardware wallet) bảo vệ bạn chủ yếu bằng cách nào?",
      "explanation": "Ví cứng giữ private key trong chip bảo mật và ký giao dịch ngay bên trong thiết bị, nên khoá không bị lộ dù máy tính nhiễm mã độc. Tuy nhiên nó không ngăn bạn ký một giao dịch độc hại – vẫn phải đọc kỹ nội dung hiển thị trên màn hình thiết bị.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000501",
          "label": "Mã hoá lịch sử giao dịch để không ai xem được trên blockchain",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000502",
          "label": "Tự động hoàn tiền nếu bạn bị lừa",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000503",
          "label": "Giữ private key trong chip bảo mật và ký giao dịch bên trong thiết bị, khoá không rời khỏi thiết bị",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000504",
          "label": "Tự động chặn mọi smart contract độc hại",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000600",
      "module_id": 0,
      "topic": "wallet-types",
      "prompt": "Doanh nghiệp quản lý quỹ lớn trên blockchain nên dùng cơ chế nào để tránh \"điểm lỗi duy nhất\"?",
      "explanation": "Multisig hoặc MPC yêu cầu nhiều người phê duyệt (ví dụ 2/3, 3/5), đảm bảo phân tách nhiệm vụ: một người bị lừa, bị mất thiết bị hay có ý đồ xấu cũng không thể tự mình chuyển quỹ.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000601",
          "label": "Một ví nóng do kế toán trưởng giữ",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000602",
          "label": "Chia sẻ chung một private key cho cả phòng tài chính",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000603",
          "label": "Lưu private key trong biến môi trường của server",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000604",
          "label": "Ví đa chữ ký (multisig) hoặc MPC yêu cầu nhiều người phê duyệt, ví dụ 2/3 hoặc 3/5",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000700",
      "module_id": 0,
      "topic": "wallet-types",
      "prompt": "Nguyên tắc tách ví nào sau đây là hợp lý?",
      "explanation": "Tách ví giúp giới hạn thiệt hại: nếu ví dùng để thử dApp mới bị lừa, chỉ mất số dư nhỏ trong ví đó. Tài sản chính nằm ở ví lạnh và hạn chế ký các giao dịch lạ.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000701",
          "label": "Dùng một ví duy nhất cho mọi việc để dễ quản lý",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000702",
          "label": "Ví nóng số dư nhỏ để thử dApp mới; ví lạnh giữ tài sản chính và hạn chế ký giao dịch lạ",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000703",
          "label": "Dùng ví lạnh để săn airdrop, ví nóng để giữ tài sản chính",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000704",
          "label": "Tạo nhiều ví từ cùng một seed phrase rồi chia sẻ seed cho người thân giữ hộ",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000800",
      "module_id": 0,
      "topic": "device-security",
      "prompt": "Bạn cài một tiện ích trình duyệt \"tối ưu phí gas\" từ nguồn không rõ. Rủi ro lớn nhất là gì?",
      "explanation": "Tiện ích trình duyệt có quyền đọc và sửa nội dung trang web, có thể tráo địa chỉ nhận, chèn yêu cầu ký độc hại hoặc đánh cắp dữ liệu. Chỉ cài tiện ích từ nguồn chính thức và gỡ những tiện ích không dùng.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000801",
          "label": "Trình duyệt chạy chậm hơn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000802",
          "label": "Tiện ích có thể đọc và sửa nội dung trang, tráo địa chỉ nhận hoặc đánh cắp dữ liệu ví",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000803",
          "label": "Phí gas sẽ tăng gấp đôi",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000804",
          "label": "Không có rủi ro vì ví đã có mật khẩu",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000000900",
      "module_id": 0,
      "topic": "device-security",
      "prompt": "Clipboard hijacker (mã độc theo dõi clipboard) gây hại thế nào và phòng tránh ra sao?",
      "explanation": "Mã độc này thay địa chỉ bạn vừa copy bằng địa chỉ của kẻ gian, thậm chí có đầu/cuối giống hệt. Hãy đối chiếu cả phần đầu, giữa và cuối địa chỉ trước khi gửi, và ưu tiên dùng sổ địa chỉ đã xác minh.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000000901",
          "label": "Nó xoá ví; phòng tránh bằng cách đổi mật khẩu ví thường xuyên",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000902",
          "label": "Nó chỉ ảnh hưởng văn bản thông thường, không ảnh hưởng địa chỉ ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000000903",
          "label": "Nó thay địa chỉ vừa copy bằng địa chỉ kẻ gian; đối chiếu đầu, giữa, cuối địa chỉ và dùng sổ địa chỉ đã xác minh",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000000904",
          "label": "Nó chỉ hoạt động trên điện thoại nên dùng máy tính là an toàn",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000001000",
      "module_id": 0,
      "topic": "backup-recovery",
      "prompt": "Bạn làm mất điện thoại có cài ví nóng (seed phrase đã được sao lưu an toàn). Bước ưu tiên là gì?",
      "explanation": "Thiết bị bị mất phải coi như khoá có thể đã lộ. Khôi phục ví trên thiết bị an toàn, chuyển tài sản sang ví mới với seed phrase mới và báo cáo sự cố. Đổi mật khẩu ứng dụng không giúp gì, và blockchain không có cơ chế \"đóng băng\" địa chỉ.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000001001",
          "label": "Chờ xem có giao dịch lạ không rồi mới xử lý",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000001002",
          "label": "Chỉ cần đổi mật khẩu mở khoá ứng dụng ví trên thiết bị mới",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000001003",
          "label": "Liên hệ blockchain để đóng băng địa chỉ ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000001004",
          "label": "Khôi phục ví trên thiết bị an toàn, chuyển tài sản sang ví mới với seed phrase mới và báo cáo sự cố",
          "is_correct": true
        }
      ]
    }
  ],
  "1": [
    {
      "id": "00000000-0000-4000-8000-000000010100",
      "module_id": 1,
      "topic": "fake-website",
      "prompt": "Dấu hiệu nào cho thấy một trang web có thể đang giả mạo dApp?",
      "explanation": "Typosquatting (chainawere.app) và ký tự Unicode trông giống chữ Latin (homoglyph) là dấu hiệu điển hình. HTTPS chỉ mã hoá kết nối, không chứng minh trang là thật; logo và nút \"Connect Wallet\" thì ai cũng sao chép được.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010101",
          "label": "Trang có biểu tượng ổ khoá HTTPS",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010102",
          "label": "Tên miền gần giống bản gốc (chainawere.app) hoặc chứa ký tự Unicode trông giống chữ Latin",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010103",
          "label": "Trang có nút \"Connect Wallet\"",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010104",
          "label": "Trang hiển thị đúng logo của dự án",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010200",
      "module_id": 1,
      "topic": "fake-website",
      "prompt": "Cách an toàn nhất để truy cập một dApp bạn dùng thường xuyên là gì?",
      "explanation": "Bookmark được lưu từ nguồn chính thức loại bỏ rủi ro gõ nhầm tên miền, quảng cáo tìm kiếm giả mạo và link độc hại trong tin nhắn hay bình luận.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010201",
          "label": "Bấm vào quảng cáo đầu tiên trên kết quả tìm kiếm",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010202",
          "label": "Bấm link trong tin nhắn Telegram từ \"admin\" dự án",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010203",
          "label": "Dùng bookmark đã lưu từ nguồn chính thức",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010204",
          "label": "Bấm link trong phần bình luận dưới bài đăng của dự án",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010300",
      "module_id": 1,
      "topic": "airdrop-scam",
      "prompt": "Ví của bạn bỗng nhận được một token lạ kèm website \"claim phần thưởng\". Bạn nên làm gì?",
      "explanation": "Token airdrop lạ thường là mồi nhử: website claim sẽ yêu cầu approve hoặc ký permit để rút tài sản, và việc bán token đó cũng có thể đòi một approval độc hại. Hãy ẩn token và không tương tác.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010301",
          "label": "Truy cập website để claim trước khi hết hạn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010302",
          "label": "Bán ngay token đó trên một sàn DEX",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010303",
          "label": "Chuyển token cho bạn bè nhờ kiểm tra hộ",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010304",
          "label": "Ẩn token, không truy cập website hay tương tác với contract của nó",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010400",
      "module_id": 1,
      "topic": "social-engineering",
      "prompt": "Yếu tố tâm lý nào được kẻ tấn công lợi dụng nhiều nhất trong phishing?",
      "explanation": "Tạo cảm giác khẩn cấp hoặc sợ hãi khiến nạn nhân hành động vội, bỏ qua bước kiểm tra. Bất kỳ thông điệp nào ép bạn hành động ngay đều đáng nghi.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010401",
          "label": "Tạo cảm giác khẩn cấp hoặc sợ hãi, ví dụ \"Ví của bạn sẽ bị khoá trong 24 giờ\"",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010402",
          "label": "Cung cấp thông tin kỹ thuật chi tiết và chính xác",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010403",
          "label": "Khuyên bạn dành thời gian kiểm tra kỹ trước khi làm",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010404",
          "label": "Hướng dẫn bạn liên hệ qua kênh hỗ trợ chính thức",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010500",
      "module_id": 1,
      "topic": "impersonation",
      "prompt": "Trong Discord của dự án, một tài khoản có tên và avatar giống admin nhắn riêng mời bạn vào \"whitelist\". Điều nào đúng?",
      "explanation": "Tên hiển thị và avatar sao chép rất dễ. Các dự án uy tín thường thông báo rằng đội ngũ không bao giờ nhắn riêng trước. Chỉ tin thông tin trên kênh thông báo chính thức.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010501",
          "label": "Admin thật thường chủ động nhắn riêng để hỗ trợ thành viên",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010502",
          "label": "Tài khoản có cùng avatar và tên với admin thì chắc chắn là thật",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010503",
          "label": "Tên và avatar rất dễ sao chép; hãy xác minh qua kênh thông báo chính thức, đội ngũ uy tín không nhắn riêng trước",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010504",
          "label": "Làm theo ngay vì whitelist có giới hạn thời gian",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010600",
      "module_id": 1,
      "topic": "social-engineering",
      "prompt": "Bạn nhận lời mời làm việc từ một \"công ty Web3\" và được yêu cầu tải về, chạy một repo \"bài test kỹ thuật\". Rủi ro chính là gì?",
      "explanation": "Tuyển dụng giả là chiêu phổ biến để phát tán mã độc đánh cắp ví, khoá SSH và cookie trình duyệt (ví dụ qua script postinstall của npm). Chỉ chạy code lạ trong máy ảo hoặc sandbox tách biệt, sau khi đã đọc code.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010601",
          "label": "Không có rủi ro vì đó chỉ là source code",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010602",
          "label": "Chỉ mất thời gian làm bài",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010603",
          "label": "Rủi ro chỉ tồn tại nếu bạn dùng Windows",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010604",
          "label": "Repo có thể chứa mã độc đánh cắp ví, khoá SSH, cookie; chỉ chạy trong máy ảo/sandbox tách biệt sau khi đọc code",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010700",
      "module_id": 1,
      "topic": "fake-website",
      "prompt": "Một trang web hiện cửa sổ giống hệt popup ví, yêu cầu nhập seed phrase để \"xác minh ví\". Đây là gì?",
      "explanation": "Ví thật không bao giờ yêu cầu nhập seed phrase để kết nối hay xác minh. Popup đó thường chỉ là HTML được vẽ bên trong trang để đánh cắp seed phrase.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010701",
          "label": "Phishing: ví thật không bao giờ yêu cầu seed phrase để kết nối hay xác minh",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010702",
          "label": "Một tính năng bảo mật mới của ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010703",
          "label": "Bình thường nếu trang web dùng HTTPS",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010704",
          "label": "Chỉ nguy hiểm nếu bạn đang dùng ví cứng",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010800",
      "module_id": 1,
      "topic": "impersonation",
      "prompt": "Address poisoning là gì?",
      "explanation": "Kẻ gian tạo địa chỉ có phần đầu/cuối giống địa chỉ bạn hay giao dịch, rồi gửi giao dịch 0 hoặc rất nhỏ để nó xuất hiện trong lịch sử. Nạn nhân copy nhầm từ lịch sử và gửi tiền cho kẻ gian.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010801",
          "label": "Kẻ gian làm hỏng địa chỉ ví khiến bạn không nhận được tiền",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010802",
          "label": "Kẻ gian gửi giao dịch nhỏ từ địa chỉ có đầu/cuối giống địa chỉ quen thuộc để bạn copy nhầm từ lịch sử",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010803",
          "label": "Lỗi của blockchain khiến hai địa chỉ bị trùng nhau",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010804",
          "label": "Một loại virus lây nhiễm vào ví cứng",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000010900",
      "module_id": 1,
      "topic": "incident-response",
      "prompt": "Bạn lỡ ký một giao dịch trên trang nghi là phishing. Cách xử lý hợp lý nhất là gì?",
      "explanation": "Cần cô lập nhanh: ngắt kết nối, thu hồi approval, chuyển tài sản còn lại sang ví an toàn, rồi báo cáo đội bảo mật kèm bằng chứng (URL, tx hash). Giữ im lặng làm chậm phản ứng của tổ chức; \"hỗ trợ\" trong bình luận thường là lừa đảo tiếp.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000010901",
          "label": "Xoá lịch sử trình duyệt và không nói với ai",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010902",
          "label": "Gửi thêm tiền vào ví để \"giữ\" tài khoản",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000010903",
          "label": "Ngắt kết nối, thu hồi approval, chuyển tài sản còn lại sang ví an toàn và báo cáo đội bảo mật kèm URL, tx hash",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000010904",
          "label": "Nhắn cho tài khoản \"hỗ trợ\" xuất hiện trong phần bình luận để lấy lại tiền",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000011000",
      "module_id": 1,
      "topic": "incident-response",
      "prompt": "Sau khi bị lừa, có người tự xưng \"chuyên gia khôi phục tài sản crypto\" cam kết lấy lại tiền nếu bạn trả phí trước. Đây là gì?",
      "explanation": "Recovery scam nhắm vào người vừa bị lừa. Giao dịch trên blockchain không thể đảo ngược bằng \"dịch vụ\" trả phí trước. Chỉ làm việc với cơ quan chức năng và đội bảo mật chính thức.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000011001",
          "label": "Dịch vụ hợp pháp, nên dùng ngay trước khi tiền bị chuyển đi xa",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000011002",
          "label": "An toàn nếu tài khoản đó có nhiều người theo dõi",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000011003",
          "label": "Recovery scam nhắm vào nạn nhân; chỉ làm việc với cơ quan chức năng và đội bảo mật chính thức",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000011004",
          "label": "Cách duy nhất vì giao dịch blockchain không thể truy vết",
          "is_correct": false
        }
      ]
    }
  ],
  "2": [
    {
      "id": "00000000-0000-4000-8000-000000020100",
      "module_id": 2,
      "topic": "token-approval",
      "prompt": "Khi gọi approve(spender, amount) trên một token ERC-20, bạn đang làm gì?",
      "explanation": "approve không chuyển token ngay mà cấp cho spender quyền gọi transferFrom để rút tối đa amount token từ ví bạn, bất cứ lúc nào, cho tới khi quyền bị thu hồi.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020101",
          "label": "Chuyển ngay amount token cho spender",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020102",
          "label": "Xác minh danh tính của spender",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020103",
          "label": "Cho phép spender gọi transferFrom để rút tối đa amount token bất cứ lúc nào, cho tới khi bị thu hồi",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020104",
          "label": "Khoá token trong ví để không ai dùng được",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020200",
      "module_id": 2,
      "topic": "unlimited-approval",
      "prompt": "Vì sao approve với số lượng type(uint256).max (không giới hạn) là rủi ro?",
      "explanation": "Với approval không giới hạn, nếu spender độc hại hoặc bị hack, nó rút được toàn bộ số dư token đó – kể cả token nhận thêm sau này – mà không cần thêm chữ ký nào. Bài test Drainer trong ChainAware minh hoạ đúng kịch bản này.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020201",
          "label": "Spender độc hại hoặc bị hack có thể rút toàn bộ số dư, kể cả token nhận sau này, mà không cần thêm chữ ký",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020202",
          "label": "Tốn phí gas nhiều hơn đáng kể",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020203",
          "label": "Token sẽ bị đốt sau khi approve",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020204",
          "label": "Không rủi ro vì approval tự hết hạn sau 24 giờ",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020300",
      "module_id": 2,
      "topic": "unlimited-approval",
      "prompt": "Một dApp hoán đổi token yêu cầu approve. Lựa chọn tốt nhất là gì?",
      "explanation": "Theo nguyên tắc đặc quyền tối thiểu, chỉ approve đúng số lượng cần cho giao dịch. Tốn thêm một ít phí gas cho lần sau rẻ hơn nhiều so với rủi ro mất toàn bộ số dư.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020301",
          "label": "Luôn chọn unlimited để tiết kiệm phí cho những lần sau",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020302",
          "label": "Approve một lần cho mọi token trong ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020303",
          "label": "Từ chối mọi dApp vì approve luôn là lừa đảo",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020304",
          "label": "Chỉnh số lượng approve bằng đúng số token cần cho giao dịch",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020400",
      "module_id": 2,
      "topic": "revoke",
      "prompt": "Cách nào thực sự thu hồi (revoke) một approval ERC-20?",
      "explanation": "Approval được lưu on-chain trong contract token, nên phải gửi giao dịch approve(spender, 0) (hoặc dùng công cụ revoke uy tín). Ẩn token hay ngắt kết nối website trong ví không thay đổi trạng thái on-chain.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020401",
          "label": "Ẩn token khỏi danh sách hiển thị trong ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020402",
          "label": "Gửi giao dịch approve(spender, 0) hoặc dùng công cụ revoke uy tín",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020403",
          "label": "Ngắt kết nối (disconnect) website trong cài đặt ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020404",
          "label": "Đổi mật khẩu mở khoá ví",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020500",
      "module_id": 2,
      "topic": "revoke",
      "prompt": "Vì sao nên định kỳ rà soát danh sách approval của ví?",
      "explanation": "Approval không tự hết hạn. dApp bạn đã ngừng dùng vẫn giữ quyền; nếu contract đó bị khai thác, token của bạn có thể bị rút. Rà soát định kỳ tương đương việc review quyền truy cập trong ISO 27001 A.5.18.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020501",
          "label": "Vì approval làm giảm số dư token theo thời gian",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020502",
          "label": "Để giao dịch được xác nhận nhanh hơn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020503",
          "label": "Approval cũ vẫn còn hiệu lực; nếu contract đó bị khai thác, token của bạn có thể bị rút",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020504",
          "label": "Vì spender của approval tự thay đổi theo thời gian",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020600",
      "module_id": 2,
      "topic": "signature-types",
      "prompt": "Vì sao một chữ ký off-chain (không tốn gas) vẫn có thể làm bạn mất tài sản?",
      "explanation": "Chữ ký EIP-2612 Permit hoặc Permit2 là một approval dạng chữ ký. Kẻ gian đem chữ ký đó lên chuỗi gọi permit rồi transferFrom để rút token – bạn không hề gửi giao dịch nào.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020601",
          "label": "Không thể – chỉ giao dịch on-chain mới nguy hiểm",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020602",
          "label": "Vì việc ký tốn một khoản phí ẩn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020603",
          "label": "Vì chữ ký làm lộ private key",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020604",
          "label": "Chữ ký Permit/Permit2 cấp quyền chi tiêu token; kẻ gian đem lên chuỗi gọi permit rồi transferFrom",
          "is_correct": true
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020700",
      "module_id": 2,
      "topic": "signature-types",
      "prompt": "Khi ví hiển thị yêu cầu ký dữ liệu EIP-712 (typed data), bạn cần kiểm tra những gì?",
      "explanation": "EIP-712 hiển thị dữ liệu có cấu trúc nên bạn có thể đọc được: domain (name, chainId, verifyingContract) cho biết contract nào sẽ dùng chữ ký; loại thông điệp, spender, value và deadline cho biết bạn đang cấp quyền gì.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020701",
          "label": "Domain (name, chainId, verifyingContract), loại thông điệp, spender, value và deadline",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020702",
          "label": "Chỉ cần xem tên website đang yêu cầu",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020703",
          "label": "Không cần kiểm tra vì EIP-712 luôn an toàn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020704",
          "label": "Chỉ cần kiểm tra phí gas",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020800",
      "module_id": 2,
      "topic": "signature-types",
      "prompt": "Yêu cầu ký eth_sign với một chuỗi hex khó đọc (blind signing) nguy hiểm vì sao?",
      "explanation": "eth_sign ký một hash tuỳ ý, có thể là hash của bất kỳ giao dịch nào, chẳng hạn chuyển toàn bộ tài sản. Bạn không thể biết mình đang ký gì, nên hãy từ chối. Nhiều ví đã tắt eth_sign theo mặc định.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020801",
          "label": "eth_sign tốn nhiều gas hơn các loại chữ ký khác",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020802",
          "label": "Chuỗi đó có thể là hash của bất kỳ giao dịch nào, ví dụ chuyển toàn bộ tài sản; bạn không biết mình đang ký gì",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020803",
          "label": "Nó sẽ tạo một ví mới thay cho ví hiện tại",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020804",
          "label": "Không nguy hiểm vì eth_sign chỉ dùng để đăng nhập",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000020900",
      "module_id": 2,
      "topic": "token-approval",
      "prompt": "Khi bạn bấm \"mint miễn phí\" một NFT, ví hiển thị yêu cầu setApprovalForAll. Điều này có nghĩa gì?",
      "explanation": "setApprovalForAll cấp cho operator quyền chuyển TOÀN BỘ NFT của bạn trong bộ sưu tập đó. Việc mint không cần quyền này, nên đây là dấu hiệu lừa đảo rõ ràng.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000020901",
          "label": "Bình thường, mọi lần mint đều cần quyền này",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020902",
          "label": "Chỉ cho phép xem NFT trong ví",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000020903",
          "label": "Bạn cấp quyền chuyển TOÀN BỘ NFT trong bộ sưu tập; mint không cần quyền này nên hãy từ chối",
          "is_correct": true
        },
        {
          "id": "00000000-0000-4000-8000-000000020904",
          "label": "Chỉ áp dụng cho NFT sắp được mint",
          "is_correct": false
        }
      ]
    },
    {
      "id": "00000000-0000-4000-8000-000000021000",
      "module_id": 2,
      "topic": "transaction-simulation",
      "prompt": "Tính năng mô phỏng giao dịch (transaction simulation) trong ví giúp gì?",
      "explanation": "Mô phỏng cho thấy trước thay đổi số dư và quyền để bạn phát hiện bất thường. Tuy nhiên contract độc hại có thể hành xử khác khi phát hiện môi trường mô phỏng, nên đây chỉ là một lớp phòng thủ bổ sung.",
      "options": [
        {
          "id": "00000000-0000-4000-8000-000000021001",
          "label": "Đảm bảo 100% giao dịch an toàn",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000021002",
          "label": "Hoàn tiền nếu giao dịch thất bại",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000021003",
          "label": "Giảm phí gas cho giao dịch",
          "is_correct": false
        },
        {
          "id": "00000000-0000-4000-8000-000000021004",
          "label": "Hiển thị trước thay đổi số dư và quyền để phát hiện bất thường, nhưng không thay thế việc tự kiểm tra",
          "is_correct": true
        }
      ]
    }
  ]
};
