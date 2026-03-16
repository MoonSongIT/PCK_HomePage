// 📁 파일 경로: __tests__/lib/validations.test.ts

import { describe, it, expect } from "vitest";
import { apiKeyCreateSchema } from "@/lib/validations/api-key.schema";
import { donationCreateSchema } from "@/lib/validations/donation.schema";
import { expenseCreateSchema } from "@/lib/validations/finance.schema";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";

describe("apiKeyCreateSchema", () => {
  it("유효한 데이터를 검증한다", () => {
    const valid = {
      serviceName: "OpenAI GPT-4o",
      keyIdentifier: "OPENAI_API_KEY",
      keyValue: "sk-test-12345",
      description: "테스트용",
      isActive: true,
    };
    expect(apiKeyCreateSchema.parse(valid)).toBeDefined();
  });

  it("keyIdentifier가 소문자면 실패한다", () => {
    const invalid = {
      serviceName: "Test",
      keyIdentifier: "openai_key",
      keyValue: "sk-test",
    };
    expect(() => apiKeyCreateSchema.parse(invalid)).toThrow();
  });

  it("빈 serviceName은 실패한다", () => {
    const invalid = {
      serviceName: "",
      keyIdentifier: "TEST_KEY",
      keyValue: "sk-test",
    };
    expect(() => apiKeyCreateSchema.parse(invalid)).toThrow();
  });
});

describe("donationCreateSchema", () => {
  it("유효한 후원 데이터를 검증한다", () => {
    const valid = {
      donorName: "홍길동",
      donorEmail: "test@example.com",
      amount: 50000,
      isRecurring: false,
      paymentMethod: "card",
    };
    expect(donationCreateSchema.parse(valid)).toBeDefined();
  });

  it("1000원 미만은 실패한다", () => {
    const invalid = {
      donorName: "홍길동",
      donorEmail: "test@example.com",
      amount: 500,
      isRecurring: false,
      paymentMethod: "card",
    };
    expect(() => donationCreateSchema.parse(invalid)).toThrow();
  });

  it("잘못된 이메일은 실패한다", () => {
    const invalid = {
      donorName: "홍길동",
      donorEmail: "invalid-email",
      amount: 10000,
      isRecurring: false,
      paymentMethod: "card",
    };
    expect(() => donationCreateSchema.parse(invalid)).toThrow();
  });
});

describe("expenseCreateSchema", () => {
  it("유효한 지출 데이터를 검증한다", () => {
    const valid = {
      title: "사무용품 구입",
      amount: 50000,
      category: "OPERATIONS" as const,
      expenseDate: "2024-01-15",
      isPublic: true,
    };
    expect(expenseCreateSchema.parse(valid)).toBeDefined();
  });

  it("잘못된 카테고리는 실패한다", () => {
    const invalid = {
      title: "Test",
      amount: 1000,
      category: "INVALID",
      expenseDate: "2024-01-15",
    };
    expect(() => expenseCreateSchema.parse(invalid)).toThrow();
  });
});

describe("loginSchema", () => {
  it("유효한 로그인 데이터를 검증한다", () => {
    const valid = {
      email: "test@example.com",
      password: "password123",
    };
    expect(loginSchema.parse(valid)).toBeDefined();
  });

  it("8자 미만 비밀번호는 실패한다", () => {
    const invalid = { email: "test@example.com", password: "short" };
    expect(() => loginSchema.parse(invalid)).toThrow();
  });
});

describe("registerSchema", () => {
  it("유효한 회원가입 데이터를 검증한다", () => {
    const valid = {
      name: "홍길동",
      email: "test@example.com",
      password: "password1",
      confirmPassword: "password1",
    };
    expect(registerSchema.parse(valid)).toBeDefined();
  });

  it("비밀번호 불일치 시 실패한다", () => {
    const invalid = {
      name: "홍길동",
      email: "test@example.com",
      password: "password1",
      confirmPassword: "password2",
    };
    expect(() => registerSchema.parse(invalid)).toThrow();
  });

  it("영문만 있는 비밀번호는 실패한다", () => {
    const invalid = {
      name: "홍길동",
      email: "test@example.com",
      password: "onlyletters",
      confirmPassword: "onlyletters",
    };
    expect(() => registerSchema.parse(invalid)).toThrow();
  });
});
