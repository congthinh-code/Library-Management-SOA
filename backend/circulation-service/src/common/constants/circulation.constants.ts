export const CIRCULATION_RULES = {
  DEFAULT_LOAN_DAYS: 14,
  MAX_ACTIVE_BOOKS_PER_READER: 5,
  IDEMPOTENCY_TTL_MS: 5 * 60 * 1000, // 5 phút chống gửi trùng request
} as const;