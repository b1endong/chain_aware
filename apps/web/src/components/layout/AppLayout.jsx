import { NavLink, Outlet } from "react-router-dom";
import { Award, ChartColumn, FlaskConical, LayoutDashboard, LogOut, Wallet } from "lucide-react";
import Logo from "./Logo";
import Footer from "./Footer";
import NetworkBadge from "../chain/NetworkBadge";
import WalletChip from "../chain/WalletChip";
import { initials } from "../../lib/format";
import { mockUser } from "../../mocks/data";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/lab", label: "Thực hành", icon: FlaskConical },
  { to: "/certificate", label: "Chứng chỉ", icon: Award },
  { to: "/profile", label: "Ví & hồ sơ", icon: Wallet },
];

/** Khung cho các trang sau khi đăng nhập */
export default function AppLayout() {
  // TODO: lấy user từ GET /api/me (context / store), chuyển về /login nếu 401
  const user = mockUser;

  // TODO: gọi POST /api/auth/logout rồi điều hướng về /login
  function handleLogout() {}

  return (
    <>
      <header className="app-header">
        <div className="container app-header-inner">
          <Logo to="/dashboard" />

          <nav className="nav" aria-label="Điều hướng chính">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="nav-link">
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            {user.role === "admin" && (
              <NavLink to="/admin" className="nav-link">
                <ChartColumn size={17} aria-hidden="true" />
                Quản trị
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            <NetworkBadge />
            <WalletChip address={user.wallet_address} />
            <div className="user-chip">
              <span className="avatar" title={`${user.username} · ${user.email}`} aria-hidden="true">
                {initials(user.username)}
              </span>
              {/* Ẩn trên header hẹp (xem .user-meta trong layout.css) */}
              <div className="user-meta">
                <div className="user-name">{user.username}</div>
                <div className="user-role">{user.role === "admin" ? "Quản trị viên" : "Học viên"}</div>
              </div>
              <button type="button" className="icon-btn" aria-label="Đăng xuất" title="Đăng xuất" onClick={handleLogout}>
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
}
