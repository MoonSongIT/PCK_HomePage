// 📁 파일 경로: lib/crypto.ts
// AES-256-GCM 암호화/복호화 유틸리티 — API Key 등 민감 정보 암호화용

import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getMasterKey(): Buffer {
  const key = process.env.ENCRYPTION_MASTER_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY must be a 64-character hex string (32 bytes)"
    );
  }
  return Buffer.from(key, "hex");
}

/**
 * AES-256-GCM으로 평문을 암호화한다.
 * @returns 암호화된 값, IV, AuthTag (모두 hex 문자열)
 */
export function encrypt(plaintext: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const masterKey = getMasterKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, masterKey, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * AES-256-GCM으로 암호화된 값을 복호화한다.
 */
export function decrypt(
  encrypted: string,
  iv: string,
  tag: string
): string {
  const masterKey = getMasterKey();
  const decipher = createDecipheriv(
    ALGORITHM,
    masterKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * API Key의 마지막 4자리를 추출한다 (마스킹 표시용).
 */
export function getLastFourChars(plaintext: string): string {
  if (plaintext.length <= 4) return plaintext;
  return plaintext.slice(-4);
}
