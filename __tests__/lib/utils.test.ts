// 📁 파일 경로: __tests__/lib/utils.test.ts

import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, anonymizeName, cn } from "@/lib/utils";

describe("formatCurrency", () => {
  it("원화 형식으로 포맷한다", () => {
    expect(formatCurrency(50000)).toContain("50,000");
  });

  it("0원을 포맷한다", () => {
    expect(formatCurrency(0)).toContain("0");
  });
});

describe("formatDate", () => {
  it("한국어 날짜 형식으로 포맷한다", () => {
    const result = formatDate("2024-03-15");
    expect(result).toContain("2024");
    expect(result).toContain("3");
    expect(result).toContain("15");
  });
});

describe("anonymizeName", () => {
  it("이름을 익명 처리한다", () => {
    expect(anonymizeName("홍길동")).toBe("홍○○");
  });

  it("2자 이름을 익명 처리한다", () => {
    expect(anonymizeName("홍길")).toBe("홍○");
  });

  it("빈 문자열은 '익명'을 반환한다", () => {
    expect(anonymizeName("")).toBe("익명");
  });

  it("1자 이름은 그대로 반환한다", () => {
    expect(anonymizeName("홍")).toBe("홍");
  });
});

describe("cn", () => {
  it("클래스를 병합한다", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("조건부 클래스를 처리한다", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });
});
