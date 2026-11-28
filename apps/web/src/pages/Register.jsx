import { Link } from "react-router-dom";
import { Eye, LockKeyhole, Mail, User, UserPlus } from "lucide-react";
import { Alert, Button, TextField } from "../components/ui";

export default function Register() {
  // TODO: state cho form, loading, lỗi theo từng trường
  const error = null; // vd. getErrorMessage("already_registered")
  const fieldErrors = {}; // vd. { confirm: "Mật khẩu nhập lại không khớp" }
  const loading = false;

  // TODO: POST /api/auth/register { username, email, password } → điều hướng /login
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="auth-head">
        <h1>Tạo tài khoản</h1>
        <p className="muted">Miễn phí. Bạn có thể liên kết ví sau khi đăng ký.</p>
      </div>

      {error && (
        <Alert tone="danger" className="auth-alert">
          {error}
        </Alert>
      )}

      <form className="stack" style={{ "--gap": "18px" }} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Họ và tên"
          name="username"
          icon={User}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          required
          error={fieldErrors.username}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="ban@congty.com"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          icon={LockKeyhole}
          placeholder="Tối thiểu 8 ký tự"
          autoComplete="new-password"
          required
          hint="Dùng mật khẩu riêng cho ChainAware — đừng tái sử dụng mật khẩu ví hay email."
          error={fieldErrors.password}
          addon={
            <button type="button" className="icon-btn" aria-label="Hiện mật khẩu">
              <Eye size={16} />
            </button>
          }
        />
        <TextField
          label="Nhập lại mật khẩu"
          name="confirm"
          type="password"
          icon={LockKeyhole}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={fieldErrors.confirm}
        />
        <Button type="submit" size="lg" block icon={UserPlus} loading={loading}>
          Đăng ký
        </Button>
      </form>

      <p className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </>
  );
}
