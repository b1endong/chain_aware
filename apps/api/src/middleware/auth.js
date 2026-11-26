import jwt from "jsonwebtoken";

const COOKIE = "session";

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Thiếu JWT_SECRET trong .env");
  return secret;
}

// Đặt cookie phiên đăng nhập (8 giờ)
export function setSession(res, user) {
    console.log(user)
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret(), { algorithm: "HS256", expiresIn: "8h" });
    res.cookie(COOKIE, token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 8 * 60 * 60 * 1000,
    });
}

export function clearSession(res) {
  res.clearCookie(COOKIE);
}

// Kiểm tra đăng nhập hay chưa
//requireAuth() cho mọi người đã đăng nhập; requireAuth("admin") cho route admin. */
export function requireAuth(role) {
  return (req, res, next) => {
    const token = req.cookies?.[COOKIE];
    if (!token) return res.status(401).json({ error: "unauthenticated" });
    try {
      // Khóa cứng thuật toán để chặn tấn công đổi "alg"
      const user = jwt.verify(token, jwtSecret(), { algorithms: ["HS256"] });
      if (role && user.role !== role) return res.status(403).json({ error: "forbidden" });
      req.user = user; // { id, role }
      next();
    } catch {
      return res.status(401).json({ error: "unauthenticated" });
    }
  };
}