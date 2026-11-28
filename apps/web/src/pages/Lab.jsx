import { Coins, Droplet, ExternalLink, Infinity as InfinityIcon, ShieldCheck, ShieldX, TriangleExclamationPoint, Undo2 } from "lucide-react";
import { Address, Alert, Badge, Button, Card, TextField } from "../components/ui";
import { FAUCET_AMOUNT, TOKEN_SYMBOL } from "../constants/app";
import { CONTRACTS, explorerAddressUrl, explorerTxUrl } from "../constants/chain";
import { formatNumber, shortHash } from "../lib/format";
import { mockLab } from "../mocks/data";

const DRAINER_SNIPPET = `// Nạn nhân đã approve(attacker, type(uint256).max)
uint256 all = token.balanceOf(victim);
token.transferFrom(victim, attacker, all);
// → rút sạch số dư, không cần thêm chữ ký nào`;

export default function Lab() {
  // TODO: đọc TestToken.balanceOf(address) & allowance(address, CONTRACTS.sink)
  const { balance, allowance, transactions } = mockLab;
  const isUnlimited = allowance === "unlimited";
  const hasAllowance = isUnlimited || Number(allowance) > 0;
  const approveAmount = "100"; // TODO: state của ô nhập số lượng

  // TODO: tokenContract.faucet()
  function handleFaucet() {}
  // TODO: tokenContract.approve(CONTRACTS.sink, parseUnits(amount, 18))
  function handleApprove() {}
  // TODO: tokenContract.approve(CONTRACTS.sink, 0)
  function handleRevoke() {}

  return (
    <>
      <div className="page-header">
        <div>
          <div className="row" style={{ "--gap": "10px" }}>
            <span className="eyebrow">Phòng thực hành · Module 03</span>
            <Badge tone="warning">Testnet</Badge>
          </div>
          <h1 className="page-title mt-6">Token Approval: cấp quyền & thu hồi</h1>
          <p className="page-subtitle">
            Tự tay nhận token thử nghiệm, cấp quyền chi tiêu cho một contract rồi thu hồi — để quen với những gì ví hiển thị trước
            khi gặp tình huống thật.
          </p>
        </div>
      </div>

      <Alert tone="success" icon={ShieldCheck} title="Môi trường an toàn" className="mb-24">
        <span className="mono">ApprovalSink</span> cố ý không có hàm <span className="mono">transferFrom</span>, không có owner hay
        proxy — contract này không thể di chuyển tài sản của bạn. Token <span className="mono">{TOKEN_SYMBOL}</span> không có giá
        trị thật.
      </Alert>

      <div className="grid grid-3 lab-grid">
        {/* Bước 1 */}
        <Card className="lab-step">
          <span className="lab-step-num">Bước 1</span>
          <h2 className="lab-step-title">Nhận token thử nghiệm</h2>
          <p className="text-sm muted">
            Gọi <span className="mono">faucet()</span> để nhận {formatNumber(FAUCET_AMOUNT)} {TOKEN_SYMBOL}.
          </p>
          <div className="balance">
            <span className="text-xs subtle">Số dư</span>
            <div className="balance-value">
              {formatNumber(balance)} <small>{TOKEN_SYMBOL}</small>
            </div>
          </div>
          <div className="lab-step-foot">
            <Button block variant="secondary" icon={Droplet} onClick={handleFaucet}>
              Nhận {formatNumber(FAUCET_AMOUNT)} {TOKEN_SYMBOL}
            </Button>
          </div>
        </Card>

        {/* Bước 2 */}
        <Card className="lab-step">
          <span className="lab-step-num">Bước 2</span>
          <h2 className="lab-step-title">Cấp quyền (approve)</h2>
          <div className="text-sm muted row" style={{ "--gap": "6px" }}>
            Spender: <Address value={CONTRACTS.sink} explorerUrl={explorerAddressUrl(CONTRACTS.sink)} />
          </div>

          <TextField
            label="Số lượng"
            name="amount"
            type="number"
            min="0"
            inputMode="decimal"
            defaultValue={approveAmount}
            addon={<span className="input-suffix">{TOKEN_SYMBOL}</span>}
          />
          <div className="chips" role="group" aria-label="Chọn nhanh số lượng">
            {/* TODO: onClick đặt số lượng */}
            <button type="button" className="chip">
              10
            </button>
            <button type="button" className="chip">
              100
            </button>
            <button type="button" className="chip">
              Toàn bộ số dư
            </button>
            <button type="button" className="chip chip-danger">
              <InfinityIcon size={13} aria-hidden="true" /> Không giới hạn
            </button>
          </div>

          <div className="sim">
            <div className="sim-title">Mô phỏng giao dịch</div>
            <div className="sim-row">
              <span>Thay đổi số dư</span>
              <span className="mono">0 {TOKEN_SYMBOL}</span>
            </div>
            <div className="sim-row">
              <span>Quyền chi tiêu cấp cho Sink</span>
              <span className="mono warn">
                {approveAmount} {TOKEN_SYMBOL}
              </span>
            </div>
          </div>

          <div className="lab-step-foot">
            <Button block icon={Coins} onClick={handleApprove}>
              Approve {approveAmount} {TOKEN_SYMBOL}
            </Button>
          </div>
        </Card>

        {/* Bước 3 */}
        <Card className="lab-step">
          <span className="lab-step-num">Bước 3</span>
          <h2 className="lab-step-title">Rà soát & thu hồi</h2>
          <p className="text-sm muted">
            Thu hồi bằng <span className="mono">approve(sink, 0)</span>. Ngắt kết nối website khỏi ví <strong>không</strong> thu
            hồi approval.
          </p>
          <div className={`allowance ${hasAllowance ? "is-active" : ""}`}>
            <span className="text-xs subtle">Allowance hiện tại</span>
            <div className="allowance-value">
              {isUnlimited ? (
                <>
                  <InfinityIcon size={22} aria-hidden="true" /> Không giới hạn
                </>
              ) : (
                <>
                  {formatNumber(allowance)} <small>{TOKEN_SYMBOL}</small>
                </>
              )}
            </div>
            {hasAllowance ? (
              <Badge tone="warning" icon={TriangleExclamationPoint}>
                Sink đang có quyền chi tiêu
              </Badge>
            ) : (
              <Badge tone="success" icon={ShieldCheck}>
                Không có approval nào
              </Badge>
            )}
          </div>
          <div className="lab-step-foot">
            <Button block variant="danger-soft" icon={Undo2} onClick={handleRevoke} disabled={!hasAllowance}>
              Thu hồi approval
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-2 mt-24">
        <Card title="Điều kẻ tấn công thật làm được" subtitle="Minh hoạ từ bài test Drainer trong repo">
          <div className="stack" style={{ "--gap": "14px" }}>
            <pre className="code-snippet">{DRAINER_SNIPPET}</pre>
            <ul className="check-list text-sm muted">
              <li>
                <ShieldX size={16} className="danger-icon" aria-hidden="true" />
                <span>Approval không tự hết hạn và áp dụng cả cho token bạn nhận thêm sau này.</span>
              </li>
              <li>
                <ShieldCheck size={16} className="success-icon" aria-hidden="true" />
                <span>Chỉ approve đúng số lượng cần dùng, rà soát approval định kỳ hằng tháng.</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card title="Giao dịch gần đây" padded={false}>
          {transactions.length === 0 ? (
            <p className="card-body text-sm muted">Chưa có giao dịch nào.</p>
          ) : (
            <ul className="tx-list">
              {transactions.map((tx) => (
                <li key={tx.hash}>
                  <span className={`tx-dot tone-${tx.tone}`} aria-hidden="true" />
                  <div className="grow">
                    <div className="mono text-sm">{tx.action}</div>
                    <div className="text-xs subtle">
                      {tx.detail} · {tx.time}
                    </div>
                  </div>
                  {explorerTxUrl(tx.hash) ? (
                    <a className="tx-hash mono" href={explorerTxUrl(tx.hash)} target="_blank" rel="noreferrer">
                      {shortHash(tx.hash, 4)} <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="tx-hash mono">{shortHash(tx.hash, 4)}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
