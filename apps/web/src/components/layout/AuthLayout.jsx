import { Outlet } from "react-router-dom";
import { BadgeCheck, BookOpen, ShieldCheck } from "lucide-react";
import Logo from "./Logo";

/** Khung chia đôi cho trang Đăng nhập / Đăng ký */
export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo onDark />

        <div className="auth-aside-body">
          <h2>Bảo vệ tài sản số bắt đầu từ thói quen đúng.</h2>
          <ul className="auth-points">
            <li>
              <BookOpen size={18} aria-hidden="true" />
              <span>3 module thực tế: ví & seed phrase, phishing, token approval</span>
            </li>
            <li>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>Bám sát ISO/IEC 27001:2022 và SOC 2</span>
            </li>
            <li>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>Chứng chỉ Soulbound ghi trên blockchain, không thể làm giả</span>
            </li>
          </ul>
        </div>

        <blockquote className="auth-tip">
          <strong>Mẹo bảo mật</strong>
          <p>Không một dịch vụ hợp pháp nào yêu cầu seed phrase hay private key của bạn — kể cả ChainAware.</p>
        </blockquote>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
