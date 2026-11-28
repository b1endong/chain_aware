import { CURRENT_CHAIN } from "../../constants/chain";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>© {YEAR} ChainAware · Đào tạo nhận thức bảo mật Web3</span>
        <div className="site-footer-links">
          <span>Mạng: {CURRENT_CHAIN.name}</span>
          <span>ISO/IEC 27001:2022 · SOC 2</span>
        </div>
      </div>
    </footer>
  );
}
