// 📁 파일 경로: __tests__/lib/crypto.test.ts

import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt, getLastFourChars } from "@/lib/crypto";

// 테스트용 마스터 키 설정 (64자리 hex = 32바이트)
beforeAll(() => {
  process.env.ENCRYPTION_MASTER_KEY =
    "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
});

describe("encrypt / decrypt", () => {
  it("평문을 암호화하고 복호화하면 원문이 반환된다", () => {
    const plaintext = "sk-test-key-1234567890abcdef";
    const { encrypted, iv, tag } = encrypt(plaintext);

    expect(encrypted).toBeDefined();
    expect(iv).toBeDefined();
    expect(tag).toBeDefined();
    expect(encrypted).not.toBe(plaintext);

    const decrypted = decrypt(encrypted, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it("같은 평문이라도 매번 다른 암호문을 생성한다 (IV가 랜덤)", () => {
    const plaintext = "test-api-key";
    const result1 = encrypt(plaintext);
    const result2 = encrypt(plaintext);

    expect(result1.encrypted).not.toBe(result2.encrypted);
    expect(result1.iv).not.toBe(result2.iv);
  });

  it("빈 문자열도 암호화/복호화할 수 있다", () => {
    const { encrypted, iv, tag } = encrypt("");
    const decrypted = decrypt(encrypted, iv, tag);
    expect(decrypted).toBe("");
  });

  it("긴 문자열도 정상적으로 암호화/복호화된다", () => {
    const longKey = "a".repeat(500);
    const { encrypted, iv, tag } = encrypt(longKey);
    const decrypted = decrypt(encrypted, iv, tag);
    expect(decrypted).toBe(longKey);
  });

  it("잘못된 tag로 복호화하면 에러가 발생한다", () => {
    const { encrypted, iv } = encrypt("test");
    const wrongTag = "0000000000000000000000000000000000000000";

    expect(() => decrypt(encrypted, iv, wrongTag)).toThrow();
  });

  it("잘못된 iv로 복호화하면 에러가 발생한다", () => {
    const { encrypted, tag } = encrypt("test");
    const wrongIv = "00000000000000000000000000000000";

    expect(() => decrypt(encrypted, wrongIv, tag)).toThrow();
  });
});

describe("getLastFourChars", () => {
  it("문자열의 마지막 4자리를 반환한다", () => {
    expect(getLastFourChars("sk-1234567890abcdef")).toBe("cdef");
  });

  it("4자 이하인 경우 전체를 반환한다", () => {
    expect(getLastFourChars("abcd")).toBe("abcd");
    expect(getLastFourChars("ab")).toBe("ab");
    expect(getLastFourChars("a")).toBe("a");
  });
});
