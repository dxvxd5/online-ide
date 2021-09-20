import crypto from 'crypto';
import {
  HASH_CONFIG_DIGEST,
  HASH_CONFIG_ITERATION,
  HASH_CONFIG_KEYLEN,
  HASH_CONFIG_SALT_LEN,
} from '../config/env.variables';

interface HashInfo {
  hash: string;
  salt: string;
}

function computeHash(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(
      password,
      salt,
      HASH_CONFIG_ITERATION,
      HASH_CONFIG_KEYLEN,
      HASH_CONFIG_DIGEST
    )
    .toString('hex');
}

export function isPasswordValid(
  password: string,
  hash: string,
  salt: string
): boolean {
  const checkHash = computeHash(password, salt);
  return checkHash === hash;
}

export function hashPassword(password: string): HashInfo {
  const salt = crypto.randomBytes(HASH_CONFIG_SALT_LEN).toString('hex');
  const hash = computeHash(password, salt);
  return { hash, salt };
}
