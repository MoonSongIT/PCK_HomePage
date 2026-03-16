// 📁 파일 경로: lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 금액을 한국 원 형식으로 포맷한다.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 날짜를 한국 형식으로 포맷한다.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * 후원자 이름을 익명 처리한다.
 * "홍길동" → "홍○○"
 */
export function anonymizeName(name: string): string {
  if (!name || name.length === 0) return "익명";
  if (name.length === 1) return name;
  if (name.length === 2) return name[0] + "○";
  return name[0] + "○".repeat(name.length - 1);
}
