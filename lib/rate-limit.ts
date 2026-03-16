// 📁 파일 경로: lib/rate-limit.ts
// Rate Limiting 설정

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// 인증 API: 분당 10회
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

// 후원 API: 분당 5회
export const donationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:donation",
});
