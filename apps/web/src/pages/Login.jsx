import { Link } from "react-router-dom";
import { Eye, LockKeyhole, LogIn, Mail } from "lucide-react";
import { Alert, Button, TextField } from "../components/ui";

export default function Login() {
  // TODO: state cho form, loading, lỗi
  const error = null; // vd. getErrorMessage("invalid_credentials")
  const loading = false;

  // TODO: POST /api/auth/login { email, password } → cookie session → điều hướng /dashboard
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="auth-head">
        <h1>Đăng nhập</h1>
        <p className="muted">Chào mừng trở lại! Tiếp tục hành trình bảo mật Web3 của bạn.</p>
      </div>

      {error && (
        <Alert tone="danger" className="auth-alert">
          {error}
        </Alert>
      )}

      <form className="stack" style={{ "--gap": "18px" }} onSubmit={handleSubmit} noValidate>
        <TextField label="Email" name="email" type="email" icon={Mail} placeholder="ban@congty.com" autoComplete="email" required />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          icon={LockKeyhole}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          addon={
            // TODO: bật/tắt hiển thị mật khẩu
            <button type="button" className="icon-btn" aria-label="Hiện mật khẩu">
              <Eye size={16} />
            </button>
          }
        />
        <Button type="submit" size="lg" block icon={LogIn} loading={loading}>
          Đăng nhập
        </Button>
      </form>

      <p className="auth-switch">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </>
  );
}
