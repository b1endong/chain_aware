import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui";

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-code mono">404</span>
      <h1>Không tìm thấy trang</h1>
      <p className="muted">Đường dẫn có thể đã thay đổi. Hãy luôn kiểm tra kỹ URL — đó cũng là một thói quen bảo mật tốt.</p>
      <Button to="/" icon={ArrowLeft}>
        Về trang chủ
      </Button>
    </div>
  );
}
