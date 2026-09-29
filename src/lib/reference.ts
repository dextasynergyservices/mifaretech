import { randomBytes } from "node:crypto";

/**
 * Generates an 8-character hexadecimal reference code formatted as MFT-XXXXXXXX
 */
export function generateReference(): string {
  return `MFT-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/**
 * Validates whether a reference matches the MFT-XXXXXXXX pattern
 */
export function isValidReference(ref: string): boolean {
  return /^MFT-[0-9A-F]{8}$/.test(ref);
}
