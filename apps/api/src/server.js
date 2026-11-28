import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pg from "pg";
import { authRouter } from "./routes/auth.js"
import { walletRouter } from "./routes/wallet.js";
import { learnerRouter } from "./routes/learner.js";
import { adminRouter } from "./routes/admin.js";

if (!process.env.DATABASE_URL) {
  throw new Error("Thiếu DATABASE_URL trong .env");
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use("/api", authRouter(db), walletRouter(db), learnerRouter(db), adminRouter(db));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
