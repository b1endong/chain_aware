// Helper định dạng hiển thị (thuần UI, không gọi API)

export function shortAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function shortHash(hash, chars = 6) {
  if (!hash) return "";
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}

export function formatNumber(value, options) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("vi-VN", options).format(Number(value));
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

/** Số giây còn lại → "mm:ss" */
export function formatCountdown(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** id 0 → "01" */
export function moduleCode(id) {
  return String(Number(id) + 1).padStart(2, "0");
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Module đã được ghi on-chain chưa (CompleteTracker.completeMask, bit = 1 << moduleId) */
export function isCompletedOnchain(completeMask, moduleId) {
  return ((Number(completeMask) >> Number(moduleId)) & 1) === 1;
}

/** Trạng thái hiển thị: not_started | in_progress | passed | onchain */
export function getModuleStatus(module, completeMask = 0) {
  if (isCompletedOnchain(completeMask, module.id)) return "onchain";
  if (module.passed) return "passed";
  if (module.enrolled) return "in_progress";
  return "not_started";
}

/** Tạo id cho heading (hỗ trợ tiếng Việt) */
export function slugify(text = "") {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lấy danh sách heading cấp 2 (##) trong markdown để làm mục lục */
export function getMarkdownHeadings(markdown = "") {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.slice(3).trim();
      return { text, id: slugify(text) };
    });
}
