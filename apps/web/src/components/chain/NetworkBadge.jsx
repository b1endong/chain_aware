import { CURRENT_CHAIN } from "../../constants/chain";

/** wrongNetwork: TODO so sánh chainId của ví với CHAIN_ID */
export default function NetworkBadge({ wrongNetwork = false }) {
  return (
    <span className={`network-badge ${wrongNetwork ? "is-wrong" : ""}`} title={wrongNetwork ? "Ví đang ở sai mạng" : CURRENT_CHAIN.name}>
      <span className="network-dot" aria-hidden="true" />
      {wrongNetwork ? "Sai mạng" : CURRENT_CHAIN.shortName}
    </span>
  );
}
