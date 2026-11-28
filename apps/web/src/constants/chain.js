// Cấu hình chain & địa chỉ contract.
// Đặt trong apps/web/.env, ví dụ:
//   VITE_CHAIN_ID=202601
//   VITE_TRACKER_ADDRESS=0x...
//   VITE_CERTIFICATE_ADDRESS=0x...
//   VITE_TOKEN_ADDRESS=0x...
//   VITE_SINK_ADDRESS=0x...
// (Lấy từ log của script/Deploy.s.sol.) Giá trị mặc định bên dưới chỉ để hiển thị mẫu.

export const CHAINS = {
  202601: {
    name: "Saigon Testnet",
    shortName: "Saigon",
    explorer: "https://saigon-app.roninchain.com",
  },
  31337: {
    name: "Anvil (local)",
    shortName: "Anvil",
    explorer: null,
  },
};

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 202601);
export const CURRENT_CHAIN = CHAINS[CHAIN_ID] ?? { name: `Chain ${CHAIN_ID}`, shortName: `#${CHAIN_ID}`, explorer: null };

export const CONTRACTS = {
  tracker: import.meta.env.VITE_TRACKER_ADDRESS ?? "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  certificate: import.meta.env.VITE_CERTIFICATE_ADDRESS ?? "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
  token: import.meta.env.VITE_TOKEN_ADDRESS ?? "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  sink: import.meta.env.VITE_SINK_ADDRESS ?? "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

// EIP-712 domain — khớp apps/api/src/attestation.js và CompleteTracker (EIP712("ChainAware", "1"))
export const EIP712_DOMAIN = {
  name: "ChainAware",
  version: "1",
  chainId: CHAIN_ID,
  verifyingContract: CONTRACTS.tracker,
};

export function explorerTxUrl(hash) {
  return CURRENT_CHAIN.explorer ? `${CURRENT_CHAIN.explorer}/tx/${hash}` : null;
}

export function explorerAddressUrl(address) {
  return CURRENT_CHAIN.explorer ? `${CURRENT_CHAIN.explorer}/address/${address}` : null;
}
