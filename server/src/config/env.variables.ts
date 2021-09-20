import dotenv from 'dotenv';
// import assert from 'assert';

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
} = process.env;

function pleaseSpecify(toSpecify: string): string {
  return `Please specify ${toSpecify} in the .env file`;
}

const PORT = assert(port, pleaseSpecify('the port'));

const FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT = assert(
  firebaseCredential,
  pleaseSpecify('the firebase service account configuration')
);
const SESSION_PRIVATE_KEY = assert(
  sessionKey,
  pleaseSpecify('a private key for express-session')
);
const HASH_CONFIG_DIGEST = assert(hashDigest, pleaseSpecify('the hash digest'));

const FIREBASE_CONFIG = JSON.parse(FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT);

const HASH_CONFIG_ITERATION = Number.parseInt(
  assert(hashIteration, pleaseSpecify('the hash iteration number')),
  10
);

const HASH_CONFIG_KEYLEN = Number.parseInt(
  assert(hashKeylen, pleaseSpecify('the hash key length')),
  10
);

const HASH_CONFIG_SALT_LEN = Number.parseInt(
  assert(saltLen, pleaseSpecify('the hash salt length')),
  10
);

export {
  PORT,
  FIREBASE_CONFIG,
  SESSION_PRIVATE_KEY,
  HASH_CONFIG_DIGEST,
  HASH_CONFIG_ITERATION,
  HASH_CONFIG_KEYLEN,
  HASH_CONFIG_SALT_LEN,
};
