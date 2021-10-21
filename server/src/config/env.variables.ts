import dotenv from 'dotenv';

dotenv.config();

function assert(value: string | undefined, message: string): string {
  if (!value) throw new Error(message);
  return value;
}

const {
  PORT: port,
  FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT: firebaseCredential,
  SESSION_PRIVATE_KEY: sessionKey,
  HASH_CONFIG_ITERATION: hashIteration,
  HASH_CONFIG_KEYLEN: hashKeylen,
  HASH_CONFIG_DIGEST: hashDigest,
  HASH_CONFIG_SALT_LEN: saltLen,
  REALTIME_DB_URL: rtimeDB,
} = process.env;

function pleaseSpecify(toSpecify: string): string {
  return `Please specify ${toSpecify} in the .env file`;
}

export const PORT = assert(port, pleaseSpecify('the port'));

const FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT = assert(
  firebaseCredential,
  pleaseSpecify('the firebase service account configuration')
);
export const REALTIME_DB_URL = assert(
  rtimeDB,
  pleaseSpecify('the realtime database url')
);
export const SESSION_PRIVATE_KEY = assert(
  sessionKey,
  pleaseSpecify('a private key for express-session')
);
export const HASH_CONFIG_DIGEST = assert(
  hashDigest,
  pleaseSpecify('the hash digest')
);

export const FIREBASE_CONFIG = JSON.parse(FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT);

export const HASH_CONFIG_ITERATION = Number.parseInt(
  assert(hashIteration, pleaseSpecify('the hash iteration number')),
  10
);

export const HASH_CONFIG_KEYLEN = Number.parseInt(
  assert(hashKeylen, pleaseSpecify('the hash key length')),
  10
);

export const HASH_CONFIG_SALT_LEN = Number.parseInt(
  assert(saltLen, pleaseSpecify('the hash salt length')),
  10
);
