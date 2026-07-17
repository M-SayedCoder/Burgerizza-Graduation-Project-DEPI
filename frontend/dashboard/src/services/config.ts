/**
 * Per-module mock flags.
 *
 * 🟡 true  = يستخدم Mock Data (البيانات الوهمية) — البيانات الوهمية شغالة
 * ✅ false = متصل بالـ Backend الحقيقي على port 5000
 *
 * ─────────────────────────────────────────────────────────
 * لما Backend module يكون جاهز وشغال، غيّر قيمته لـ false
 * ─────────────────────────────────────────────────────────
 */
export const MOCK = {
  auth: false,
  menu: false,
  orders: false,
  reservations: false,
  inventory: false,
  admin: false,
  notifications: false,
} as const;

// للتوافق مع الملفات القديمة
export const USE_MOCK = MOCK.auth;

/** تأخير مصطنع في وضع Mock لمحاكاة الشبكة */
export const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));
