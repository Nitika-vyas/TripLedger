import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Generates a random temporary password (used when a super admin creates a tenant without setting one). */
export function generateTempPassword(): string {
  return crypto.randomBytes(9).toString("base64url"); // 12 chars, URL-safe
}
