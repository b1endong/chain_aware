import { Outlet } from "react-router-dom";
import Logo from "./Logo";
import Footer from "./Footer";
import { Button } from "../ui";

/** Khung cho trang công khai (landing) */
export default function PublicLayout() {
  return (
    <>
      <header className="public-header">
        <div className="container public-header-inner">
          <Logo onDark />
          <nav className="public-nav" aria-label="Điều hướng trang chủ">
            <a href="#modules">Khoá học</a>
            <a href="#how">Quy trình</a>
            <a href="#standards">Tiêu chuẩn</a>
          </nav>
          <div className="header-actions">
            <Button to="/login" variant="on-dark" size="sm">
              Đăng nhập
            </Button>
            <Button to="/register" size="sm">
              Đăng ký
            </Button>
          </div>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
